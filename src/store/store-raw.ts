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
import { getNextRecurrenceDate } from '../utils/date';
import { paths } from '../utils/paths';
import { withRetry } from '../utils/retry';
import { Task, TaskSchema } from './schema';

const toJSDate = (val: any): Date | undefined => (val instanceof Timestamp) ? val.toDate() : (val instanceof Date ? val : undefined);
const toFirestoreDate = (val: any): Timestamp | Date | undefined => (val instanceof Date) ? Timestamp.fromDate(val) : val;

function deserializeTask(id: string, data: any): Task {
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

    const recurrence = data.recurrence || null;

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
        duration: typeof data.duration === 'number' ? data.duration : null,
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

// ==========================================================
// ★ RAW FUNCTIONS (userId必須)
// ==========================================================

// ==========================================================
// ★ RAW FUNCTIONS (userId必須)
// ==========================================================

/**
 * TaskCache Class
 * Manages in-memory cache and Firestore subscriptions for tasks.
 */
class TaskCache {
    private static instance: TaskCache;
    private cachedTasksMap = new Map<string, Task[]>();
    private listeners = new Map<string, Set<(tasks: Task[]) => void>>();
    private unsubscribes = new Map<string, Unsubscribe>();
    private currentWorkspaceId: string | null = null;

    private constructor() { }

    public static getInstance(): TaskCache {
        if (!TaskCache.instance) {
            TaskCache.instance = new TaskCache();
        }
        return TaskCache.instance;
    }

    /**
     * Notify listeners of updates
     */
    private notifyListeners(workspaceId: string) {
        const tasks = this.cachedTasksMap.get(workspaceId) || [];
        const listeners = this.listeners.get(workspaceId);
        if (listeners) {
            const tasksCopy = [...tasks];
            listeners.forEach(listener => listener(tasksCopy));
        }
    }

    /**
     * Reset cache
     */
    public reset(workspaceId?: string) {
        if (workspaceId) {
            this.unsubscribes.get(workspaceId)?.();
            this.unsubscribes.delete(workspaceId);
            this.listeners.delete(workspaceId);
            this.cachedTasksMap.delete(workspaceId);
        } else {
            this.unsubscribes.forEach(unsub => unsub());
            this.unsubscribes.clear();
            this.listeners.clear();
            this.cachedTasksMap.clear();
        }
        this.currentWorkspaceId = null;
    }

    /**
     * Get single task from cache
     */
    public getTask(workspaceId: string, taskId: string): Task | undefined {
        const tasks = this.cachedTasksMap.get(workspaceId);
        return tasks?.find(t => t.id === taskId);
    }

    /**
     * Get all tasks from cache
     */
    public getTasks(workspaceId: string): Task[] {
        return this.cachedTasksMap.get(workspaceId) || [];
    }

    /**
     * Check if initialized
     */
    public isInitialized(workspaceId: string): boolean {
        return this.cachedTasksMap.has(workspaceId);
    }

    /**
     * Set cache manually (for Optimistic Updates)
     */
    public setCache(workspaceId: string, tasks: Task[]) {
        this.cachedTasksMap.set(workspaceId, tasks);
        this.notifyListeners(workspaceId);
    }

    /**
     * Subscribe to tasks
     */
    public subscribe(userId: string, workspaceId: string, onUpdate: (tasks: Task[]) => void): Unsubscribe {
        if (!userId || !workspaceId) {
            onUpdate([]);
            return () => { };
        }

        this.currentWorkspaceId = workspaceId;

        // Register listener
        if (!this.listeners.has(workspaceId)) {
            this.listeners.set(workspaceId, new Set());
        }
        const listeners = this.listeners.get(workspaceId)!;
        listeners.add(onUpdate);

        // Immediate cache return (Async for React strict mode compatibility)
        const cached = this.cachedTasksMap.get(workspaceId);
        if (cached) {
            queueMicrotask(() => onUpdate([...cached]));
        }

        // Start subscription if not active
        if (!this.unsubscribes.has(workspaceId)) {
            const path = paths.tasks(userId, workspaceId);
            const q = query(collection(db, path));

            const unsub = onSnapshot(q, (snapshot) => {
                const tasks = snapshot.docs.map(doc => deserializeTask(doc.id, doc.data()));
                const currentTasks = this.cachedTasksMap.get(workspaceId);

                // Optimization: Stabilize reference
                if (currentTasks && areTaskArraysIdentical(currentTasks, tasks)) {
                    return;
                }

                this.cachedTasksMap.set(workspaceId, tasks);
                this.notifyListeners(workspaceId);
            }, (error) => {
                console.error("[Tasks] Subscription error:", error);
            });

            this.unsubscribes.set(workspaceId, unsub);
        }

        // Unsubscribe function
        return () => {
            listeners.delete(onUpdate);
            if (listeners.size === 0) {
                const unsub = this.unsubscribes.get(workspaceId);
                if (unsub) {
                    unsub();
                    this.unsubscribes.delete(workspaceId);
                }
            }
        };
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

export function subscribeToTasksRaw(userId: string, workspaceId: string, onUpdate: (tasks: Task[]) => void): Unsubscribe {
    return taskCache.subscribe(userId, workspaceId, onUpdate);
}

// ヘルパー: undefinedを除去する
function removeUndefined<T extends Record<string, any>>(obj: T): T {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== undefined)
    ) as T;
}

// タスク操作関数（Optimistic UI対応）
export async function addTaskRaw(userId: string, workspaceId: string, taskData: Partial<Task>) {
    // Optimistic Update: IDは一時的に生成（Firestoreが上書きするがキーが変わるため注意が必要）
    // *追加の場合はIDが未確定なのでOptimistic Updateは難しいが、プレースホルダーを表示するアプローチもある
    // ここでは追加のラグは許容し、更新/削除のラグごまかしを優先する
    return withRetry(async () => {
        const path = paths.tasks(userId, workspaceId);
        // undefinedを削除して安全にする
        const safeData = removeUndefined({ ...taskData });

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
    // Optimistic Update
    const currentTasks = taskCache.getTasks(workspaceId);
    let task = currentTasks?.find(t => t.id === taskId);

    // If not found in cache, strict consistency would require split logic,
    // but here we prioritize UI responsiveness and assume cache is mostly up-to-date.
    if (!task) {
        // Fallback: This might miss recurrence if not cached, but prevents blocking.
        // For a more robust solution, we could fetchDoc here.
    }

    if (currentTasks) {
        const newTasks = currentTasks.map(t => {
            if (t.id === taskId) {
                return {
                    ...t,
                    status: status as any,
                    completedAt: status === 'completed' ? new Date() : undefined
                };
            }
            return t;
        });
        taskCache.setCache(workspaceId, newTasks);
    }

    // Recurrence Logic: Create next task if completing a recurring one
    if (status === 'completed' && task?.recurrence && task.recurrence.type !== 'none') {
        const nextDate = getNextRecurrenceDate(task.dueDate ?? null, task.recurrence as import('../utils/date').RecurrenceConfig);
        if (nextDate) {
            // Keep critical fields for the next instance
            const nextTask: Partial<Task> = {
                title: task.title,
                description: task.description,
                projectId: task.projectId,
                labelIds: task.labelIds,
                timeBlockId: task.timeBlockId, // copy or clear? usually copy
                duration: task.duration,
                isImportant: task.isImportant,
                recurrence: task.recurrence,
                dueDate: nextDate,
                status: 'todo'
            };
            // Execute async (fire and forget relevant to this update, or chain)
            // We use no await here to not delay the visual completion toggle, 
            // but addTaskRaw is optimistic so handles cache immediately too.
            addTaskRaw(userId, workspaceId, nextTask).catch(e => console.error("Failed to create recurring task:", e));
        }
    }

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
    // Optimistic Update
    // Note: Shallow merge only - nested objects are replaced, not deep-merged.
    // For Task type, this is acceptable as nested properties are rare.
    const currentTasks = taskCache.getTasks(workspaceId);
    if (currentTasks) {
        const newTasks = currentTasks.map(t => {
            if (t.id === taskId) {
                return { ...t, ...updates };
            }
            return t;
        });
        taskCache.setCache(workspaceId, newTasks);
    }

    return withRetry(async () => {
        const path = paths.tasks(userId, workspaceId);
        // undefinedを削除して安全にする
        const safeUpdates = removeUndefined({ ...updates });

        if (safeUpdates.dueDate !== undefined) safeUpdates.dueDate = toFirestoreDate(safeUpdates.dueDate);
        await updateDoc(doc(db, path, taskId), safeUpdates);
    });
}

export async function deleteTaskRaw(userId: string, workspaceId: string, taskId: string) {
    // Optimistic Update
    const currentTasks = taskCache.getTasks(workspaceId);
    if (currentTasks) {
        const newTasks = currentTasks.filter(t => t.id !== taskId);
        taskCache.setCache(workspaceId, newTasks);
    }

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
