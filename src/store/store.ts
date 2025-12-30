/**
 * Store Barrel ファイル
 * 全てのストア機能を統合してエクスポート
 * 更新日: 2025-12-30
 */

import { auth } from '../core/firebase';
import { Unsubscribe } from '../core/firebase-sdk';
import { Task } from './schema';
import { subscribeToTasksRaw } from './store-raw';

// 各ドメインのストアを再エクスポート
export * from './filters';
export * from './index';
export * from './labels';
export * from './projects';
export * from './timeblocks';
export * from './workspace';

/**
 * タスク一覧の購読
 * DataSyncManager からの呼び出し (workspaceId, callback) に対応
 */
export function subscribeToTasks(workspaceId: string, callback: (tasks: Task[]) => void): Unsubscribe {
    const user = auth.currentUser;
    if (!user || !workspaceId) {
        if (typeof callback === 'function') callback([]);
        return () => { };
    }
    return subscribeToTasksRaw(user.uid, workspaceId, callback);
}
