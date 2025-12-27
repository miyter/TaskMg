// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: subscribeToLabels の引数シグネチャを (workspaceId, onUpdate) に統一
 */

import { auth } from '../core/firebase.js';
import { showMessageModal } from '../ui/components.js';

import {
    subscribeToLabelsRaw,
    addLabelRaw,
    updateLabelRaw,
    deleteLabelRaw,
    getLabels as getLabelsRaw
} from './labels-raw.js';

export const getLabels = getLabelsRaw;

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

/**
 * ラベルのリアルタイム購読
 * Note: ラベルは全WS共通だが DataSyncManager の呼び出し規約に合わせる
 */
export function subscribeToLabels(workspaceId, onUpdate) {
    const callback = typeof workspaceId === 'function' ? workspaceId : onUpdate;
    const userId = auth.currentUser?.uid;

    if (userId && typeof callback === 'function') {
        return subscribeToLabelsRaw(userId, callback);
    } else {
        if (typeof callback === 'function') callback([]);
        return () => { };
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