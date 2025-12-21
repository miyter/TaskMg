// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: unsubscribeの返却漏れ修正、ガード処理の統一、古いコメント削除
 */

import { auth } from '../core/firebase.js';
import { showMessageModal } from '../ui/components.js';

import { 
    subscribeToLabelsRaw,
    addLabelRaw,
    updateLabelRaw, 
    deleteLabelRaw
} from './labels-raw.js';

/**
 * 認証ガード
 */
function requireAuth() {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        showMessageModal("操作にはログインが必要です。", "error"); 
        throw new Error('Authentication required.'); 
    }
    return userId;
}

// ==========================================================
// ★ UI層向けラッパー関数
// ==========================================================

/**
 * ラベルのリアルタイム購読
 */
export function subscribeToLabels(onUpdate) {
    const userId = auth.currentUser?.uid;
    
    if (userId) {
        // 重要: unsubscribe関数を返す
        return subscribeToLabelsRaw(userId, onUpdate);
    } else {
        // 未認証時は空データを通知し、ダミーの解除関数を返す
        onUpdate([]);
        return () => {};
    }
}

/**
 * 新しいラベルを追加する
 */
export async function addLabel(name, color) {
    const userId = requireAuth();
    return addLabelRaw(userId, name, color);
}

/**
 * ラベルを更新する
 */
export async function updateLabel(labelId, updates) {
    const userId = requireAuth();
    return updateLabelRaw(userId, labelId, updates);
}

/**
 * ラベルを削除する
 */
export async function deleteLabel(labelId) {
    const userId = requireAuth();
    return deleteLabelRaw(userId, labelId);
}