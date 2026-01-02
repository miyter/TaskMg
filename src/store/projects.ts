/**
 * 更新日: 2025-12-21
 * 内容: subscribeToProjects の引数シグネチャを (workspaceId, onUpdate) に統一
 * TypeScript化: 2025-12-29
 */

import { auth } from '../core/firebase';
import { getTranslator } from '../core/translations';
import { useSettingsStore } from './ui/settings-store';
import { toast } from './ui/toast-store';
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
 * 翻訳ヘルパー
 */
const getT = () => getTranslator(useSettingsStore.getState().language).t;

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
export const addProject = async (name: string, workspaceId: string | null = null, color?: string) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('Authentication required.');

        const targetWorkspaceId = workspaceId || getCurrentWorkspaceId();
        if (!targetWorkspaceId) throw new Error('Workspace selection required.');

        const result = await addProjectRaw(user.uid, targetWorkspaceId, name, color);
        // toast.success(getT()('msg.project.create_success')); // Optional if needed
        return result;
    } catch (error) {
        console.error("Failed to add project:", error);
        toast.error(getT()('msg.project.create_fail'));
        throw error;
    }
};

/**
 * プロジェクトを更新する
 */
export const updateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
        const { userId, workspaceId } = requireAuthAndWorkspace();
        await updateProjectRaw(userId, workspaceId, projectId, updates);
        // toast.success(getT()('msg.project.update_success')); // Optional for minor updates
    } catch (error) {
        console.error("Failed to update project:", error);
        toast.error(getT()('msg.project.update_fail'));
        throw error;
    }
};

/**
 * プロジェクトを削除する
 */
export const deleteProject = async (projectId: string) => {
    try {
        const { userId, workspaceId } = requireAuthAndWorkspace();
        await deleteProjectRaw(userId, workspaceId, projectId);
        toast.success(getT()('msg.project.delete_success'));
    } catch (error) {
        console.error("Failed to delete project:", error);
        toast.error(getT()('msg.project.delete_fail'));
        throw error;
    }
};

/**
 * プロジェクトの順序を更新する
 */
export const reorderProjects = async (projects: Project[]) => {
    try {
        const { userId, workspaceId } = requireAuthAndWorkspace();
        await reorderProjectsRaw(userId, workspaceId, projects);
    } catch (error) {
        console.error("Failed to reorder projects:", error);
        toast.error(getT()('msg.project.reorder_fail'));
        throw error;
    }
};
