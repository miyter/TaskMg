/**
 * 更新日: 2025-12-21
 * 内容: subscribeToProjects の引数シグネチャを (workspaceId, onUpdate) に統一
 * TypeScript化: 2025-12-29
 */

import { auth } from '../core/firebase';
import { getCurrentWorkspaceId } from './workspace';

import { Unsubscribe } from '../core/firebase-sdk';
import {
    addProjectRaw,
    deleteProjectRaw,
    getProjects as getProjectsRaw,
    isProjectsInitialized as isProjectsInitializedRaw,
    reorderProjectsRaw,
    subscribeToProjectsRaw,
    updateProjectRaw,
    updateProjectsCacheRaw
} from './projects-raw';
import { Project } from './schema';

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
export const getProjects = (workspaceId?: string): Project[] => {
    const targetId = workspaceId || getCurrentWorkspaceId();
    if (!targetId) return [];
    return getProjectsRaw(targetId);
};

// キャッシュ初期化確認用のエクスポート
export const isProjectsInitialized = (workspaceId?: string): boolean => {
    const targetId = workspaceId || getCurrentWorkspaceId();
    if (!targetId) return false;
    return isProjectsInitializedRaw(targetId);
};

// キャッシュ手動更新 (Optimistic Update用)
export const updateProjectsCache = (projects: Project[], workspaceId?: string) => {
    const targetId = workspaceId || getCurrentWorkspaceId();
    if (targetId) updateProjectsCacheRaw(targetId, projects);
};


/**
 * プロジェクトのリアルタイム購読
 * @param {string|function} workspaceId - ワークスペースIDまたはコールバック
 * @param {function} [onUpdate] - コールバック
 */
export const subscribeToProjects = (workspaceId: string | ((projects: Project[]) => void), onUpdate?: (projects: Project[]) => void): Unsubscribe => {
    // 引数解決ガード
    const callback = typeof workspaceId === 'function' ? workspaceId : onUpdate;
    const targetWorkspaceId = typeof workspaceId === 'string' ? workspaceId : getCurrentWorkspaceId();

    const user = auth.currentUser;

    if (user && targetWorkspaceId && typeof callback === 'function') {
        return subscribeToProjectsRaw(user.uid, targetWorkspaceId, callback);
    } else {
        if (typeof callback === 'function') callback([]);
        return () => { };
    }
};

/**
 * 新しいプロジェクトを追加する
 */
export const addProject = async (name: string, workspaceId: string | null = null) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Authentication required.');

    const targetWorkspaceId = workspaceId || getCurrentWorkspaceId();
    if (!targetWorkspaceId) throw new Error('Workspace selection required.');

    return addProjectRaw(user.uid, targetWorkspaceId, name);
};

/**
 * プロジェクトを更新する
 */
export const updateProject = async (projectId: string, updates: Partial<Project>) => {
    const { userId, workspaceId } = requireAuthAndWorkspace();
    return updateProjectRaw(userId, workspaceId, projectId, updates);
};

/**
 * プロジェクトを削除する
 */
export const deleteProject = async (projectId: string) => {
    const { userId, workspaceId } = requireAuthAndWorkspace();
    return deleteProjectRaw(userId, workspaceId, projectId);
};

/**
 * プロジェクトの順序を更新する
 */
export const reorderProjects = async (projects: Project[]) => {
    const { userId, workspaceId } = requireAuthAndWorkspace();
    return reorderProjectsRaw(userId, workspaceId, projects);
};
