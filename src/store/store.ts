/**
 * 更新日: 2025-12-21
 * 内容: subscribeToTasks の引数シグネチャを (workspaceId, callback)、および Barrel ファイルとしての再定義
 * TypeScript化: 2025-12-29
 */

import { auth } from '../core/firebase';
import { Unsubscribe } from '../core/firebase-sdk';
import { Task } from './schema';
import { subscribeToTasksRaw } from './store-raw';

// 各ドメインのストアをエクスポート
export * from './filters';
export * from './index';
export * from './labels';
export * from './projects';
export * from './timeblocks';
export * from './workspace';

/**
 * 互換性維持セクション
 */
export { addTask as addTaskCompatibility } from './index';

/**
 * タスク一覧の購読
 * DataSyncManager.js からの呼び出し (workspaceId, callback) に合わせる
 */
export function subscribeToTasks(workspaceId: string, callback: (tasks: Task[]) => void): Unsubscribe {
    const user = auth.currentUser;
    if (!user || !workspaceId) {
        if (typeof callback === 'function') callback([]);
        return () => { };
    }
    // store-raw.js の subscribeToTasksRaw(userId, workspaceId, onUpdate) を呼び出す
    return subscribeToTasksRaw(user.uid, workspaceId, callback);
}

// ==========================================================
// ★ Task Mutation Wrappers
// ==========================================================

import {
    deleteTaskRaw,
    updateTaskRaw,
    updateTaskStatusRaw
} from './store-raw';
import { getCurrentWorkspaceId } from './workspace';

function requireAuth() {
    const user = auth.currentUser;
    const workspaceId = getCurrentWorkspaceId();
    if (!user || !workspaceId) throw new Error('Authentication and Workspace required.');
    return { userId: user.uid, workspaceId };
}

export async function updateTask(taskId: string, updates: Partial<Task>) {
    const { userId, workspaceId } = requireAuth();
    return updateTaskRaw(userId, workspaceId, taskId, updates);
}

export async function toggleTaskStatus(taskId: string, currentStatus: string) {
    const { userId, workspaceId } = requireAuth();
    const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    return updateTaskStatusRaw(userId, workspaceId, taskId, newStatus);
}

export async function deleteTask(taskId: string) {
    const { userId, workspaceId } = requireAuth();
    return deleteTaskRaw(userId, workspaceId, taskId);
}
