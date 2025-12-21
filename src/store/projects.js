// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: subscribeToProjects の引数シグネチャを (workspaceId, onUpdate) に統一
 */

import { auth } from '../core/firebase.js';
import { getCurrentWorkspaceId } from './workspace.js';

import { 
    subscribeToProjectsRaw,
    addProjectRaw,
    updateProjectRaw, 
    deleteProjectRaw,
    getProjects as getProjectsRaw
} from './projects-raw.js';

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
export const getProjects = getProjectsRaw;

/**
 * プロジェクトのリアルタイム購読
 * @param {string|function} workspaceId - ワークスペースIDまたはコールバック
 * @param {function} [onUpdate] - コールバック
 */
export const subscribeToProjects = (workspaceId, onUpdate) => {
    // 引数解決ガード
    const callback = typeof workspaceId === 'function' ? workspaceId : onUpdate;
    const targetWorkspaceId = typeof workspaceId === 'string' ? workspaceId : getCurrentWorkspaceId();
    
    const user = auth.currentUser;
    
    if (user && targetWorkspaceId && typeof callback === 'function') {
        return subscribeToProjectsRaw(user.uid, targetWorkspaceId, callback);
    } else {
        if (typeof callback === 'function') callback([]);
        return () => {}; 
    }
};

/**
 * 新しいプロジェクトを追加する
 */
export const addProject = async (name, workspaceId = null) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Authentication required.');
    
    const targetWorkspaceId = workspaceId || getCurrentWorkspaceId();
    if (!targetWorkspaceId) throw new Error('Workspace selection required.');

    return addProjectRaw(user.uid, targetWorkspaceId, name);
};

/**
 * プロジェクトを更新する
 */
export const updateProject = async (projectId, updates) => {
    const { userId, workspaceId } = requireAuthAndWorkspace();
    return updateProjectRaw(userId, workspaceId, projectId, updates);
};

/**
 * プロジェクトを削除する
 */
export const deleteProject = async (projectId) => {
    const { userId, workspaceId } = requireAuthAndWorkspace();
    return deleteProjectRaw(userId, workspaceId, projectId);
};