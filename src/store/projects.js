// @miyter:20251125
// Vite導入に伴い、Firebase SDKのインポートをnpmパッケージ形式に、
// ローカルモジュールのインポートを絶対パス '@' に修正

// --- 修正1: deleteDoc, doc を追加 ---
import { 
    collection, addDoc, deleteDoc, doc, query, onSnapshot, orderBy 
} from "firebase/firestore";

// --- 修正2: ローカルモジュールへのインポートパスを絶対パスに変更 ---
import { db } from '@/core/firebase.js';

/**
 * プロジェクトデータのリアルタイムリスナーを開始する。
 * @param {string} userId - ユーザーID
 * @param {function} onUpdate - データ更新時に呼び出されるコールバック関数
 * @returns {function} リスナーを解除するための関数
 */
export function subscribeToProjects(userId, onUpdate) {
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
 * 新しいプロジェクトを追加する。
 * @param {string} userId - ユーザーID
 * @param {string} name - プロジェクト名
 */
export async function addProject(userId, name) {
    const appId = window.GLOBAL_APP_ID;
    const path = `/artifacts/${appId}/users/${userId}/projects`;
    await addDoc(collection(db, path), {
        name,
        ownerId: userId,
        createdAt: new Date()
    });
}

/**
 * ★追加: プロジェクトを削除する
 */
export async function deleteProject(userId, projectId) {
    const appId = window.GLOBAL_APP_ID;
    const path = `/artifacts/${appId}/users/${userId}/projects`;
    await deleteDoc(doc(db, path, projectId));
}