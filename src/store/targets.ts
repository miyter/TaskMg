import { auth } from '../core/firebase';
import { Unsubscribe } from '../core/firebase-sdk';
import { Target } from './schema';
import {
    addTargetRaw,
    deleteTargetRaw,
    getTargets as getTargetsRaw,
    isTargetsInitialized as isTargetsInitializedRaw,
    subscribeToTargetsRaw,
    updateTargetRaw
} from './targets-raw';
import { getCurrentWorkspaceId } from './workspace';

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

// 同期取得用のエクスポート
export const getTargets = (workspaceId?: string): Target[] => {
    const targetId = workspaceId || getCurrentWorkspaceId();
    if (!targetId) return [];
    return getTargetsRaw(targetId);
};

export const isTargetsInitialized = (workspaceId?: string): boolean => {
    const targetId = workspaceId || getCurrentWorkspaceId();
    if (!targetId) return false;
    return isTargetsInitializedRaw(targetId);
};

/**
 * ターゲットのリアルタイム購読
 */
export const subscribeToTargets = (workspaceId: string | ((targets: Target[]) => void), onUpdate?: (targets: Target[]) => void, onError?: (error: any) => void): Unsubscribe => {
    // 引数解決のロジックが少し複雑（オーバーロード風）
    // パターン1: subscribeToTargets(callback)
    // パターン2: subscribeToTargets(workspaceId, callback, onError)
    let callback: ((targets: Target[]) => void) | undefined;
    let targetWorkspaceId: string | undefined;
    let errorCallback: ((error: any) => void) | undefined;

    if (typeof workspaceId === 'function') {
        callback = workspaceId;
        targetWorkspaceId = getCurrentWorkspaceId() || undefined;
        // errorCallback is undefined in this pattern
    } else {
        targetWorkspaceId = workspaceId;
        callback = onUpdate;
        errorCallback = onError;
    }

    const user = auth.currentUser;

    if (user && targetWorkspaceId && typeof callback === 'function') {
        return subscribeToTargetsRaw(user.uid, targetWorkspaceId, callback, errorCallback);
    } else {
        if (typeof callback === 'function') callback([]);
        return () => { };
    }
};

/**
 * 新しいターゲットを追加する
 * @param workspaceId ワークスペースID
 * @param targetData ターゲットデータ
 */
export const addTarget = async (workspaceId: string, targetData: Partial<Target>) => {
    const userId = requireAuth();
    if (!workspaceId) throw new Error('Workspace ID required.');
    return addTargetRaw(userId, workspaceId, targetData);
};

/**
 * ターゲットを更新する
 * @param workspaceId ワークスペースID
 * @param targetId ターゲットID
 * @param updates 更新データ
 */
export const updateTarget = async (workspaceId: string, targetId: string, updates: Partial<Target>) => {
    const userId = requireAuth();
    if (!workspaceId) throw new Error('Workspace ID required.');
    return updateTargetRaw(userId, workspaceId, targetId, updates);
};

/**
 * ターゲットを削除する
 * @param workspaceId ワークスペースID
 * @param targetId ターゲットID
 */
export const deleteTarget = async (workspaceId: string, targetId: string) => {
    const userId = requireAuth();
    if (!workspaceId) throw new Error('Workspace ID required.');
    return deleteTargetRaw(userId, workspaceId, targetId);
};
