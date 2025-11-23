// 更新日: 2025-11-24
// 役割: Firestoreへのデータ読み書きを担当します。

import { 
    collection, 
    addDoc, 
    query, 
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { db, isInitialized } from "./firebase-init.js";

// アプリIDの取得
const appId = window.GLOBAL_APP_ID || 'default-app-id';

/**
 * ユーザーごとのタスクコレクション参照を取得
 */
function getTaskCollection(userId) {
    const currentAppId = typeof __app_id !== 'undefined' ? __app_id : appId;
    const path = `/artifacts/${currentAppId}/users/${userId}/tasks`;
    return collection(db, path);
}

/**
 * タスクを追加
 */
export async function addTask(userId, title) {
    if (!isInitialized || !userId) return;
    
    try {
        await addDoc(getTaskCollection(userId), {
            title: title.trim(),
            status: "todo",
            createdAt: new Date(),
            ownerId: userId
        });
        console.log("タスク追加成功");
        return true;
    } catch (e) {
        console.error("タスク追加エラー:", e);
        if (e.code === 'permission-denied') {
            alert("書き込み権限がありません。");
        }
        return false;
    }
}

/**
 * タスク一覧のリアルタイム監視
 * @param {string} userId 
 * @param {Function} callback - (tasks) => {} 形式の関数
 */
export function subscribeToTasks(userId, callback) {
    if (!isInitialized || !userId) return;

    const q = query(getTaskCollection(userId));

    // リスナー登録（戻り値はunsubscribe関数）
    return onSnapshot(q, (snapshot) => {
        const tasks = [];
        snapshot.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() });
        });
        callback(tasks);
    }, (error) => {
        console.error("データ取得エラー:", error);
        callback([]); // エラー時は空配列を返すなど
    });
}