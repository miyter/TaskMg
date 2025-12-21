// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: UI依存（showMessageModal）の排除、関数スタイルの統一
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
    if (!userId) {
        throw new Error('Authentication required.'); 
    }
    
    const workspaceId = getCurrentWorkspaceId();
    if (!workspaceId) {
        throw new Error('Workspace selection required.');
    }

    return { userId, workspaceId };
}

// ==========================================================
// ★ UI層向けラッパー関数
// ==========================================================

// 同期取得用のエクスポート
export const getProjects = getProjectsRaw;

/**
 * プロジェクトのリアルタイム購読
 */
export const subscribeToProjects = (onUpdate, workspaceId = null) => {
    const user = auth.currentUser;
    // 引数で指定がない場合は現在のワークスペースを使用
    const targetWorkspaceId = workspaceId || getCurrentWorkspaceId();
    
    if (!user || !targetWorkspaceId) {
        if (onUpdate) onUpdate([]);
        return () => {}; 
    }

    return subscribeToProjectsRaw(user.uid, targetWorkspaceId, onUpdate);
};

/**
 * 新しいプロジェクトを追加する
 */
export const addProject = async (name, workspaceId = null) => {
    let userId, targetWorkspaceId;

    if (workspaceId) {
        // 明示的な指定がある場合
        const user = auth.currentUser;
        if (!user) throw new Error('Authentication required.');
        userId = user.uid;
        targetWorkspaceId = workspaceId;
    } else {
        // 現在のコンテキストを使用
        const context = requireAuthAndWorkspace();
        userId = context.userId;
        targetWorkspaceId = context.workspaceId;
    }

    return addProjectRaw(userId, targetWorkspaceId, name);
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