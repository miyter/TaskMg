// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: serverTimestamp導入、paths利用によるパス統一、エラーハンドリング追加
 */

import { 
    collection, addDoc, updateDoc, deleteDoc, doc, query, onSnapshot, serverTimestamp 
} from "../core/firebase-sdk.js";

import { getFirebase } from '../core/firebase.js';
import { paths } from '../utils/paths.js';

// ==========================================================
// ★ RAW FUNCTIONS (userId必須)
// ==========================================================

/**
 * ラベルデータのリアルタイムリスナーを開始する (RAW)
 */
export function subscribeToLabelsRaw(userId, onUpdate) {
    if (!userId) {
        onUpdate([]);
        return () => {};
    }

    const path = paths.labels(userId);
    const { db } = getFirebase();
    const q = query(collection(db, path));

    return onSnapshot(q, (snapshot) => {
        const labels = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        onUpdate(labels);
    }, (error) => {
        console.error("[Labels] Subscription error:", error);
        onUpdate([]);
    });
}

/**
 * 新しいラベルを追加する (RAW)
 */
export async function addLabelRaw(userId, name, color) {
    const path = paths.labels(userId);
    const { db } = getFirebase();

    await addDoc(collection(db, path), {
        name,
        color,
        ownerId: userId,
        createdAt: serverTimestamp() // 修正: サーバー時刻を使用
    });
}

/**
 * ラベルを更新する (RAW)
 */
export async function updateLabelRaw(userId, labelId, updates) {
    const path = paths.labels(userId);
    const { db } = getFirebase();
    const ref = doc(db, path, labelId);
    return updateDoc(ref, updates);
}

/**
 * ラベルを削除する (RAW)
 */
export async function deleteLabelRaw(userId, labelId) {
    const path = paths.labels(userId);
    const { db } = getFirebase();
    await deleteDoc(doc(db, path, labelId));
}