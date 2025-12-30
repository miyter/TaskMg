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
export const subscribeToTargets = (workspaceId: string | ((targets: Target[]) => void), onUpdate?: (targets: Target[]) => void): Unsubscribe => {
    const callback = typeof workspaceId === 'function' ? workspaceId : onUpdate;
    const targetWorkspaceId = typeof workspaceId === 'string' ? workspaceId : getCurrentWorkspaceId();
    const user = auth.currentUser;

    if (user && targetWorkspaceId && typeof callback === 'function') {
        return subscribeToTargetsRaw(user.uid, targetWorkspaceId, callback);
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
