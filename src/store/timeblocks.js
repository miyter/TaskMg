// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: paths.jsへの依存統合、workspaceId依存の排除
 */

import { 
    collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp 
} from "../core/firebase-sdk.js";

import { auth, db } from "../core/firebase.js";
import { showMessageModal } from '../ui/components.js';
import { paths } from '../utils/paths.js';

// メモリキャッシュ
let timeBlocks = [];

// デフォルトの時間帯データ
const defaultTimeBlocks = [
    { id: 'tb_morning', name: '06:00 - 09:00', start: '06:00', end: '09:00', color: '#EF4444', order: 0 },
    { id: 'tb_afternoon', name: '13:00 - 17:00', start: '13:00', end: '17:00', color: '#3B82F6', order: 1 },
    { id: 'tb_night', name: '20:00 - 22:00', start: '20:00', end: '22:00', color: '#8B5CF6', order: 2 }
];

/**
 * 時間帯ブロックをリアルタイム購読する
 */
export function subscribeToTimeBlocks(callback) {
    const userId = auth.currentUser?.uid;
    
    // 未ログイン時はデフォルトデータを返す
    if (!userId) {
        timeBlocks = [...defaultTimeBlocks]; 
        if (callback) callback(timeBlocks);
        return () => {};
    }

    const path = paths.timeblocks(userId);
    const q = query(collection(db, path), orderBy('order', 'asc'));

    return onSnapshot(q, (snapshot) => {
        const newBlocks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        timeBlocks = newBlocks;
        if (callback) callback(timeBlocks);
    }, (error) => {
        console.error("Timeblocks subscription error:", error);
    });
}

/**
 * 全ての時間帯ブロックを取得 (同期的にキャッシュを返す)
 */
export function getTimeBlocks() {
    return [...timeBlocks].sort((a, b) => a.order - b.order);
}

/**
 * IDからブロック詳細を取得
 */
export function getTimeBlockById(id) {
    return timeBlocks.find(b => b.id === id);
}

/**
 * キャッシュをクリアする
 */
export function clearTimeBlocksCache() {
    timeBlocks = [];
}

/**
 * 時間帯ブロックを保存 (追加/更新)
 */
export async function saveTimeBlock(block) {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        showMessageModal("ログインが必要です");
        throw new Error("Authentication required");
    }

    const path = paths.timeblocks(userId);
    const id = block.id || crypto.randomUUID();
    
    // 順序設定: 新規の場合は末尾に追加
    let order = block.order;
    if (order === undefined) {
        order = timeBlocks.length;
    }

    const dataToSave = {
        name: block.name,
        start: block.start,
        end: block.end,
        color: block.color,
        order: order,
        updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, path, id), dataToSave, { merge: true });
    return true;
}

/**
 * 時間帯ブロックを削除
 */
export async function deleteTimeBlock(id) {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        throw new Error("Authentication required");
    }

    const path = paths.timeblocks(userId);
    await deleteDoc(doc(db, path, id));
    return true;
}

/**
 * 時間帯ブロックの順序を更新
 */
export async function updateTimeBlockOrder(orderedIds) {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const path = paths.timeblocks(userId);
    const batchPromises = orderedIds.map((id, index) => {
        return setDoc(doc(db, path, id), { order: index }, { merge: true });
    });

    await Promise.all(batchPromises);
}