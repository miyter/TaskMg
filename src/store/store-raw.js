// @ts-nocheck
// @miyter:20251129

import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    onSnapshot, 
    getDocs,
    Timestamp 
} from "firebase/firestore";
// 相対パスを維持
import { db } from '../core/firebase.js';

let unsubscribe = null;

// ==========================================================
// ★ RAW FUNCTIONS (userId必須) - UI層からは直接呼び出さない
// ==========================================================

/**
 * タスク一覧をリアルタイム監視 (RAW)
 * @param {string} userId - ユーザーID (必須)
 * @param {function} onUpdate - データ更新コールバック
 */
export function subscribeToTasksRaw(userId, onUpdate) {
    if (unsubscribe) unsubscribe();
    if (!userId) return;
    
    const appId = window.GLOBAL_APP_ID;
    const path = `/artifacts/${appId}/users/${userId}/tasks`;
    const q = query(collection(db, path));

    unsubscribe = onSnapshot(q, (snapshot) => {
        const tasks = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // TimestampをDateオブジェクトに変換
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
                dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : (data.dueDate ? new Date(data.dueDate) : null)
            };
        });
        onUpdate(tasks);
    });
}

/**
 * タスクを追加 (RAW)
 * @param {string} userId - ユーザーID (必須)
 * @param {object} taskData - タスクデータ
 */
export async function addTaskRaw(userId, taskData) {
    const appId = window.GLOBAL_APP_ID;
    const path = `/artifacts/${appId}/users/${userId}/tasks`;
    
    await addDoc(collection(db, path), {
        ...taskData,
        ownerId: userId,
        status: 'todo',
        createdAt: new Date()
    });
}

/**
 * タスクのステータスを更新 (RAW)
 * @param {string} userId - ユーザーID (必須)
 * @param {string} taskId - タスクID
 * @param {string} status - 新しいステータス
 */
export async function updateTaskStatusRaw(userId, taskId, status) {
    const appId = window.GLOBAL_APP_ID;
    const path = `/artifacts/${appId}/users/${userId}/tasks`;
    await updateDoc(doc(db, path, taskId), { status });
}

/**
 * タスクの情報を更新（汎用, RAW）
 * @param {string} userId - ユーザーID (必須)
 * @param {string} taskId - タスクID
 * @param {object} updates - 更新内容
 */
export async function updateTaskRaw(userId, taskId, updates) {
    const appId = window.GLOBAL_APP_ID;
    const ref = doc(db, `/artifacts/${appId}/users/${userId}/tasks`, taskId);
    
    const safeUpdates = { ...updates };
    if (safeUpdates.dueDate && !(safeUpdates.dueDate instanceof Date) && !(safeUpdates.dueDate instanceof Timestamp)) {
          safeUpdates.dueDate = new Date(safeUpdates.dueDate);
    }
    
    await updateDoc(ref, safeUpdates);
}

/**
 * タスクを削除 (RAW)
 * @param {string} userId - ユーザーID (必須)
 * @param {string} taskId - タスクID
 */
export async function deleteTaskRaw(userId, taskId) {
    const appId = window.GLOBAL_APP_ID;
    const ref = doc(db, `/artifacts/${appId}/users/${userId}/tasks`, taskId);
    await deleteDoc(ref);
}

/**
 * バックアップデータ作成機能 (RAW)
 * @param {string} userId - ユーザーID (必須)
 */
export async function createBackupDataRaw(userId) {
    if (!db) throw new Error("Firestore not initialized");
    const appId = window.GLOBAL_APP_ID;
    
    const tasksRef = collection(db, `/artifacts/${appId}/users/${userId}/tasks`);
    const projectsRef = collection(db, `/artifacts/${appId}/users/${userId}/projects`);
    const labelsRef = collection(db, `/artifacts/${appId}/users/${userId}/labels`);

    const [tasksSnap, projectsSnap, labelsSnap] = await Promise.all([
        getDocs(tasksRef),
        getDocs(projectsRef),
        getDocs(labelsRef)
    ]);

    const serializeData = (snap) => snap.docs.map(d => {
        const data = d.data();
        const serialized = { id: d.id };
        for (const key in data) {
            if (data[key] && data[key].toDate) {
                serialized[key] = data[key].toDate().toISOString();
            } else {
                serialized[key] = data[key];
            }
        }
        return serialized;
    });

    return {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        userId: userId,
        tasks: serializeData(tasksSnap),
        projects: serializeData(projectsSnap),
        labels: serializeData(labelsSnap)
    };
}