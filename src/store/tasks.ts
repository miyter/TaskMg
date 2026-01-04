/**
 * 更新日: 2026-01-03
 * 内容: store-utils.ts の共通ユーティリティを使用するようリファクタリング
 */

import { auth } from '../core/firebase';
import { Unsubscribe } from '../core/firebase-sdk';
import { getNextRecurrenceDate } from '../utils/date';
import { Task, TaskSchema } from './schema';
import { getT, requireAuthAndWorkspace, withErrorHandling } from './store-utils';
import {
    addTaskRaw,
    deleteTaskRaw,
    getTaskByIdRaw,
    getTaskFromCache,
    getTasksFromCache as getTasksFromCacheRaw,
    isTasksInitialized as isTasksInitializedRaw,
    reorderTasksRaw,
    subscribeToTasksRaw,
    updateTaskRaw,
    updateTaskStatusRaw
} from './tasks-raw';
import { toast } from './ui/toast-store';
import { getCurrentWorkspaceId } from './workspace';

/**
 * 新しいタスクを追加する
 */
export async function addTask(taskData: Partial<Task>) {
    const { userId, workspaceId } = requireAuthAndWorkspace();

    // Zodバリデーション (titleのみ必須、他はpartialなので部分チェック)
    const partialSchema = TaskSchema.partial().required({ title: true });
    const validation = partialSchema.safeParse(taskData);
    if (!validation.success) {
        console.warn('[addTask] Validation warning:', validation.error.flatten());
        // 警告のみで継続（データロスを防ぐため）
    }

    return withErrorHandling(
        () => addTaskRaw(userId, workspaceId, taskData),
        'msg.task.create_fail'
    );
}

/**
 * タスクの状態を更新する
 */
export async function updateTaskStatus(taskId: string, status: string) {
    const { userId, workspaceId } = requireAuthAndWorkspace();

    // Recurrence Logic: Create next task if completing a recurring one
    if (status === 'completed') {
        const task = getTaskFromCache(workspaceId, taskId);
        if (task?.recurrence && task.recurrence.type !== 'none') {
            const nextDate = getNextRecurrenceDate(task.dueDate ?? null, task.recurrence);
            if (nextDate) {
                const nextTask: Partial<Task> = {
                    title: task.title,
                    description: task.description,
                    projectId: task.projectId,
                    labelIds: task.labelIds,
                    timeBlockId: task.timeBlockId,
                    duration: task.duration,
                    isImportant: task.isImportant,
                    recurrence: task.recurrence,
                    dueDate: nextDate,
                    status: 'todo'
                };
                addTaskRaw(userId, workspaceId, nextTask).catch(e => console.error("Failed to create recurring task:", e));
            }
        }
    }

    return withErrorHandling(
        () => updateTaskStatusRaw(userId, workspaceId, taskId, status),
        'msg.task.status_update_fail'
    );
}

/**
 * タスクを更新する
 */
export async function updateTask(taskId: string, updates: Partial<Task>) {
    const { userId, workspaceId } = requireAuthAndWorkspace();

    // Zodバリデーション (部分更新なのでpartialスキーマ)
    const validation = TaskSchema.partial().safeParse(updates);
    if (!validation.success) {
        console.warn('[updateTask] Validation warning:', validation.error.flatten());
    }

    return withErrorHandling(
        () => updateTaskRaw(userId, workspaceId, taskId, updates),
        'msg.task.update_fail'
    );
}

/**
 * タスクの並び順を更新する
 */
export async function reorderTasks(orderedTaskIds: string[]) {
    const { userId, workspaceId } = requireAuthAndWorkspace();

    return withErrorHandling(
        () => reorderTasksRaw(userId, workspaceId, orderedTaskIds),
        'msg.task.update_fail'
    );
}

/**
 * タスクを削除する
 */
export async function deleteTask(taskId: string) {
    const { userId, workspaceId } = requireAuthAndWorkspace();

    return withErrorHandling(
        () => deleteTaskRaw(userId, workspaceId, taskId),
        'msg.task.delete_fail',
        { successMessageKey: 'msg.task.delete_success' }
    );
}

/**
 * タスクのステータスをトグルする
 */
export async function toggleTaskStatus(taskId: string, _legacyStatus?: string) {
    const { workspaceId } = requireAuthAndWorkspace();
    const t = getT();

    // 最新の状態をキャッシュから取得して競合を防ぐ
    const task = getTaskFromCache(workspaceId, taskId);
    // キャッシュになければ引数またはデフォルトを使用 (通常はキャッシュにあるはず)
    const currentStatus = task?.status || _legacyStatus || 'todo';

    const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    await updateTaskStatus(taskId, newStatus);

    if (newStatus === 'completed') {
        toast.success(t('msg.task.complete_success'));
    }
}

/**
 * タスクをIDで取得する
 */
export async function getTaskById(taskId: string): Promise<Task | null> {
    const { userId, workspaceId } = requireAuthAndWorkspace();
    return getTaskByIdRaw(userId, workspaceId, taskId);
}

/**
 * タスク一覧の購読
 */
export function subscribeToTasks(workspaceId: string, callback: (tasks: Task[]) => void, onError?: (error: Error) => void): Unsubscribe {
    const user = auth.currentUser;
    if (!user || !workspaceId) {
        if (typeof callback === 'function') callback([]);
        return () => { };
    }
    return subscribeToTasksRaw(user.uid, workspaceId, callback, onError);
}

/**
 * 全タスク取得 (同期)
 */
export const getTasks = (workspaceId?: string): Task[] => {
    const targetId = workspaceId || getCurrentWorkspaceId();
    if (!targetId) return [];
    return getTasksFromCacheRaw(targetId);
};

/**
 * キャッシュ初期化確認用のエクスポート
 */
export const isTasksInitialized = (workspaceId?: string): boolean => {
    const targetId = workspaceId || getCurrentWorkspaceId();
    if (!targetId) return false;
    return isTasksInitializedRaw(targetId);
};
