// @ts-nocheck
// @miyter:20251129

import { auth } from '../core/firebase.js';
import { showMessageModal } from '../ui/components.js';

import { 
    subscribeToProjectsRaw,
    addProjectRaw,
    updateProjectRaw, 
    deleteProjectRaw,
    getProjects // ★追加: 同期的にプロジェクトリストを取得する関数をインポート
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
 * Grokレビュー対応: unsubscribe関数を正しく返すように修正
 * これにより、リロード時やページ遷移時の同期解除・再開が正常に機能する
 */
function subscribeToProjects(onUpdate) {
    const user = auth.currentUser;
    
    // 認証されていない場合は購読せず、ダミーの解除関数を返す
    if (!user) {
        console.warn('User not authenticated, skipping projects subscription');
        return () => {}; 
    }

    // raw関数の戻り値（unsubscribe関数）をそのまま呼び出し元へ返す
    return subscribeToProjectsRaw(user.uid, onUpdate);
}

/**
 * 新しいプロジェクトを追加する (ラッパー)
 * @param {string} name - プロジェクト名
 */
async function addProject(name) {
    const userId = requireAuth();
    return addProjectRaw(userId, name);
}

/**
 * プロジェクトを更新する (ラッパー)
 * @param {string} projectId - プロジェクトID
 * @param {object} updates - 更新内容
 */
async function updateProject(projectId, updates) {
    const userId = requireAuth();
    return updateProjectRaw(userId, projectId, updates);
}

/**
 * プロジェクトを削除する (ラッパー)
 * @param {string} projectId - プロジェクトID
 */
async function deleteProject(projectId) {
    const userId = requireAuth();
    return deleteProjectRaw(userId, projectId);
}

// ★修正: getProjects もエクスポートに追加
export { subscribeToProjects, addProject, updateProject, deleteProject, getProjects };