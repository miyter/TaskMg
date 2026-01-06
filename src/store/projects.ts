/**
 * 更新日: 2026-01-03
 * 内容: store-utils.ts の共通ユーティリティを使用するようリファクタリング
 */

import { auth } from '../core/firebase';
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
import { Project, ProjectSchema } from './schema';
import { requireAuthAndWorkspace, validateOrThrow, withErrorHandling } from './store-utils';
import { getCurrentWorkspaceId } from './workspace';

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
 */
export const subscribeToProjects = (
    workspaceId: string | ((projects: Project[]) => void),
    onUpdate?: ((projects: Project[]) => void) | ((error: any) => void),
    onError?: (error: any) => void
): Unsubscribe => {
    // 引数解決ガード
    const callback = (typeof workspaceId === 'function' ? workspaceId : onUpdate) as (projects: Project[]) => void;
    // 第2引数がエラーハンドラの場合への対応（オーバーロード的な挙動への配慮）
    const errorHandler = typeof workspaceId === 'function' ? (onUpdate as (error: any) => void) : onError;

    const targetWorkspaceId = typeof workspaceId === 'string' ? workspaceId : getCurrentWorkspaceId();

    const user = auth.currentUser;

    if (user && targetWorkspaceId && typeof callback === 'function') {
        return subscribeToProjectsRaw(user.uid, targetWorkspaceId, callback, errorHandler);
    } else {
        if (typeof callback === 'function') callback([]);
        return () => { };
    }
};

/**
 * 新しいプロジェクトを追加する
 */
export const addProject = async (name: string, workspaceId: string | null = null, color?: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Authentication required.');

    const targetWorkspaceId = workspaceId || getCurrentWorkspaceId();
    if (!targetWorkspaceId) throw new Error('Workspace selection required.');

    // Zod Validation
    const validationPayload = { name, color, ownerId: user.uid };
    validateOrThrow(
        ProjectSchema.pick({ name: true, color: true, ownerId: true }),
        validationPayload
    );

    return withErrorHandling(
        () => addProjectRaw(user.uid, targetWorkspaceId, name, color),
        'msg.project.create_fail'
    );
};

/**
 * プロジェクトを更新する
 */
export const updateProject = async (projectId: string, updates: Partial<Project>) => {
    const { userId, workspaceId } = requireAuthAndWorkspace();

    // Zod Validation
    validateOrThrow(ProjectSchema.partial(), updates);

    return withErrorHandling(
        () => updateProjectRaw(userId, workspaceId, projectId, updates),
        'msg.project.update_fail'
    );
};

/**
 * プロジェクトを削除する
 */
export const deleteProject = async (projectId: string) => {
    const { userId, workspaceId } = requireAuthAndWorkspace();

    return withErrorHandling(
        () => deleteProjectRaw(userId, workspaceId, projectId),
        'msg.project.delete_fail',
        { successMessageKey: 'msg.project.delete_success' }
    );
};

/**
 * プロジェクトの順序を更新する
 */
export const reorderProjects = async (orderedProjectIds: string[]) => {
    const { userId, workspaceId } = requireAuthAndWorkspace();

    return withErrorHandling(
        () => reorderProjectsRaw(userId, workspaceId, orderedProjectIds),
        'msg.project.reorder_fail'
    );
};
