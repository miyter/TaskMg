// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: 防御的なプログラミングの強化（コールバックの型チェック、recurrenceの安全な扱い）
 */

import {
    collection, addDoc, updateDoc, deleteDoc, doc, query, onSnapshot, getDoc, getDocs, Timestamp, serverTimestamp
} from "../core/firebase-sdk.js";
import { db } from '../core/firebase.js';
import { paths } from '../utils/paths.js';

const toJSDate = (val) => (val instanceof Timestamp) ? val.toDate() : val;
const toFirestoreDate = (val) => (val instanceof Date) ? Timestamp.fromDate(val) : val;

function deserializeTask(id, data) {
    return {
        id,
        ...data,
        createdAt: toJSDate(data.createdAt) || null,
        dueDate: toJSDate(data.dueDate) || null,
        recurrence: data.recurrence ?? null, // undefined を null に正規化
    };
}

// ==========================================================
// ★ RAW FUNCTIONS (userId必須)
// ==========================================================

let _cachedTasks = [];

export function getTasks() {
    return _cachedTasks;
}

export function subscribeToTasksRaw(userId, workspaceId, onUpdate) {
    const safeUpdate = (data) => {
        if (typeof onUpdate === 'function') onUpdate(data);
    };

    if (!userId || !workspaceId) {
        safeUpdate([]);
        return () => { };
    }

    const path = paths.tasks(userId, workspaceId);
    const q = query(collection(db, path));

    return onSnapshot(q, (snapshot) => {
        const tasks = snapshot.docs.map(doc => deserializeTask(doc.id, doc.data()));
        _cachedTasks = tasks;
        safeUpdate(tasks);
    }, (error) => {
        console.error("[Tasks] Subscription error:", error);
        _cachedTasks = [];
        safeUpdate([]);
    });
}

/**
 * バックアップデータの生成
 * 注: ラベルはユーザー単位、タスク・プロジェクトはワークスペース単位で抽出
 */
export async function createBackupDataRaw(userId, workspaceId) {
    if (!userId || !workspaceId) throw new Error("Missing parameters for backup.");

    const tasksRef = collection(db, paths.tasks(userId, workspaceId));
    const projectsRef = collection(db, paths.projects(userId, workspaceId));
    const labelsRef = collection(db, paths.labels(userId));

    const [tasksSnap, projectsSnap, labelsSnap] = await Promise.all([
        getDocs(tasksRef),
        getDocs(projectsRef),
        getDocs(labelsRef)
    ]);

    const serializeData = (snap) => snap.docs.map(d => {
        const data = d.data();
        const serialized = { id: d.id };
        for (const key in data) {
            serialized[key] = (data[key] instanceof Timestamp)
                ? data[key].toDate().toISOString()
                : data[key];
        }
        return serialized;
    });

    return {
        version: "1.2",
        exportedAt: new Date().toISOString(),
        userId,
        workspaceId,
        tasks: serializeData(tasksSnap),
        projects: serializeData(projectsSnap),
        labels: serializeData(labelsSnap)
    };
}

// 他の関数（addTaskRaw, updateTaskRawなど）は既存ロジックを維持
export async function addTaskRaw(userId, workspaceId, taskData) {
    const path = paths.tasks(userId, workspaceId);
    const safeData = { ...taskData };
    if (safeData.dueDate) safeData.dueDate = toFirestoreDate(safeData.dueDate);
    return await addDoc(collection(db, path), {
        ...safeData,
        ownerId: userId,
        status: 'todo',
        createdAt: serverTimestamp()
    });
}

export async function updateTaskStatusRaw(userId, workspaceId, taskId, status) {
    const path = paths.tasks(userId, workspaceId);
    await updateDoc(doc(db, path, taskId), { status });
}

export async function updateTaskRaw(userId, workspaceId, taskId, updates) {
    const path = paths.tasks(userId, workspaceId);
    const safeUpdates = { ...updates };
    if (safeUpdates.dueDate !== undefined) safeUpdates.dueDate = toFirestoreDate(safeUpdates.dueDate);
    await updateDoc(doc(db, path, taskId), safeUpdates);
}

export async function deleteTaskRaw(userId, workspaceId, taskId) {
    const path = paths.tasks(userId, workspaceId);
    await deleteDoc(doc(db, path, taskId));
}

export async function getTaskByIdRaw(userId, workspaceId, taskId) {
    const path = paths.tasks(userId, workspaceId);
    const docSnap = await getDoc(doc(db, path, taskId));
    return docSnap.exists() ? deserializeTask(docSnap.id, docSnap.data()) : null;
}