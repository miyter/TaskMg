// @ts-nocheck
// @miyter:20251129

import { auth } from '../core/firebase.js';
import { showMessageModal } from '../ui/components.js';

// ★修正: store-rawをインポート (updateLabelRawを追加)
import { 
    subscribeToLabelsRaw,
    addLabelRaw,
    updateLabelRaw, // 更新用のRAW関数をインポート済み
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
export function subscribeToLabels(onUpdate) { // ★修正: 関数宣言時にexportを維持
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
export async function addLabel(name, color) {
    const userId = requireAuth();
    return addLabelRaw(userId, name, color);
}

/**
 * ラベルを更新する (ラッパー)
 * @param {string} labelId - ラベルID
 * @param {object} updates - 更新内容
 */
export async function updateLabel(labelId, updates) {
    const userId = requireAuth();
    return updateLabelRaw(userId, labelId, updates);
}

/**
 * ラベルを削除する (ラッパー)
 * @param {string} labelId - ラベルID
 */
export async function deleteLabel(labelId) {
    const userId = requireAuth();
    return deleteLabelRaw(userId, labelId);
}

// ★修正: 重複していた export { subscribeToLabels, ... } の行を削除。
// subscribeToLabelsは関数宣言時にexportされているため、残りの関数のみを export 文で公開します。
export { addLabel, updateLabel, deleteLabel };