// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: 引数シグネチャの修正 (workspaceId, callback)、および Barrel ファイルとしての再定義
 */

import { auth } from '../core/firebase.js';
import { subscribeToTasksRaw } from './store-raw.js';

// 各ドメインのストアをエクスポート
export * from './index.js';
export * from './filters.js';
export * from './labels.js';
export * from './projects.js';
export * from './timeblocks.js';
export * from './workspace.js';

/**
 * 互換性維持セクション
 */
export { addTask as addTaskCompatibility } from './index.js';

/**
 * タスク一覧の購読
 * DataSyncManager.js からの呼び出し (workspaceId, callback) に合わせる
 */
export function subscribeToTasks(workspaceId, callback) {
    const user = auth.currentUser;
    if (!user || !workspaceId) {
        if (typeof callback === 'function') callback([]);
        return () => {};
    }
    // store-raw.js の subscribeToTasksRaw(userId, workspaceId, onUpdate) を呼び出す
    return subscribeToTasksRaw(user.uid, workspaceId, callback);
}