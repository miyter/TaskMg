// @ts-nocheck
// @miyter:20251129

import { auth } from '../core/firebase.js';
import { showMessageModal } from '../ui/components.js';

// ★修正: store-rawをインポート (updateLabelRawを追加)
import { 
    subscribeToLabelsRaw,
    addLabelRaw,
    updateLabelRaw, 
    deleteLabelRaw
} from './labels-raw.js';

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
 * ラベルのリアルタイム購読 (ラッパー)
 */
function subscribeToLabels(onUpdate) { // ★修正: exportを削除
    const userId = auth.currentUser?.uid;
    // 認証前に呼ばれる可能性もあるため、userIdが存在すれば購読
    if (userId) {
        subscribeToLabelsRaw(userId, onUpdate);
    }
}

/**
 * 新しいラベルを追加する (ラッパー)
 * @param {string} name - ラベル名
 * @param {string} color - ラベルの色
 */
async function addLabel(name, color) { // ★修正: exportを削除
    const userId = requireAuth();
    return addLabelRaw(userId, name, color);
}

/**
 * ラベルを更新する (ラッパー)
 * @param {string} labelId - ラベルID
 * @param {object} updates - 更新内容
 */
async function updateLabel(labelId, updates) { // ★修正: exportを削除
    const userId = requireAuth();
    return updateLabelRaw(userId, labelId, updates);
}

/**
 * ラベルを削除する (ラッパー)
 * @param {string} labelId - ラベルID
 */
async function deleteLabel(labelId) { // ★修正: exportを削除
    const userId = requireAuth();
    return deleteLabelRaw(userId, labelId);
}

// ★修正: 全ての公開関数をファイル末尾で一度だけエクスポート
export { subscribeToLabels, addLabel, updateLabel, deleteLabel };