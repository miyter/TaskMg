/**
 * 更新日: 2025-12-21
 * 内容: subscribeToTasks の引数シグネチャを (workspaceId, onUpdate) に修正し、
 * Firestore の onSnapshot に確実に関数を渡すようガードを強化。
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
 * タスク一覧を購読する
 * @param {string|function} workspaceId - ワークスペースIDまたはコールバック関数
 * @param {function} [onUpdate] - コールバック関数
 */
export function subscribeToTasks(workspaceId, onUpdate) {
    // 引数の順序ミスや省略を許容するガード
    // DataSyncManager が (workspaceId, callback) で呼ぶため、順序を正しく解決する
    const callback = typeof workspaceId === 'function' ? workspaceId : onUpdate;
    const targetWorkspaceId = typeof workspaceId === 'string' ? workspaceId : getCurrentWorkspaceId();
    
    const userId = auth.currentUser?.uid;

    // 1. 認証とワークスペースID、かつコールバックが関数であることを厳密にチェック
    if (userId && targetWorkspaceId && typeof callback === 'function') {
        return subscribeToTasksRaw(userId, targetWorkspaceId, (tasks) => {
            cachedTasks = tasks; // キャッシュを更新
            callback(tasks);
        }); 
    } else {
        // 条件を満たさない場合は空データを返して終了（クラッシュ防止）
        cachedTasks = [];
        if (typeof callback === 'function') {
            callback([]);
        }
        return () => {};
    }
}

/**
 * キャッシュされたタスク一覧を同期的に取得する
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