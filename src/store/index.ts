/**
 * Store Barrel ファイル
 * 全てのストア機能を統合してエクスポート
 * 更新日: 2025-12-30
 */

import { auth } from '../core/firebase';
import { Unsubscribe } from '../core/firebase-sdk';
import { Task } from './schema';
import {
    getTasksFromCache,
    isTasksInitialized as isTasksInitializedRaw,
    subscribeToTasksRaw
} from './store-raw';
import { getCurrentWorkspaceId } from './workspace';

// 各ドメインのストアを再エクスポート
export * from './backup';
export * from './filters';
export * from './labels';
export * from './projects';
export * from './schema';
export * from './targets';
export * from './tasks';
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

/**
 * 全タスク取得 (同期)
 */
export const getTasks = (workspaceId?: string): Task[] => {
    const targetId = workspaceId || getCurrentWorkspaceId();
    if (!targetId) return [];
    return getTasksFromCache(targetId);
};

/**
 * キャッシュ初期化確認用のエクスポート
 */
export const isTasksInitialized = (workspaceId?: string): boolean => {
    const targetId = workspaceId || getCurrentWorkspaceId();
    if (!targetId) return false;
    return isTasksInitializedRaw(targetId);
};
