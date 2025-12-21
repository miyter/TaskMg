// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: WriteBatchの導入、order計算の堅牢化、冗長なソートの削除
 */

import {
    collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp, writeBatch
} from "../core/firebase-sdk.js";

import { auth, db } from "../core/firebase.js";
import { showMessageModal } from '../ui/components.js';
import { paths } from '../utils/paths.js';

let timeBlocks = [];

const defaultTimeBlocks = [
    { id: 'tb_morning', name: '06:00 - 09:00', start: '06:00', end: '09:00', color: '#EF4444', order: 0 },
    { id: 'tb_afternoon', name: '13:00 - 17:00', start: '13:00', end: '17:00', color: '#3B82F6', order: 1 },
    { id: 'tb_night', name: '20:00 - 22:00', start: '20:00', end: '22:00', color: '#8B5CF6', order: 2 }
];

export function subscribeToTimeBlocks(callback) {
    const userId = auth.currentUser?.uid;

    if (!userId) {
        timeBlocks = [...defaultTimeBlocks];
        if (callback) callback(timeBlocks);
        return () => { };
    }

    const path = paths.timeblocks(userId);
    const q = query(collection(db, path), orderBy('order', 'asc'));

    return onSnapshot(q, (snapshot) => {
        timeBlocks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        if (callback) callback(timeBlocks);
    }, (error) => {
        console.error("[TimeBlocks] Subscription error:", error);
    });
}

export function getTimeBlocks() {
    // Firestore側でソート済みのためそのまま返す
    return [...timeBlocks];
}

export function getTimeBlockById(id) {
    return timeBlocks.find(b => b.id === id);
}

export function clearTimeBlocksCache() {
    timeBlocks = [];
}

export async function saveTimeBlock(block) {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        showMessageModal("ログインが必要です");
        return;
    }

    try {
        const path = paths.timeblocks(userId);
        const id = block.id || crypto.randomUUID();

        // 安全なorder計算: 既存の最大値 + 1
        const nextOrder = block.order !== undefined
            ? block.order
            : Math.max(...timeBlocks.map(b => b.order), -1) + 1;

        const dataToSave = {
            name: block.name,
            start: block.start,
            end: block.end,
            color: block.color,
            order: nextOrder,
            updatedAt: serverTimestamp()
        };

        await setDoc(doc(db, path, id), dataToSave, { merge: true });
        return true;
    } catch (e) {
        console.error("[TimeBlocks] Save error:", e);
        showMessageModal("保存に失敗した。");
    }
}

export async function deleteTimeBlock(id) {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
        const path = paths.timeblocks(userId);
        await deleteDoc(doc(db, path, id));
        return true;
    } catch (e) {
        console.error("[TimeBlocks] Delete error:", e);
    }
}

export async function updateTimeBlockOrder(orderedIds) {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
        const path = paths.timeblocks(userId);
        const batch = writeBatch(db);

        orderedIds.forEach((id, index) => {
            const ref = doc(db, path, id);
            batch.update(ref, { order: index });
        });

        await batch.commit();
    } catch (e) {
        console.error("[TimeBlocks] Order update error:", e);
    }
}