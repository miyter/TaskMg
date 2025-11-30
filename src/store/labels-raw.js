// @ts-nocheck
// @miyter:20251125

import { collection, addDoc, updateDoc, deleteDoc, doc, query, onSnapshot } from "firebase/firestore"; // ★修正: updateDocをインポートに追加

// ★修正: ローカルモジュールへのインポートパスを相対パスに変更
import { db } from '../core/firebase.js';

// ==========================================================
// ★ RAW FUNCTIONS (userId必須) - ラッパー層からのみ呼び出し
// ==========================================================

/**
 * ラベルデータのリアルタイムリスナーを開始する (RAW)。
 * @param {string} userId - ユーザーID (必須)
 * @param {function} onUpdate - データ更新時に呼び出されるコールバック関数
 * @returns {function} リスナーを解除するための関数
 */
export function subscribeToLabelsRaw(userId, onUpdate) {
    const appId = window.GLOBAL_APP_ID;
    const path = `/artifacts/${appId}/users/${userId}/labels`;
    const q = query(collection(db, path));

    return onSnapshot(q, (snapshot) => {
        const labels = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        onUpdate(labels);
    });
}

/**
 * 新しいラベルを追加する (RAW)。
 * @param {string} userId - ユーザーID (必須)
 * @param {string} name - ラベル名
 * @param {string} color - ラベルの色 (HEXまたはTailwindクラス名)
 */
export async function addLabelRaw(userId, name, color) {
    const appId = window.GLOBAL_APP_ID;
    const path = `/artifacts/${appId}/users/${userId}/labels`;
    await addDoc(collection(db, path), {
        name,
        color,
        ownerId: userId,
        createdAt: new Date()
    });
}

/**
 * ラベルを更新する (RAW)。
 * @param {string} userId - ユーザーID (必須)
 * @param {string} labelId - ラベルID
 * @param {object} updates - 更新内容
 */
export async function updateLabelRaw(userId, labelId, updates) {
    const appId = window.GLOBAL_APP_ID;
    const path = `/artifacts/${appId}/users/${userId}/labels`;
    const ref = doc(db, path, labelId);
    return updateDoc(ref, updates);
}

/**
 * ラベルを削除する (RAW)。
 * @param {string} userId - ユーザーID (必須)
 * @param {string} labelId - ラベルID
 */
export async function deleteLabelRaw(userId, labelId) {
    const appId = window.GLOBAL_APP_ID;
    const path = `/artifacts/${appId}/users/${userId}/labels`;
    await deleteDoc(doc(db, path, labelId));
}