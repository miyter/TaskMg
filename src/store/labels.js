// @miyter:20251125
// Vite導入に伴い、Firebase SDKのインポートをnpmパッケージ形式に、
// ローカルモジュールのインポートを絶対パス '@' に修正

// --- 修正1: deleteDoc, doc を追加 ---
import { collection, addDoc, deleteDoc, doc, query, onSnapshot } from "firebase/firestore";

// --- 修正2: ローカルモジュールへのインポートパスを絶対パスに変更 ---
import { db } from '@/core/firebase.js';

/**
 * ラベルデータのリアルタイムリスナーを開始する。
 * @param {string} userId - ユーザーID
 * @param {function} onUpdate - データ更新時に呼び出されるコールバック関数
 * @returns {function} リスナーを解除するための関数
 */
export function subscribeToLabels(userId, onUpdate) {
    const appId = window.GLOBAL_APP_ID;
    const path = `/artifacts/${appId}/users/${userId}/labels`;
    const q = query(collection(db, path));

    return onSnapshot(q, (snapshot) => {
        const labels = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        onUpdate(labels);
    });
}

/**
 * 新しいラベルを追加する。
 * @param {string} userId - ユーザーID
 * @param {string} name - ラベル名
 * @param {string} color - ラベルの色 (HEXまたはTailwindクラス名)
 */
export async function addLabel(userId, name, color) {
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
 * ★追加: ラベルを削除する
 */
export async function deleteLabel(userId, labelId) {
    const appId = window.GLOBAL_APP_ID;
    const path = `/artifacts/${appId}/users/${userId}/labels`;
    await deleteDoc(doc(db, path, labelId));
}