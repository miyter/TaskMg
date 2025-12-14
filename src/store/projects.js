// @ts-nocheck
// @miyter:20251129

import { auth } from '../core/firebase.js';
import { showMessageModal } from '../ui/components.js';
import { getCurrentWorkspaceId } from './workspace.js'; // 追加

import { 
    subscribeToProjectsRaw,
    addProjectRaw,
    updateProjectRaw, 
    deleteProjectRaw,
    getProjects // 同期的にプロジェクトリストを取得する関数
} from './projects-raw.js';

/**
 * 認証とワークスペース選択のガード。
 * 未認証またはワークスペース未選択ならエラーモーダルを表示し例外をスローする。
 * @returns {string} 認証済みのユーザーID
 */
function requireAuthAndWorkspace() {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        showMessageModal("操作にはログインが必要です。", null); 
        throw new Error('Authentication required.'); 
    }
    
    const workspaceId = getCurrentWorkspaceId();
    if (!workspaceId) {
        showMessageModal("ワークスペースが選択されていません。", null);
        throw new Error('Workspace selection required.');
    }

    return userId;
}

// ==========================================================
// ★ UI層向けラッパー関数 (認証ガードと userId の自動注入)
// ==========================================================

/**
 * プロジェクトのリアルタイム購読 (ラッパー)
 * ワークスペースが選択されていない場合は空リストを返し、購読をスキップする
 */
function subscribeToProjects(onUpdate) {
    const user = auth.currentUser;
    const workspaceId = getCurrentWorkspaceId();
    
    // 認証されていない、またはワークスペース未選択の場合は購読せず、ダミーの解除関数を返す
    if (!user || !workspaceId) {
        console.warn('User not authenticated or Workspace not selected, skipping projects subscription');
        if (onUpdate) onUpdate([]);
        return () => {}; 
    }

    // raw関数の戻り値（unsubscribe関数）をそのまま呼び出し元へ返す
    // raw側でも workspaceId を取得してパスを構築している
    return subscribeToProjectsRaw(user.uid, onUpdate);
}

/**
 * 新しいプロジェクトを追加する (ラッパー)
 * @param {string} name - プロジェクト名
 */
async function addProject(name) {
    const userId = requireAuthAndWorkspace();
    // raw側で workspaceId を取得して使用する
    return addProjectRaw(userId, name);
}

/**
 * プロジェクトを更新する (ラッパー)
 * @param {string} projectId - プロジェクトID
 * @param {object} updates - 更新内容
 */
async function updateProject(projectId, updates) {
    const userId = requireAuthAndWorkspace();
    return updateProjectRaw(userId, projectId, updates);
}

/**
 * プロジェクトを削除する (ラッパー)
 * @param {string} projectId - プロジェクトID
 */
async function deleteProject(projectId) {
    const userId = requireAuthAndWorkspace();
    return deleteProjectRaw(userId, projectId);
}

export { subscribeToProjects, addProject, updateProject, deleteProject, getProjects };