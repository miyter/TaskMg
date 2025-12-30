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
        console.warn(`[deserializeTask] Invalid data for task ${id}:`, data);
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
// サブスクリプション管理
const _listeners = new Map<string, Set<(tasks: Task[]) => void>>();
const _unsubscribes = new Map<string, Unsubscribe>();

let _currentWorkspaceId: string | null = null;

// リスナーへの通知ヘルパー
function notifyListeners(workspaceId: string) {
    const tasks = _cachedTasksMap.get(workspaceId) || [];
    const listeners = _listeners.get(workspaceId);
    if (listeners) {
        listeners.forEach(listener => listener(tasks));
    }
}

/**
 * キャッシュをクリアする (ログアウト時やメモリ解放用)
 */
export function resetTaskCache(workspaceId?: string) {
    if (workspaceId) {
        // 特定ワークスペースの解除
        _unsubscribes.get(workspaceId)?.();
        _unsubscribes.delete(workspaceId);
        _listeners.delete(workspaceId);
        _cachedTasksMap.delete(workspaceId);
    } else {
        // 全解除
        _unsubscribes.forEach(unsub => unsub());
        _unsubscribes.clear();
        _listeners.clear();
        _cachedTasksMap.clear();
    }
    _currentWorkspaceId = null;
}

/**
 * キャッシュからタスクを同期的に取得 (Optimistic updateなどの参照用)
 */
export function getTaskFromCache(workspaceId: string, taskId: string): Task | undefined {
    const tasks = _cachedTasksMap.get(workspaceId);
    return tasks?.find(t => t.id === taskId);
}

export function subscribeToTasksRaw(userId: string, workspaceId: string, onUpdate: (tasks: Task[]) => void): Unsubscribe {
    if (!userId || !workspaceId) {
        onUpdate([]);
        return () => { };
    }

    _currentWorkspaceId = workspaceId;

    // リスナー登録
    if (!_listeners.has(workspaceId)) {
        _listeners.set(workspaceId, new Set());
    }
    const listeners = _listeners.get(workspaceId)!;
    listeners.add(onUpdate);

    // 即時キャッシュ返却
    const cached = _cachedTasksMap.get(workspaceId);
    if (cached) {
        onUpdate(cached);
    }

    // サブスクリプションが未確立なら開始
    if (!_unsubscribes.has(workspaceId)) {
        const path = paths.tasks(userId, workspaceId);
        const q = query(collection(db, path));

        const unsub = onSnapshot(q, (snapshot) => {
            const tasks = snapshot.docs.map(doc => deserializeTask(doc.id, doc.data()));
            const currentTasks = _cachedTasksMap.get(workspaceId);

            // Optimization: Stabilize reference using custom comparison
            if (currentTasks && areTaskArraysIdentical(currentTasks, tasks)) {
                return;
            }

            _cachedTasksMap.set(workspaceId, tasks);
            notifyListeners(workspaceId);
        }, (error) => {
            console.error("[Tasks] Subscription error:", error);
            // エラー時は空にせず、キャッシュ維持または適切なエラーハンドリングが理想だが、
            // ここでは安全のため空配列を通知せず、現状維持とする（無限ロード防止）
            // _cachedTasksMap.set(workspaceId, []); // 削除: 既存キャッシュを消さない
            // notifyListeners(workspaceId);
        });

        _unsubscribes.set(workspaceId, unsub);
    }

    // Unsubscribe関数
    return () => {
        listeners.delete(onUpdate);
        if (listeners.size === 0) {
            // リスナーがいなくなったら購読停止
            const unsub = _unsubscribes.get(workspaceId);
            if (unsub) {
                unsub();
                _unsubscribes.delete(workspaceId);
            }
        }
    };
}

// タスク操作関数（Optimistic UI対応）
export async function addTaskRaw(userId: string, workspaceId: string, taskData: Partial<Task>) {
    // Optimistic Update: IDは一時的に生成（Firestoreが上書きするがキーが変わるため注意が必要）
    // *追加の場合はIDが未確定なのでOptimistic Updateは難しいが、プレースホルダーを表示するアプローチもある
    // ここでは追加のラグは許容し、更新/削除のラグごまかしを優先する
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
    // Optimistic Update
    const currentTasks = _cachedTasksMap.get(workspaceId);
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
        _cachedTasksMap.set(workspaceId, newTasks);
        notifyListeners(workspaceId);
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
    const currentTasks = _cachedTasksMap.get(workspaceId);
    if (currentTasks) {
        const newTasks = currentTasks.map(t => {
            if (t.id === taskId) {
                return { ...t, ...updates }; // 単純マージ
            }
            return t;
        });
        _cachedTasksMap.set(workspaceId, newTasks);
        notifyListeners(workspaceId);
    }

    return withRetry(async () => {
        const path = paths.tasks(userId, workspaceId);
        const safeUpdates: any = { ...updates };
        if (safeUpdates.dueDate !== undefined) safeUpdates.dueDate = toFirestoreDate(safeUpdates.dueDate);
        await updateDoc(doc(db, path, taskId), safeUpdates);
    });
}

export async function deleteTaskRaw(userId: string, workspaceId: string, taskId: string) {
    // Optimistic Update
    const currentTasks = _cachedTasksMap.get(workspaceId);
    if (currentTasks) {
        const newTasks = currentTasks.filter(t => t.id !== taskId);
        _cachedTasksMap.set(workspaceId, newTasks);
        notifyListeners(workspaceId);
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
