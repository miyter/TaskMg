// @ts-nocheck
// @miyter:20251129

import { 
    collection, addDoc, deleteDoc, doc, query, onSnapshot, orderBy 
} from "firebase/firestore";

// ★修正: ローカルモジュールへのインポートパスを相対パスに変更
import { db } from '../core/firebase.js';

// ==========================================================
// ★ RAW FUNCTIONS (userId必須) - ラッパー層からのみ呼び出し
// ==========================================================

/**
 * プロジェクトデータのリアルタイムリスナーを開始する (RAW)。
 * @param {string} userId - ユーザーID (必須)
 * @param {function} onUpdate - データ更新時に呼び出されるコールバック関数
 * @returns {function} リスナーを解除するための関数
 */
export function subscribeToProjectsRaw(userId, onUpdate) {
    const appId = window.GLOBAL_APP_ID;
    const path = `/artifacts/${appId}/users/${userId}/projects`;
    // orderByはインデックスエラー回避のため一旦外しています。
    const q = query(collection(db, path)); 

    return onSnapshot(q, (snapshot) => {
        const projects = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        onUpdate(projects);
    });
}

/**
 * 新しいプロジェクトを追加する (RAW)。
 * @param {string} userId - ユーザーID (必須)
 * @param {string} name - プロジェクト名
 */
export async function addProjectRaw(userId, name) {
    const appId = window.GLOBAL_APP_ID;
    const path = `/artifacts/${appId}/users/${userId}/projects`;
    await addDoc(collection(db, path), {
        name,
        ownerId: userId,
        createdAt: new Date()
    });
}

/**
 * プロジェクトを削除する (RAW)。
 * @param {string} userId - ユーザーID (必須)
 * @param {string} projectId - プロジェクトID
 */
export async function deleteProjectRaw(userId, projectId) {
    const appId = window.GLOBAL_APP_ID;
    const path = `/artifacts/${appId}/users/${userId}/projects`;
    await deleteDoc(doc(db, path, projectId));
}