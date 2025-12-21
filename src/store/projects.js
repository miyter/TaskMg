// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: 再購読ロジック対応（workspaceId引数化）、ガード処理の戻り値修正
 */

import { auth } from '../core/firebase.js';
import { showMessageModal } from '../ui/components.js';
import { getCurrentWorkspaceId } from './workspace.js';

import { 
    subscribeToProjectsRaw,
    addProjectRaw,
    updateProjectRaw, 
    deleteProjectRaw,
    getProjects // 同期取得用
} from './projects-raw.js';

/**
 * 認証とワークスペース選択のガード
 * @returns {object} { userId, workspaceId }
 */
function requireAuthAndWorkspace() {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        showMessageModal("操作にはログインが必要です。", "error"); 
        throw new Error('Authentication required.'); 
    }
    
    const workspaceId = getCurrentWorkspaceId();
    if (!workspaceId) {
        showMessageModal("ワークスペースが選択されていません。", "error");
        throw new Error('Workspace selection required.');
    }

    return { userId, workspaceId };
}

// ==========================================================
// ★ UI層向けラッパー関数
// ==========================================================

/**
 * プロジェクトのリアルタイム購読
 * @param {function} onUpdate - コールバック
 * @param {string|null} workspaceId - (任意) 特定のワークスペースを購読する場合に指定
 */
function subscribeToProjects(onUpdate, workspaceId = null) {
    const user = auth.currentUser;
    // 引数で指定がない場合は現在のワークスペースを使用
    const targetWorkspaceId = workspaceId || getCurrentWorkspaceId();
    
    if (!user || !targetWorkspaceId) {
        if (onUpdate) onUpdate([]);
        return () => {}; 
    }

    // raw関数に userId と workspaceId を渡す（これでパスが確定する）
    return subscribeToProjectsRaw(user.uid, targetWorkspaceId, onUpdate);
}

/**
 * 新しいプロジェクトを追加する
 */
async function addProject(name, workspaceId = null) {
    // 引数でworkspaceIdが渡された場合はそれを使用（モーダルなどから）
    // 渡されない場合は現在のワークスペースを使用
    let userId, targetWorkspaceId;

    if (workspaceId) {
        // 明示的な指定がある場合でも認証はチェック
        const user = auth.currentUser;
        if (!user) {
            showMessageModal("操作にはログインが必要です。", "error");
            throw new Error('Authentication required.');
        }
        userId = user.uid;
        targetWorkspaceId = workspaceId;
    } else {
        // 現在のコンテキストを使用
        const context = requireAuthAndWorkspace();
        userId = context.userId;
        targetWorkspaceId = context.workspaceId;
    }

    return addProjectRaw(userId, targetWorkspaceId, name);
}

/**
 * プロジェクトを更新する
 */
async function updateProject(projectId, updates) {
    const { userId, workspaceId } = requireAuthAndWorkspace();
    return updateProjectRaw(userId, workspaceId, projectId, updates);
}

/**
 * プロジェクトを削除する
 */
async function deleteProject(projectId) {
    const { userId, workspaceId } = requireAuthAndWorkspace();
    return deleteProjectRaw(userId, workspaceId, projectId);
}

export { subscribeToProjects, addProject, updateProject, deleteProject, getProjects };