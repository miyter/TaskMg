import { auth } from '../core/firebase';
import { Unsubscribe } from '../core/firebase-sdk';
import { MESSAGES } from '../core/messages';
import { Task, TaskSchema } from './schema';
import {
    addTaskRaw,
    deleteTaskRaw,
    getTaskByIdRaw,
    getTaskFromCache,
    getTasksFromCache as getTasksFromCacheRaw,
    isTasksInitialized as isTasksInitializedRaw,
    subscribeToTasksRaw,
    updateTaskRaw,
    updateTaskStatusRaw
} from './store-raw';
import { toast } from './ui/toast-store';
import { getCurrentWorkspaceId } from './workspace';

/**
 * 認証とワークスペース選択のガード
 */
function requireAuthAndWorkspace() {
    const userId = auth.currentUser?.uid;
    const workspaceId = getCurrentWorkspaceId();
    if (!userId || !workspaceId) {
        throw new Error('Authentication or Workspace required.');
    }
    return { userId, workspaceId };
}

/**
 * 新しいタスクを追加する
 */
export async function addTask(taskData: Partial<Task>) {
    try {
        const { userId, workspaceId } = requireAuthAndWorkspace();

        // Zodバリデーション (titleのみ必須、他はpartialなので部分チェック)
        const partialSchema = TaskSchema.partial().required({ title: true });
        const validation = partialSchema.safeParse(taskData);
        if (!validation.success) {
            console.warn('[addTask] Validation warning:', validation.error.flatten());
            // 警告のみで継続（データロスを防ぐため）
        }

        await addTaskRaw(userId, workspaceId, taskData);
        // toast.success(MESSAGES.TASK_CREATE_SUCCESS); // Optional: toaster for creation
    } catch (error) {
        console.error("Failed to add task:", error);
        toast.error(MESSAGES.TASK_CREATE_FAIL);
        throw error;
    }
}

/**
 * タスクの状態を更新する
 */
export async function updateTaskStatus(taskId: string, status: string) {
    try {
        const { userId, workspaceId } = requireAuthAndWorkspace();
        await updateTaskStatusRaw(userId, workspaceId, taskId, status);
    } catch (error) {
        console.error("Failed to update status:", error);
        toast.error(MESSAGES.TASK_STATUS_UPDATE_FAIL);
        throw error;
    }
}

/**
 * タスクを更新する
 */
export async function updateTask(taskId: string, updates: Partial<Task>) {
    try {
        const { userId, workspaceId } = requireAuthAndWorkspace();

        // Zodバリデーション (部分更新なのでpartialスキーマ)
        const validation = TaskSchema.partial().safeParse(updates);
        if (!validation.success) {
            console.warn('[updateTask] Validation warning:', validation.error.flatten());
        }

        await updateTaskRaw(userId, workspaceId, taskId, updates);
    } catch (error) {
        console.error("Failed to update task:", error);
        toast.error(MESSAGES.TASK_UPDATE_FAIL);
        throw error;
    }
}

/**
 * タスクを削除する
 */
export async function deleteTask(taskId: string) {
    try {
        const { userId, workspaceId } = requireAuthAndWorkspace();
        await deleteTaskRaw(userId, workspaceId, taskId);
        // toast.success(MESSAGES.TASK_DELETE_SUCCESS); // Optional
    } catch (error) {
        console.error("Failed to delete task:", error);
        toast.error(MESSAGES.TASK_DELETE_FAIL);
        throw error;
    }
}

/**
 * タスクのステータスをトグルする
 */
export async function toggleTaskStatus(taskId: string, _legacyStatus?: string) {
    try {
        const { userId, workspaceId } = requireAuthAndWorkspace();

        // 最新の状態をキャッシュから取得して競合を防ぐ
        const task = getTaskFromCache(workspaceId, taskId);
        // キャッシュになければ引数またはデフォルトを使用 (通常はキャッシュにあるはず)
        const currentStatus = task?.status || _legacyStatus || 'todo';

        const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
        await updateTaskStatusRaw(userId, workspaceId, taskId, newStatus);

        if (newStatus === 'completed') {
            toast.success(MESSAGES.TASK_COMPLETE_SUCCESS);
        }
    } catch (error) {
        console.error("Failed to toggle status:", error);
        toast.error(MESSAGES.TASK_STATUS_UPDATE_FAIL);
        throw error;
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
 * DataSyncManager からの呼び出しに対応
 */
export function subscribeToTasks(workspaceId: string, callback: (tasks: Task[]) => void): Unsubscribe {
    const user = auth.currentUser;
    if (!user || !workspaceId) {
        if (typeof callback === 'function') callback([]);
        return () => { };
    }
    return subscribeToTasksRaw(user.uid, workspaceId, callback);
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
