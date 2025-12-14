// @ts-nocheck
// @miyter:20251129

import { auth } from '../core/firebase.js';
import { showMessageModal } from '../ui/components.js';
import { getNextRecurrenceDate } from '../utils/date.js'; // ★追加: 繰り返し日付計算用のヘルパー
import { getCurrentWorkspaceId } from './workspace.js'; // ★ID取得用

import { 
    subscribeToTasksRaw,
    addTaskRaw, 
    updateTaskStatusRaw,
    updateTaskRaw, 
    deleteTaskRaw,
    createBackupDataRaw,
    getTaskByIdRaw // ★追加: タスク情報を取得するため
} from './store-raw.js';

/**
 * 認証ガード。未認証ならエラーモーダルを表示し例外をスローする。
 * @returns {string} 認証済みのユーザーID
 */
function requireAuth() {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        showMessageModal("操作にはログインが必要です。", null); 
        throw new Error('Authentication required.'); 
    }
    return userId;
}

/**
 * ワークスペースガード。未選択ならエラーモーダルを表示し例外をスローする。
 * @returns {string} ワークスペースID
 */
function requireWorkspace() {
    const workspaceId = getCurrentWorkspaceId();
    if (!workspaceId) {
        showMessageModal("ワークスペースが選択されていません。", null);
        throw new Error('Workspace required.');
    }
    return workspaceId;
}

// ==========================================================
// ★ 繰り返しタスクの処理ロジック
// ==========================================================

/**
 * 完了したタスクに繰り返し設定がある場合、次期タスクを生成する
 * @param {object} completedTask - 完了したタスクオブジェクト
 */
async function handleRecurringTask(completedTask) {
    if (completedTask.status !== 'completed' || !completedTask.recurrence) {
        return;
    }

    const { recurrence, dueDate } = completedTask;

    // dueDateがない、またはrecurrenceの型がおかしい場合はスキップ
    if (!dueDate || typeof recurrence !== 'object' || !recurrence.type) {
        return;
    }

    // 次の期限日を計算
    const nextDueDate = getNextRecurrenceDate(dueDate, recurrence);

    if (nextDueDate) {
        // 新しいタスクデータを作成
        const newTaskData = {
            title: completedTask.title,
            description: completedTask.description || '',
            status: 'todo', // 次期タスクは未完了
            dueDate: nextDueDate, // 新しい期限日
            projectId: completedTask.projectId,
            labelIds: completedTask.labelIds,
            recurrence: completedTask.recurrence, // 繰り返し設定は引き継ぐ
        };

        try {
            // 新しいタスクとしてFirestoreに追加
            const userId = auth.currentUser?.uid;
            const workspaceId = getCurrentWorkspaceId();
            if (userId && workspaceId) {
                await addTaskRaw(userId, workspaceId, newTaskData);
                console.log(`Generated next recurring task for: ${completedTask.title}, next due: ${nextDueDate}`);
            }
        } catch (e) {
            console.error('Failed to generate next recurring task:', e);
        }
    }
}

// ==========================================================
// ★ UI層向けラッパー関数 (認証ガードと userId の自動注入)
// ==========================================================

/**
 * タスク一覧をリアルタイム購読する。
 * @param {Function} onUpdate - データ更新時のコールバック
 */
export function subscribeToTasks(onUpdate) {
    const userId = auth.currentUser?.uid;
    const workspaceId = getCurrentWorkspaceId(); // ★最新のIDを取得

    if (userId && workspaceId) {
        // ★workspaceIdをRaw関数に渡す
        return subscribeToTasksRaw(userId, workspaceId, onUpdate); 
    } else {
        // 未認証/未選択時は空データを返す
        onUpdate([]);
        return () => {};
    }
}

/**
 * タスクを追加する。
 * @param {object} taskData - タスクデータ
 */
export async function addTask(taskData) {
    const userId = requireAuth();
    const workspaceId = requireWorkspace();
    return addTaskRaw(userId, workspaceId, taskData);
}

/**
 * タスクのステータスを更新する。
 * @param {string} taskId - タスクID
 * @param {string} status - 新しいステータス ('todo' or 'completed')
 */
export async function updateTaskStatus(taskId, status) {
    const userId = requireAuth();
    const workspaceId = requireWorkspace();
    
    // 1. ステータスを更新する
    const result = await updateTaskStatusRaw(userId, workspaceId, taskId, status);
    
    // 2. 完了ステータスに変更した場合、繰り返しタスクをチェック
    if (status === 'completed') {
        // 完了したタスクのデータを取得
        const task = await getTaskByIdRaw(userId, workspaceId, taskId);
        if (task) {
            // 非同期で実行
            handleRecurringTask(task).catch(e => console.error('Recurring task handler failed:', e));
        }
    }
    
    return result;
}

/**
 * タスクの情報を更新（汎用）。
 * @param {string} taskId - タスクID
 * @param {object} updates - 更新内容
 */
export async function updateTask(taskId, updates) {
    const userId = requireAuth();
    const workspaceId = requireWorkspace();
    return updateTaskRaw(userId, workspaceId, taskId, updates);
}

/**
 * タスクを削除する。
 * @param {string} taskId - タスクID
 */
export async function deleteTask(taskId) {
    const userId = requireAuth();
    const workspaceId = requireWorkspace();
    return deleteTaskRaw(userId, workspaceId, taskId);
}

/**
 * タスクをIDで取得する
 * @param {string} taskId 
 */
export async function getTaskById(taskId) {
    const userId = auth.currentUser?.uid;
    const workspaceId = getCurrentWorkspaceId();
    
    if (!userId || !workspaceId) return null;

    return getTaskByIdRaw(userId, workspaceId, taskId);
}

/**
 * バックアップデータを作成する。
 */
export async function createBackupData() {
    const userId = requireAuth();
    const workspaceId = requireWorkspace();
    return createBackupDataRaw(userId, workspaceId);
}

/**
 * UI層からの taskData オブジェクトを受け取る互換性ラッパー。
 * @param {object} data - タスクデータオブジェクト
 */
export async function addTaskCompatibility(data) {
    const userId = requireAuth();
    const workspaceId = requireWorkspace();
    
    const finalTaskData = {
        title: data.title,
        description: data.description || '', 
        dueDate: data.dueDate || null,
        projectId: data.projectId || null,
        labelIds: Array.isArray(data.labelIds) ? data.labelIds : [], 
        recurrence: data.recurrence || null, 
    };

    return addTaskRaw(userId, workspaceId, finalTaskData);
}