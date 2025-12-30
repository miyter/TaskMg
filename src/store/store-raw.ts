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
import { areTaskArraysIdentical } from '../utils/compare';
import { paths } from '../utils/paths';
import { withRetry } from '../utils/retry';
import { Task } from './schema';

const toJSDate = (val: any): Date | undefined => (val instanceof Timestamp) ? val.toDate() : (val instanceof Date ? val : undefined);
const toFirestoreDate = (val: any): Timestamp | Date | undefined => (val instanceof Date) ? Timestamp.fromDate(val) : val;

function deserializeTask(id: string, data: any): Task {
    // データを安全に Task 型に整形
    if (!data || typeof data !== 'object') {
        return {
            id,
            title: 'Invalid Task',
            status: 'todo',
            ownerId: '',
        } as Task;
    }

    const recurrence = data.recurrence || null;

    return {
        id,
        title: String(data.title || 'Untitled'),
        description: data.description ? String(data.description) : null,
        status: (data.status === 'completed' || data.status === 'todo' || data.status === 'archived')
            ? data.status
            : 'todo',
        dueDate: toJSDate(data.dueDate) || undefined,
        createdAt: toJSDate(data.createdAt) || undefined,
        completedAt: toJSDate(data.completedAt) || undefined,
        ownerId: String(data.ownerId || ''),
        projectId: data.projectId ? String(data.projectId) : null,
        labelIds: Array.isArray(data.labelIds) ? data.labelIds.map(String) : [],
        timeBlockId: data.timeBlockId ? String(data.timeBlockId) : null,
        duration: typeof data.duration === 'number' ? data.duration : undefined,
        isImportant: !!data.isImportant,
        recurrence: recurrence,
    } as Task;
}

// ==========================================================
// ★ RAW FUNCTIONS (userId必須)
// ==========================================================

// ワークスペースごとのタスクキャッシュ（複数ワークスペース対応）
const _cachedTasksMap = new Map<string, Task[]>();
let _currentWorkspaceId: string | null = null;




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

    let isFirst = true;

    return onSnapshot(q, (snapshot) => {
        const tasks = snapshot.docs.map(doc => deserializeTask(doc.id, doc.data()));
        const currentTasks = _cachedTasksMap.get(workspaceId);

        // Optimization: Stabilize reference using custom comparison
        if (currentTasks && areTaskArraysIdentical(currentTasks, tasks)) {
            // If content is identical, use the cached reference to avoid re-renders
            if (isFirst) {
                safeUpdate(currentTasks);
            }
            isFirst = false;
            return;
        }

        isFirst = false;
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
    return withRetry(async () => {
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
    });
}

export async function updateTaskStatusRaw(userId: string, workspaceId: string, taskId: string, status: string) {
    return withRetry(async () => {
        const path = paths.tasks(userId, workspaceId);
        const updates: any = { status };
        if (status === 'completed') {
            updates.completedAt = serverTimestamp();
        } else {
            updates.completedAt = null;
        }
        await updateDoc(doc(db, path, taskId), updates);
    });
}

export async function updateTaskRaw(userId: string, workspaceId: string, taskId: string, updates: Partial<Task>) {
    return withRetry(async () => {
        const path = paths.tasks(userId, workspaceId);
        const safeUpdates: any = { ...updates };
        if (safeUpdates.dueDate !== undefined) safeUpdates.dueDate = toFirestoreDate(safeUpdates.dueDate);
        await updateDoc(doc(db, path, taskId), safeUpdates);
    });
}

export async function deleteTaskRaw(userId: string, workspaceId: string, taskId: string) {
    return withRetry(async () => {
        const path = paths.tasks(userId, workspaceId);
        await deleteDoc(doc(db, path, taskId));
    });
}

export async function getTaskByIdRaw(userId: string, workspaceId: string, taskId: string): Promise<Task | null> {
    const path = paths.tasks(userId, workspaceId);
    const docSnap = await getDoc(doc(db, path, taskId));
    return docSnap.exists() ? deserializeTask(docSnap.id, docSnap.data()) : null;
}
// バックアップ関連機能は backup.ts に移動済み
