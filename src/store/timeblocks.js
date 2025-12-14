// @ts-nocheck
// 時間帯ブロックデータ管理 (Firestore対応版)

import { 
    getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { auth } from "../core/firebase.js";
import { getCurrentWorkspaceId } from './workspace.js';
import { showMessageModal } from '../ui/components.js'; // 追加

const db = getFirestore();
// 修正: GLOBAL_APP_ID に統一
const appId = (typeof window !== 'undefined' && window.GLOBAL_APP_ID) 
    ? window.GLOBAL_APP_ID 
    : 'default-app-id';

// メモリキャッシュ
let timeBlocks = [];
let unsubscribe = null;

// デフォルトの時間帯データ（初回用・未ログイン時用）
const defaultTimeBlocks = [
    { id: 'tb_morning', name: '06:00 - 09:00', start: '06:00', end: '09:00', color: '#EF4444', order: 0 },
    { id: 'tb_afternoon', name: '13:00 - 17:00', start: '13:00', end: '17:00', color: '#3B82F6', order: 1 },
    { id: 'tb_night', name: '20:00 - 22:00', start: '20:00', end: '22:00', color: '#8B5CF6', order: 2 }
];

/**
 * ユーザーIDを取得するヘルパー
 */
function getUserId() {
    return auth.currentUser?.uid;
}

/**
 * 時間帯ブロックのコレクションパスを取得
 * ワークスペースIDを含むパスを返す
 */
function getCollectionRef() {
    const userId = getUserId();
    const workspaceId = getCurrentWorkspaceId();
    
    // ユーザーまたはワークスペースが特定できない場合はnull
    if (!userId || !workspaceId) return null;
    
    return collection(db, 'artifacts', appId, 'workspaces', workspaceId, 'users', userId, 'timeblocks');
}

/**
 * キャッシュをクリアする (ワークスペース切り替え時などに使用)
 */
export function clearTimeBlocksCache() {
    timeBlocks = [];
}

/**
 * 時間帯ブロックをリアルタイム購読する
 * @param {Function} callback - 更新時に呼ばれるコールバック
 * @returns {Function} 購読解除関数
 */
export function subscribeToTimeBlocks(callback) {
    if (unsubscribe) unsubscribe();

    const colRef = getCollectionRef();
    
    // 未ログイン時またはワークスペース未選択時はデフォルトデータを返す
    if (!colRef) {
        timeBlocks = [...defaultTimeBlocks]; 
        if (callback) callback(timeBlocks);
        return () => {};
    }

    // orderでソートして取得
    const q = query(colRef, orderBy('order', 'asc'));

    unsubscribe = onSnapshot(q, (snapshot) => {
        const newBlocks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        timeBlocks = newBlocks;
        
        if (callback) callback(timeBlocks);
    }, (error) => {
        console.error("Timeblocks subscription error:", error);
    });

    // 呼び出し元で管理できる解除関数を返す
    return () => {
        if (unsubscribe) {
            unsubscribe();
            unsubscribe = null;
        }
    };
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
 * 時間帯ブロックを保存 (追加/更新)
 */
export async function saveTimeBlock(block) {
    const colRef = getCollectionRef();
    if (!colRef) {
        showMessageModal("ワークスペースを選択してください");
        throw new Error("ログインまたはワークスペース選択が必要です");
    }

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

    await setDoc(doc(colRef, id), dataToSave, { merge: true });
    return true;
}

/**
 * 時間帯ブロックを削除
 */
export async function deleteTimeBlock(id) {
    const colRef = getCollectionRef();
    if (!colRef) {
        showMessageModal("ワークスペースを選択してください");
        throw new Error("ログインまたはワークスペース選択が必要です");
    }

    await deleteDoc(doc(colRef, id));
    return true;
}

/**
 * 時間帯ブロックの順序を更新
 * @param {string[]} orderedIds - IDの配列
 */
export async function updateTimeBlockOrder(orderedIds) {
    const colRef = getCollectionRef();
    if (!colRef) {
        // ドラッグ操作中などはモーダルが邪魔になる可能性もあるが、不整合を防ぐため通知
        console.warn("Cannot update order: No workspace selected");
        return;
    }

    const batchPromises = orderedIds.map((id, index) => {
        return setDoc(doc(colRef, id), { order: index }, { merge: true });
    });

    await Promise.all(batchPromises);
}