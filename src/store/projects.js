// @ts-nocheck
// @miyter:20251129

import { auth } from '../core/firebase.js';
import { showMessageModal } from '../ui/components.js';

// ★修正: store-rawをインポート (updateProjectRawを追加)
import { 
    subscribeToProjectsRaw,
    addProjectRaw,
    updateProjectRaw, 
    deleteProjectRaw
} from './projects-raw.js';

/**
 * 認証ガード。未認証ならエラーモーダルを表示し例外をスローする。
 * @returns {string} 認証済みのユーザーID
 */
function requireAuth() {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        showMessageModal("操作にはログインが必要です。", null); 
        throw new Error('Authentication required.'); 
    }
    return userId;
}

// ==========================================================
// ★ UI層向けラッパー関数 (認証ガードと userId の自動注入)
// ==========================================================

/**
 * プロジェクトのリアルタイム購読 (ラッパー)
 */
export function subscribeToProjects(onUpdate) { // ★修正: ここでexportを維持 (App.jsが直接インポートするため)
    const userId = auth.currentUser?.uid;
    // 認証前に呼ばれる可能性もあるため、userIdが存在すれば購読
    if (userId) {
        subscribeToProjectsRaw(userId, onUpdate);
    }
}

/**
 * 新しいプロジェクトを追加する (ラッパー)
 * @param {string} name - プロジェクト名
 */
export async function addProject(name) {
    const userId = requireAuth();
    return addProjectRaw(userId, name);
}

/**
 * プロジェクトを更新する (ラッパー)
 * @param {string} projectId - プロジェクトID
 * @param {object} updates - 更新内容
 */
export async function updateProject(projectId, updates) {
    const userId = requireAuth();
    return updateProjectRaw(userId, projectId, updates);
}


/**
 * プロジェクトを削除する (ラッパー)
 * @param {string} projectId - プロジェクトID
 */
export async function deleteProject(projectId) {
    const userId = requireAuth();
    return deleteProjectRaw(userId, projectId);
}

// ★修正: 重複していた export { subscribeToProjects, ... } の行を削除。
// subscribeToProjectsは関数宣言時にexportされているため、残りの関数のみを export 文で公開します。
export { addProject, updateProject, deleteProject };