// 作成日: 2025-11-25
// 役割: プロジェクト（リスト）データのFirestore読み書きを担当

import { 
    collection, 
    addDoc, 
    query, 
    onSnapshot, 
    orderBy, 
    deleteDoc, 
    doc 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { db, isInitialized } from "./firebase-init.js";

const appId = window.GLOBAL_APP_ID || 'default-app-id';

function getProjectCollection(userId) {
    const currentAppId = typeof __app_id !== 'undefined' ? __app_id : appId;
    return collection(db, `/artifacts/${currentAppId}/users/${userId}/projects`);
}

/**
 * プロジェクトを追加
 */
export async function addProject(userId, name) {
    if (!isInitialized || !userId || !name.trim()) return false;

    try {
        await addDoc(getProjectCollection(userId), {
            name: name.trim(),
            createdAt: new Date(),
            ownerId: userId
        });
        console.log("プロジェクト追加成功");
        return true;
    } catch (e) {
        console.error("プロジェクト追加エラー:", e);
        return false;
    }
}

/**
 * プロジェクト一覧をリアルタイム監視
 * 作成日順に並べて返します
 */
export function subscribeToProjects(userId, callback) {
    if (!isInitialized || !userId) return;

    // 作成日順にソート（インデックスエラーが出る場合はorderByを外してください）
    // 今回は単純なコレクション取得なので、クライアント側ソートの方が安全かもしれません
    const q = query(getProjectCollection(userId));

    return onSnapshot(q, (snapshot) => {
        const projects = [];
        snapshot.forEach((doc) => {
            projects.push({ id: doc.id, ...doc.data() });
        });
        
        // クライアント側で日付ソート（古い順）
        projects.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
            return dateA - dateB;
        });

        callback(projects);
    }, (error) => {
        console.error("プロジェクト取得エラー:", error);
        callback([]);
    });
}

/**
 * プロジェクトを削除
 */
export async function deleteProject(userId, projectId) {
    if (!isInitialized || !userId) return;
    try {
        const currentAppId = typeof __app_id !== 'undefined' ? __app_id : appId;
        const ref = doc(db, `/artifacts/${currentAppId}/users/${userId}/projects/${projectId}`);
        await deleteDoc(ref);
        return true;
    } catch (e) {
        console.error("プロジェクト削除エラー:", e);
        return false;
    }
}