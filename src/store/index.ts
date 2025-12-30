/**
 * 更新日: 2025-12-21
 * 内容: subscribeToTasks の引数シグネチャを (workspaceId, callback) に統一
 * TypeScript化: 2025-12-29
 */

import { auth } from '../core/firebase';
import { getCurrentWorkspaceId } from './workspace';

import {
    createBackupData as createBackupDataRaw,
    importBackupData as importBackupDataRaw
} from './backup';
import { Task } from './schema';
import {
    addTaskRaw,
    deleteTaskRaw,
    getTaskByIdRaw,
    getTasks as getTasksRaw,
    updateTaskRaw,
    updateTaskStatusRaw
} from './store-raw';

export const getTasks = getTasksRaw;

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
    const { userId, workspaceId } = requireAuthAndWorkspace();
    return addTaskRaw(userId, workspaceId, taskData);
}

/**
 * タスクの状態を更新する
 */
export async function updateTaskStatus(taskId: string, status: string) {
    const { userId, workspaceId } = requireAuthAndWorkspace();
    return updateTaskStatusRaw(userId, workspaceId, taskId, status);
}

/**
 * タスクを更新する
 */
export async function updateTask(taskId: string, updates: Partial<Task>) {
    const { userId, workspaceId } = requireAuthAndWorkspace();
    return updateTaskRaw(userId, workspaceId, taskId, updates);
}

/**
 * タスクを削除する
 */
export async function deleteTask(taskId: string) {
    const { userId, workspaceId } = requireAuthAndWorkspace();
    return deleteTaskRaw(userId, workspaceId, taskId);
}

/**
 * タスクのステータスをトグルする
 */
export async function toggleTaskStatus(taskId: string, currentStatus: string) {
    const { userId, workspaceId } = requireAuthAndWorkspace();
    const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    return updateTaskStatusRaw(userId, workspaceId, taskId, newStatus);
}

/**
 * タスクをIDで取得する
 */
export async function getTaskById(taskId: string): Promise<Task | null> {
    const { userId, workspaceId } = requireAuthAndWorkspace();
    return getTaskByIdRaw(userId, workspaceId, taskId);
}

/**
 * データのインポート処理
 */
export async function importBackupData(backupData: any) {
    const { userId, workspaceId } = requireAuthAndWorkspace();
    return importBackupDataRaw(userId, workspaceId, backupData);
}

/**
 * バックアップデータの生成
 */
export async function createBackupData() {
    const { userId, workspaceId } = requireAuthAndWorkspace();
    return createBackupDataRaw(userId, workspaceId);
}
