// @ts-nocheck
// @miyter:20251129

import { auth } from '../core/firebase.js';
import { showMessageModal } from '../ui/components.js';

// ★修正: store-rawをインポート
import { 
    subscribeToLabelsRaw,
    addLabelRaw,
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
export function subscribeToLabels(onUpdate) {
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
 * ラベルを削除する (ラッパー)
 * @param {string} labelId - ラベルID
 */
export async function deleteLabel(labelId) {
    const userId = requireAuth();
    return deleteLabelRaw(userId, labelId);
}