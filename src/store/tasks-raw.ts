/**
 * 更新日: 2026-01-03
 * 内容: FirestoreCollectionCache ベースクラスへの移行
 *      - 共通キャッシュロジックを base-cache.ts に集約
 *      - 防御的なプログラミングの強化（コールバックの型チェック、recurrenceの安全な扱い）
 */

import { db } from '../core/firebase';
import {
    addDoc,
    collection,
    deleteDoc, doc,
    getDoc,
    query,
    serverTimestamp,
    Timestamp,
    Unsubscribe,
    updateDoc,
    writeBatch
} from "../core/firebase-sdk";
import { areTaskArraysIdentical } from '../utils/compare';
import { paths } from '../utils/paths';
import { FirestoreCollectionCache } from './base-cache';
import { Task, TaskSchema } from './schema';

interface TimestampLike {
    toDate(): Date;
}

const toJSDate = (val: unknown): Date | undefined => {
    if (val instanceof Timestamp) return val.toDate();
    if (typeof val === 'object' && val !== null && 'toDate' in val && typeof (val as TimestampLike).toDate === 'function') {
        return (val as TimestampLike).toDate();
    }
    if (val instanceof Date) return val;
    return undefined;
};
const toFirestoreDate = (val: unknown): Timestamp | Date | undefined => (val instanceof Date) ? Timestamp.fromDate(val) : (val as Timestamp | undefined);

function deserializeTask(id: string, data: Record<string, unknown>): Task {
    // データを安全に Task 型に整形
    if (!data || typeof data !== 'object') {
        console.warn(`[deserializeTask] Invalid data for task ${id}:`, data);
        return {
            id,
            title: 'Invalid Task',
            status: 'todo',
            ownerId: '',
        } as Task;
    }

    // Recurrence を適切な型に整形
    const rawRecurrence = data.recurrence as Record<string, unknown> | null | undefined;
    let recurrence: Task['recurrence'] = null;
    if (rawRecurrence && typeof rawRecurrence === 'object' && 'type' in rawRecurrence) {
        recurrence = {
            type: rawRecurrence.type as 'none' | 'daily' | 'weekly' | 'weekdays' | 'monthly',
            days: Array.isArray(rawRecurrence.days) ? rawRecurrence.days as number[] : undefined
        };
    }

    const task: Task = {
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
    };

    // Validation (Log only for now to prevent data loss on minor schema mismatch)
    const result = TaskSchema.safeParse(task);
    if (!result.success) {
        // console.debug(`[deserializeTask] Validation warning for task ${id}`, result.error.flatten());
    }

    return task;
}

/**
 * TaskCache - FirestoreCollectionCache を継承
 */
class TaskCache extends FirestoreCollectionCache<Task> {
    private static instance: TaskCache;
    private currentWorkspaceId: string | null = null;

    private constructor() {
        super({ logPrefix: '[TaskCache]' });
    }

    public static getInstance(): TaskCache {
        if (!TaskCache.instance) {
            TaskCache.instance = new TaskCache();
        }
        return TaskCache.instance;
    }

    // 後方互換性のためのエイリアス
    public getTasks(workspaceId: string): Task[] {
        return this.getItems(workspaceId);
    }

    /**
     * Get single task from cache
     */
    public getTask(workspaceId: string, taskId: string): Task | undefined {
        const tasks = this.getItems(workspaceId);
        return tasks.find(t => t.id === taskId);
    }

    /**
     * Reset cache (ログアウト時やメモリ解放用)
     */
    public reset(workspaceId?: string) {
        this.clearCache(workspaceId);
        this.currentWorkspaceId = null;
    }

    public subscribe(userId: string, workspaceId: string, onUpdate: (tasks: Task[]) => void, onError?: (error: Error) => void): Unsubscribe {
        if (!userId || !workspaceId) {
            onUpdate([]);
            return () => { };
        }

        this.currentWorkspaceId = workspaceId;

        // リスナー登録とクリーンアップ関数取得
        const cleanup = this.registerListener(workspaceId, onUpdate);

        // Firestore 購読開始（まだ未開始の場合）
        if (!this.hasFirestoreSubscription(workspaceId)) {
            const path = paths.tasks(userId, workspaceId);
            const q = query(collection(db, path));

            this.__subscribeToQuery(
                workspaceId,
                q,
                (doc) => deserializeTask(doc.id, doc.data()),
                areTaskArraysIdentical
            );
        }

        return cleanup;
    }
}

// Singleton Instance
const taskCache = TaskCache.getInstance();

/**
 * キャッシュをクリアする (ログアウト時やメモリ解放用)
 */
export function resetTaskCache(workspaceId?: string) {
    taskCache.reset(workspaceId);
}

/**
 * キャッシュからタスクを同期的に取得 (Optimistic updateなどの参照用)
 */
export function getTaskFromCache(workspaceId: string, taskId: string): Task | undefined {
    return taskCache.getTask(workspaceId, taskId);
}

export function getTasksFromCache(workspaceId: string): Task[] {
    return taskCache.getTasks(workspaceId);
}

/**
 * キャッシュが初期化されているか確認する
 */
export function isTasksInitialized(workspaceId: string): boolean {
    return taskCache.isInitialized(workspaceId);
}

export function subscribeToTasksRaw(userId: string, workspaceId: string, onUpdate: (tasks: Task[]) => void, onError?: (error: Error) => void): Unsubscribe {
    return taskCache.subscribe(userId, workspaceId, onUpdate, onError);
}

// ヘルパー: undefinedを除去する
function removeUndefined<T extends Record<string, unknown>>(obj: T): T {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== undefined)
    ) as T;
}

export async function reorderTasksRaw(userId: string, workspaceId: string, orderedTaskIds: string[]) {
    const path = paths.tasks(userId, workspaceId);
    const chunks: string[][] = [];
    for (let i = 0; i < orderedTaskIds.length; i += 500) {
        chunks.push(orderedTaskIds.slice(i, i + 500));
    }
    const orderMap = new Map(orderedTaskIds.map((id, index) => [id, index]));

    for (const chunk of chunks) {
        const batch = writeBatch(db);
        chunk.forEach((id) => {
            const globalIndex = orderMap.get(id)!;
            const ref = doc(db, path, id);
            batch.update(ref, { order: globalIndex });
        });
        await batch.commit();
    }
}

// タスク操作関数（Firestore SDKのOptimistic UI機能を利用）
export async function addTaskRaw(userId: string, workspaceId: string, taskData: Partial<Task>) {
    const path = paths.tasks(userId, workspaceId);
    // undefinedを削除して安全にする
    const safeData = removeUndefined({ ...taskData });

    if (safeData.dueDate) safeData.dueDate = toFirestoreDate(safeData.dueDate);

    delete safeData.id;

    await addDoc(collection(db, path), {
        ...safeData,
        ownerId: userId,
        status: 'todo',
        createdAt: serverTimestamp()
    });
}

export async function updateTaskStatusRaw(userId: string, workspaceId: string, taskId: string, status: string) {
    const path = paths.tasks(userId, workspaceId);
    const updates: { status: string; completedAt: ReturnType<typeof serverTimestamp> | null } = { status, completedAt: null };
    if (status === 'completed') {
        updates.completedAt = serverTimestamp();
    }
    await updateDoc(doc(db, path, taskId), updates);
}

export async function updateTaskRaw(userId: string, workspaceId: string, taskId: string, updates: Partial<Task>) {
    const path = paths.tasks(userId, workspaceId);
    const safeUpdates = removeUndefined({ ...updates });

    if (safeUpdates.dueDate !== undefined) safeUpdates.dueDate = toFirestoreDate(safeUpdates.dueDate);
    await updateDoc(doc(db, path, taskId), safeUpdates);
}

export async function deleteTaskRaw(userId: string, workspaceId: string, taskId: string) {
    const path = paths.tasks(userId, workspaceId);
    await deleteDoc(doc(db, path, taskId));
}

export async function getTaskByIdRaw(userId: string, workspaceId: string, taskId: string): Promise<Task | null> {
    const path = paths.tasks(userId, workspaceId);
    const docSnap = await getDoc(doc(db, path, taskId));
    return docSnap.exists() ? deserializeTask(docSnap.id, docSnap.data()) : null;
}
// バックアップ関連機能は backup.ts に移動済み
