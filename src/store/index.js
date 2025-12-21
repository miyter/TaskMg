/**
 * 更新日: 2025-12-21
 * 内容: 同期取得用 getTasks の追加、タスク購読データのキャッシュ
 */

import { auth } from '../core/firebase.js';
import { getNextRecurrenceDate } from '../utils/date.js';
import { getCurrentWorkspaceId } from './workspace.js';

import { 
    subscribeToTasksRaw,
    addTaskRaw, 
    updateTaskStatusRaw,
    updateTaskRaw, 
    deleteTaskRaw,
    createBackupDataRaw,
    getTaskByIdRaw
} from './store-raw.js';

// タスクの同期取得用キャッシュ
let cachedTasks = [];

/**
 * 認証ガード
 */
function requireAuth() {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        throw new Error('Authentication required.'); 
    }
    return userId;
}

/**
 * ワークスペースガード
 */
function requireWorkspace() {
    const workspaceId = getCurrentWorkspaceId();
    if (!workspaceId) {
        throw new Error('Workspace required.');
    }
    return workspaceId;
}

/**
 * 繰り返しタスクの次期生成
 */
async function handleRecurringTask(completedTask) {
    if (completedTask.status !== 'completed' || !completedTask.recurrence) return;

    const { recurrence, dueDate } = completedTask;
    if (!dueDate || typeof recurrence !== 'object' || !recurrence.type) return;

    const nextDueDate = getNextRecurrenceDate(dueDate, recurrence);
    if (!nextDueDate) return;

    const newTaskData = {
        title: completedTask.title,
        description: completedTask.description || '',
        status: 'todo',
        dueDate: nextDueDate,
        projectId: completedTask.projectId || null,
        labelIds: completedTask.labelIds || [],
        recurrence: completedTask.recurrence,
    };

    try {
        const userId = auth.currentUser?.uid;
        const workspaceId = getCurrentWorkspaceId();
        if (userId && workspaceId) {
            await addTaskRaw(userId, workspaceId, newTaskData);
        }
    } catch (e) {
        console.error('[Recurring] Generation failed:', e);
    }
}

/**
 * タスク一覧を購読する (キャッシュを更新)
 */
export function subscribeToTasks(onUpdate) {
    const userId = auth.currentUser?.uid;
    const workspaceId = getCurrentWorkspaceId();

    if (userId && workspaceId) {
        return subscribeToTasksRaw(userId, workspaceId, (tasks) => {
            cachedTasks = tasks; // キャッシュを更新
            onUpdate(tasks);
        }); 
    } else {
        cachedTasks = [];
        onUpdate([]);
        return () => {};
    }
}

/**
 * キャッシュされたタスク一覧を同期的に取得する
 * (ビルドエラー解消用)
 */
export function getTasks() {
    return cachedTasks;
}

export async function addTask(taskData) {
    const userId = requireAuth();
    const workspaceId = requireWorkspace();
    
    const data = { ...taskData };
    if (data.dueDate && !(data.dueDate instanceof Date)) {
        data.dueDate = new Date(data.dueDate);
        if (isNaN(data.dueDate.getTime())) data.dueDate = null;
    }

    return addTaskRaw(userId, workspaceId, data);
}

export async function updateTaskStatus(taskId, status) {
    const userId = requireAuth();
    const workspaceId = requireWorkspace();
    
    await updateTaskStatusRaw(userId, workspaceId, taskId, status);
    
    if (status === 'completed') {
        const task = await getTaskByIdRaw(userId, workspaceId, taskId);
        if (task) {
            handleRecurringTask(task).catch(e => console.error(e));
        }
    }
}

export async function updateTask(taskId, updates) {
    const userId = requireAuth();
    const workspaceId = requireWorkspace();
    return updateTaskRaw(userId, workspaceId, taskId, updates);
}

export async function deleteTask(taskId) {
    const userId = requireAuth();
    const workspaceId = requireWorkspace();
    return deleteTaskRaw(userId, workspaceId, taskId);
}

export async function getTaskById(taskId) {
    const userId = requireAuth();
    const workspaceId = requireWorkspace();
    return getTaskByIdRaw(userId, workspaceId, taskId);
}

export async function createBackupData() {
    const userId = requireAuth();
    const workspaceId = requireWorkspace();
    return createBackupDataRaw(userId, workspaceId);
}