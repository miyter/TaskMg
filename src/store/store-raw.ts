/**
 * 更新日: 2025-12-21
 * 内容: 防御的なプログラミングの強化（コールバックの型チェック、recurrenceの安全な扱い）
 * TypeScript化: 2025-12-29
 */

import { db } from '../core/firebase';
import {
    addDoc,
    collection,
    deleteDoc, doc,
    getDoc,
    onSnapshot,
    query,
    serverTimestamp,
    Timestamp,
    Unsubscribe,
    updateDoc
} from "../core/firebase-sdk";
import { paths } from '../utils/paths';
import { Task } from './schema';

const toJSDate = (val: any): Date | undefined => (val instanceof Timestamp) ? val.toDate() : (val instanceof Date ? val : undefined);
const toFirestoreDate = (val: any): Timestamp | Date | undefined => (val instanceof Date) ? Timestamp.fromDate(val) : val;

function deserializeTask(id: string, data: any): Task {
    // データを安全に Task 型に整形
    // Note: Zodでparseするのも手だが、ここではパフォーマンス重視で手動マッピング＋キャストでいく
    const recurrence = data.recurrence || null;

    return {
        id,
        ...data,
        createdAt: toJSDate(data.createdAt) || undefined,
        dueDate: toJSDate(data.dueDate) || undefined,
        recurrence: recurrence,
        completedAt: toJSDate(data.completedAt) || undefined,
        ownerId: data.ownerId || '', // 必須フィールド
        title: data.title || '' // 必須フィールド
    } as Task;
}

// ==========================================================
// ★ RAW FUNCTIONS (userId必須)
// ==========================================================

// ワークスペースごとのタスクキャッシュ（複数ワークスペース対応）
const _cachedTasksMap = new Map<string, Task[]>();
let _currentWorkspaceId: string | null = null;

export function getTasks(): Task[] {
    if (!_currentWorkspaceId) return [];
    return _cachedTasksMap.get(_currentWorkspaceId) || [];
}

export function subscribeToTasksRaw(userId: string, workspaceId: string, onUpdate: (tasks: Task[]) => void): Unsubscribe {
    const safeUpdate = (data: Task[]) => {
        if (typeof onUpdate === 'function') onUpdate(data);
    };

    if (!userId || !workspaceId) {
        safeUpdate([]);
        return () => { };
    }

    // 現在のワークスペースを記録
    _currentWorkspaceId = workspaceId;

    const path = paths.tasks(userId, workspaceId);
    const q = query(collection(db, path));

    return onSnapshot(q, (snapshot) => {
        const tasks = snapshot.docs.map(doc => deserializeTask(doc.id, doc.data()));
        _cachedTasksMap.set(workspaceId, tasks);
        safeUpdate(tasks);
    }, (error) => {
        console.error("[Tasks] Subscription error:", error);
        _cachedTasksMap.set(workspaceId, []);
        safeUpdate([]);
    });
}

// タスク操作関数// 他の関数（addTaskRaw, updateTaskRawなど）は既存ロジックを維持
export async function addTaskRaw(userId: string, workspaceId: string, taskData: Partial<Task>) {
    try {
        const path = paths.tasks(userId, workspaceId);
        const safeData: any = { ...taskData };
        if (safeData.dueDate) safeData.dueDate = toFirestoreDate(safeData.dueDate);

        delete safeData.id;

        return await addDoc(collection(db, path), {
            ...safeData,
            ownerId: userId,
            status: 'todo',
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error("[Tasks] addTaskRaw failed:", error);
        throw error;
    }
}

export async function updateTaskStatusRaw(userId: string, workspaceId: string, taskId: string, status: string) {
    try {
        const path = paths.tasks(userId, workspaceId);
        const updates: any = { status };
        if (status === 'completed') {
            updates.completedAt = serverTimestamp();
        } else {
            updates.completedAt = null;
        }
        await updateDoc(doc(db, path, taskId), updates);
    } catch (error) {
        console.error("[Tasks] updateTaskStatusRaw failed:", error);
        throw error;
    }
}

export async function updateTaskRaw(userId: string, workspaceId: string, taskId: string, updates: Partial<Task>) {
    try {
        const path = paths.tasks(userId, workspaceId);
        const safeUpdates: any = { ...updates };
        if (safeUpdates.dueDate !== undefined) safeUpdates.dueDate = toFirestoreDate(safeUpdates.dueDate);
        await updateDoc(doc(db, path, taskId), safeUpdates);
    } catch (error) {
        console.error("[Tasks] updateTaskRaw failed:", error);
        throw error;
    }
}

export async function deleteTaskRaw(userId: string, workspaceId: string, taskId: string) {
    try {
        const path = paths.tasks(userId, workspaceId);
        await deleteDoc(doc(db, path, taskId));
    } catch (error) {
        console.error("[Tasks] deleteTaskRaw failed:", error);
        throw error;
    }
}

export async function getTaskByIdRaw(userId: string, workspaceId: string, taskId: string): Promise<Task | null> {
    const path = paths.tasks(userId, workspaceId);
    const docSnap = await getDoc(doc(db, path, taskId));
    return docSnap.exists() ? deserializeTask(docSnap.id, docSnap.data()) : null;
}
// バックアップ関連機能は backup.ts に移動済み
