/**
 * 更新日: 2026-01-03
 * 内容: store-utils.ts の共通ユーティリティを使用するようリファクタリング
 */

import { auth } from '../core/firebase';
import { Unsubscribe } from '../core/firebase-sdk';
import {
    addLabelRaw,
    deleteLabelRaw,
    getLabels as getLabelsRaw,
    isLabelsInitialized as isLabelsInitializedRaw,
    reorderLabelsRaw,
    subscribeToLabelsRaw,
    updateLabelRaw
} from './labels-raw';
import { Label, LabelSchema } from './schema';
import { requireAuth, validateOrThrow, withErrorHandling } from './store-utils';

export const getLabels = getLabelsRaw;

export const isLabelsInitialized = (workspaceId?: string): boolean => {
    if (!workspaceId) return false;
    return isLabelsInitializedRaw(workspaceId);
};

/**
 * ラベルのリアルタイム購読
 */
export function subscribeToLabels(workspaceId: string, onUpdate: (labels: Label[]) => void, onError?: (error: any) => void): Unsubscribe {
    const userId = auth.currentUser?.uid;

    if (userId && workspaceId) {
        return subscribeToLabelsRaw(userId, workspaceId, onUpdate, onError);
    } else {
        onUpdate([]);
        return () => { };
    }
}

/**
 * 新しいラベルを追加する
 */
export async function addLabel(workspaceId: string, name: string, color: string) {
    const userId = requireAuth();
    if (!workspaceId) throw new Error("Workspace ID required");

    // Zod Validation
    const validationPayload = { name, color, ownerId: userId };
    validateOrThrow(
        LabelSchema.pick({ name: true, color: true, ownerId: true }),
        validationPayload
    );

    return withErrorHandling(
        () => addLabelRaw(userId, workspaceId, name, color),
        'msg.label.create_fail'
    );
}

/**
 * ラベルを更新する
 */
export async function updateLabel(workspaceId: string, labelId: string, updates: Partial<Label>) {
    const userId = requireAuth();
    if (!workspaceId) throw new Error("Workspace ID required");

    // Zod Validation
    validateOrThrow(LabelSchema.partial(), updates);

    return withErrorHandling(
        () => updateLabelRaw(userId, workspaceId, labelId, updates),
        'msg.label.update_fail'
    );
}

/**
 * ラベルを削除する
 */
export async function deleteLabel(workspaceId: string, labelId: string) {
    const userId = requireAuth();
    if (!workspaceId) throw new Error("Workspace ID required");

    return withErrorHandling(
        () => deleteLabelRaw(userId, workspaceId, labelId),
        'msg.label.delete_fail',
        { successMessageKey: 'msg.label.delete_success' }
    );
}

/**
 * ラベルの並び順を更新する
 */
export async function reorderLabels(workspaceId: string, orderedLabelIds: string[]) {
    const userId = requireAuth();
    if (!workspaceId) throw new Error("Workspace ID required");

    return withErrorHandling(
        () => reorderLabelsRaw(userId, workspaceId, orderedLabelIds),
        'msg.label.update_fail'
    );
}
