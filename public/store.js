// 更新日: 2025-11-25
// 役割: タスクデータのFirestore読み書きを担当（検索機能対応版）

import { 
    collection, 
    addDoc, 
    query, 
    onSnapshot,
    doc, 
    updateDoc, 
    deleteDoc,
    Timestamp,
    arrayUnion, 
    arrayRemove 
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

export async function addTask(userId, title, dueDate = null, projectId = null) {
    if (!isInitialized || !userId) return;
    
    let firestoreDueDate = null;
    if (dueDate instanceof Date) {
        firestoreDueDate = Timestamp.fromDate(dueDate);
    }

    try {
        await addDoc(getTaskCollection(userId), {
            title: title.trim(),
            description: "",
            status: "todo",
            dueDate: firestoreDueDate,
            projectId: projectId,
            labelIds: [], 
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

export async function addLabelToTask(userId, taskId, labelId) {
    if (!isInitialized || !userId) return;
    try {
        await updateDoc(getTaskDoc(userId, taskId), {
            labelIds: arrayUnion(labelId)
        });
        return true;
    } catch (e) {
        console.error("ラベル追加エラー:", e);
        return false;
    }
}

export async function removeLabelFromTask(userId, taskId, labelId) {
    if (!isInitialized || !userId) return;
    try {
        await updateDoc(getTaskDoc(userId, taskId), {
            labelIds: arrayRemove(labelId)
        });
        return true;
    } catch (e) {
        console.error("ラベル削除エラー:", e);
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

// ★更新: 検索クエリ（searchQuery）を追加
export function subscribeToTasks(userId, callback, filterCondition = { type: 'all', value: null }, searchQuery = '') {
    if (!isInitialized || !userId) return;

    const q = query(getTaskCollection(userId));

    return onSnapshot(q, (snapshot) => {
        let tasks = [];
        snapshot.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() });
        });

        // 1. 検索フィルタ (キーワードがあればタイトルか詳細で絞り込み)
        if (searchQuery && searchQuery.trim() !== '') {
            const lowerQuery = searchQuery.toLowerCase();
            tasks = tasks.filter(t => 
                (t.title && t.title.toLowerCase().includes(lowerQuery)) || 
                (t.description && t.description.toLowerCase().includes(lowerQuery))
            );
        }

        // 2. プロジェクト/ラベルフィルタ
        if (filterCondition.type === 'project') {
            const projectId = filterCondition.value;
            if (projectId === 'inbox') {
                tasks = tasks.filter(t => !t.projectId);
            } else if (projectId && projectId !== 'all') {
                tasks = tasks.filter(t => t.projectId === projectId);
            }
        } else if (filterCondition.type === 'label') {
            const labelId = filterCondition.value;
            if (labelId) {
                tasks = tasks.filter(t => t.labelIds && t.labelIds.includes(labelId));
            }
        }

        callback(tasks);
    }, (error) => {
        console.error("データ取得エラー:", error);
        callback([]);
    });
}