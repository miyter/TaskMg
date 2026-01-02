/**
 * 更新日: 2025-12-31
 * 内容: subscribeToLabels の引数シグネチャを (workspaceId, onUpdate) に統一
 * TypeScript化: 2025-12-29
 */

import { auth } from '../core/firebase';
import { getTranslator } from '../core/translations';
import { useSettingsStore } from './ui/settings-store';
import { toast } from './ui/toast-store';

import { Unsubscribe } from '../core/firebase-sdk';
import {
    addLabelRaw,
    deleteLabelRaw,
    getLabels as getLabelsRaw,
    isLabelsInitialized as isLabelsInitializedRaw,
    subscribeToLabelsRaw,
    updateLabelRaw
} from './labels-raw';
import { Label } from './schema';

export const getLabels = getLabelsRaw;

export const isLabelsInitialized = (workspaceId?: string): boolean => {
    if (!workspaceId) return false;
    return isLabelsInitializedRaw(workspaceId);
};

/**
 * 翻訳ヘルパー
 */
const getT = () => getTranslator(useSettingsStore.getState().language).t;

/**
 * 認証ガード
 */
function requireAuth() {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        console.error('Authentication required for label operation.');
        throw new Error('Authentication required.');
    }
    return userId;
}

/**
 * ラベルのリアルタイム購読
 * @param _workspaceId 現在は未使用（ラベルは全WS共通、将来のマルチワークスペース対応用）
 * @param onUpdate ラベル更新時のコールバック
 */
export function subscribeToLabels(workspaceId: string, onUpdate: (labels: Label[]) => void): Unsubscribe {
    const userId = auth.currentUser?.uid;

    if (userId && workspaceId) {
        return subscribeToLabelsRaw(userId, workspaceId, onUpdate);
    } else {
        onUpdate([]);
        return () => { };
    }
}

/**
 * 新しいラベルを追加する
 */
export async function addLabel(workspaceId: string, name: string, color: string) {
    try {
        const userId = requireAuth();
        if (!workspaceId) throw new Error("Workspace ID required");
        const result = await addLabelRaw(userId, workspaceId, name, color);
        // toast.success(getT()('msg.label.create_success')); // Optional
        return result;
    } catch (error) {
        console.error("Failed to add label:", error);
        toast.error(getT()('msg.label.create_fail'));
        throw error;
    }
}

/**
 * ラベルを更新する
 */
export async function updateLabel(workspaceId: string, labelId: string, updates: Partial<Label>) {
    try {
        const userId = requireAuth();
        if (!workspaceId) throw new Error("Workspace ID required");
        const result = await updateLabelRaw(userId, workspaceId, labelId, updates);
        // toast.success(getT()('msg.label.update_success')); // Optional
        return result;
    } catch (error) {
        console.error("Failed to update label:", error);
        toast.error(getT()('msg.label.update_fail'));
        throw error;
    }
}

/**
 * ラベルを削除する
 */
export async function deleteLabel(workspaceId: string, labelId: string) {
    try {
        const userId = requireAuth();
        if (!workspaceId) throw new Error("Workspace ID required");
        const result = await deleteLabelRaw(userId, workspaceId, labelId);
        toast.success(getT()('msg.label.delete_success'));
        return result;
    } catch (error) {
        console.error("Failed to delete label:", error);
        toast.error(getT()('msg.label.delete_fail'));
        throw error;
    }
}
