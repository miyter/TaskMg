// 更新日: 2025-11-25
// 役割: タスクデータのFirestore読み書きを担当（プロジェクト対応版）

import { 
    collection, 
    addDoc, 
    query, 
    onSnapshot,
    doc, 
    updateDoc, 
    deleteDoc,
    Timestamp 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { db, isInitialized } from "./firebase-init.js";

const appId = window.GLOBAL_APP_ID || 'default-app-id';

function getTaskCollection(userId) {
    const currentAppId = typeof __app_id !== 'undefined' ? __app_id : appId;
    return collection(db, `/artifacts/${currentAppId}/users/${userId}/tasks`);
}

function getTaskDoc(userId, taskId) {
    const currentAppId = typeof __app_id !== 'undefined' ? __app_id : appId;
    return doc(db, `/artifacts/${currentAppId}/users/${userId}/tasks/${taskId}`);
}

/**
 * タスクを追加
 * projectId引数を追加（デフォルトはnull＝インボックス）
 */
export async function addTask(userId, title, dueDate = null, projectId = null) {
    if (!isInitialized || !userId) return;
    
    let firestoreDueDate = null;
    if (dueDate instanceof Date) {
        firestoreDueDate = Timestamp.fromDate(dueDate);
    }

    try {
        await addDoc(getTaskCollection(userId), {
            title: title.trim(),
            status: "todo",
            dueDate: firestoreDueDate,
            projectId: projectId, // プロジェクトIDを保存
            createdAt: new Date(),
            ownerId: userId
        });
        return true;
    } catch (e) {
        console.error("タスク追加エラー:", e);
        return false;
    }
}

export async function updateTask(userId, taskId, updates) {
    if (!isInitialized || !userId) return;

    if (updates.dueDate instanceof Date) {
        updates.dueDate = Timestamp.fromDate(updates.dueDate);
    } else if (updates.dueDate === '') {
        updates.dueDate = null;
    }
    
    try {
        await updateDoc(getTaskDoc(userId, taskId), updates);
        return true;
    } catch (e) {
        console.error("タスク更新エラー:", e);
        return false;
    }
}

export async function toggleTaskStatus(userId, taskId, currentStatus) {
    if (!isInitialized || !userId) return;
    const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    try {
        await updateDoc(getTaskDoc(userId, taskId), { status: newStatus });
        return true;
    } catch (e) {
        console.error("エラー:", e);
        return false;
    }
}

export async function deleteTask(userId, taskId) {
    if (!isInitialized || !userId) return;
    try {
        await deleteDoc(getTaskDoc(userId, taskId));
        return true;
    } catch (e) {
        console.error("エラー:", e);
        return false;
    }
}

/**
 * タスク一覧のリアルタイム監視
 * projectIdによるフィルタリングに対応
 * filterProjectId: nullなら全件、'inbox'ならプロジェクトなし、IDならそのプロジェクト
 */
export function subscribeToTasks(userId, callback, filterProjectId = null) {
    if (!isInitialized || !userId) return;

    // インデックスエラー回避のため、全件取得してからJSでフィルタリングする
    const q = query(getTaskCollection(userId));

    return onSnapshot(q, (snapshot) => {
        let tasks = [];
        snapshot.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() });
        });

        // メモリ内フィルタリング
        if (filterProjectId) {
            if (filterProjectId === 'inbox') {
                // プロジェクト未設定のものだけ
                tasks = tasks.filter(t => !t.projectId);
            } else {
                // 特定のプロジェクトIDのものだけ
                tasks = tasks.filter(t => t.projectId === filterProjectId);
            }
        }

        callback(tasks);
    }, (error) => {
        console.error("データ取得エラー:", error);
        callback([]);
    });
}