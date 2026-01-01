import { auth } from '../core/firebase';
import { Unsubscribe } from '../core/firebase-sdk';
import { Target } from './schema';
import {
    addTargetRaw,
    deleteTargetRaw,
    getTargets as getTargetsRaw,
    subscribeToTargetsRaw,
    updateTargetRaw
} from './targets-raw';
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

// 同期取得用のエクスポート
export const getTargets = (workspaceId?: string): Target[] => {
    const targetId = workspaceId || getCurrentWorkspaceId();
    if (!targetId) return [];
    return getTargetsRaw(targetId);
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
 */
export const addTarget = async (targetData: Partial<Target>) => {
    const { userId, workspaceId } = requireAuthAndWorkspace();
    return addTargetRaw(userId, workspaceId, targetData);
};

/**
 * ターゲットを更新する
 */
export const updateTarget = async (targetId: string, updates: Partial<Target>) => {
    const { userId, workspaceId } = requireAuthAndWorkspace();
    return updateTargetRaw(userId, workspaceId, targetId, updates);
};

/**
 * ターゲットを削除する
 */
export const deleteTarget = async (targetId: string) => {
    const { userId, workspaceId } = requireAuthAndWorkspace();
    return deleteTargetRaw(userId, workspaceId, targetId);
};
