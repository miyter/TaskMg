// @miyter:20251125
// Firebase SDKのインポート修正 + Timestamp対応 + バックアップ機能 + 必須関数の統合

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
import { db } from '@/core/firebase.js';

let unsubscribe = null;

/**
 * タスク一覧をリアルタイム監視
 * (Timestamp型の日付をDate型に自動変換して返します)
 */
export function subscribeToTasks(userId, onUpdate) {
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
                // TimestampをDateオブジェクトに変換（安全策）
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
                dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : (data.dueDate ? new Date(data.dueDate) : null)
            };
        });
        onUpdate(tasks);
    });
}

/**
 * タスクを追加
 */
export async function addTask(userId, taskData) {
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
 * ★復活: タスクのステータスを更新
 * (これが無いと task-list.js でビルドエラーになります)
 */
export async function updateTaskStatus(userId, taskId, status) {
    const appId = window.GLOBAL_APP_ID;
    const path = `/artifacts/${appId}/users/${userId}/tasks`;
    await updateDoc(doc(db, path, taskId), { status });
}

/**
 * タスクの情報を更新（汎用）
 */
export async function updateTask(userId, taskId, updates) {
    const appId = window.GLOBAL_APP_ID;
    const ref = doc(db, `/artifacts/${appId}/users/${userId}/tasks`, taskId);
    
    // 日付データの変換処理 (Dateオブジェクトならそのまま保存可能だが、念のため)
    const safeUpdates = { ...updates };
    if (safeUpdates.dueDate && !(safeUpdates.dueDate instanceof Date) && !(safeUpdates.dueDate instanceof Timestamp)) {
          safeUpdates.dueDate = new Date(safeUpdates.dueDate);
    }
    
    await updateDoc(ref, safeUpdates);
}

/**
 * タスクを削除
 */
export async function deleteTask(userId, taskId) {
    const appId = window.GLOBAL_APP_ID;
    const ref = doc(db, `/artifacts/${appId}/users/${userId}/tasks`, taskId);
    await deleteDoc(ref);
}

/**
 * バックアップデータ作成機能
 */
export async function createBackupData(userId) {
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

    // TimestampをtoISOStringに変換するヘルパー
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