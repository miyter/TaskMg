/**
 * TimeBlock Store Facade
 * Provides Type-Safe API for TimeBlocks with Validation
 */

import { auth } from "../core/firebase";
import { Unsubscribe } from "../core/firebase-sdk";
import { getTranslator } from '../core/i18n/utils';
import { TimeBlock, TimeBlockSchema } from './schema';
import {
    addTimeBlockRaw,
    deleteTimeBlockRaw,
    getTimeBlocksRaw,
    isTimeBlocksInitializedRaw,
    subscribeToTimeBlocksRaw,
    updateTimeBlockOrderRaw,
    updateTimeBlockRaw
} from './timeblocks-raw';
import { useSettingsStore } from './ui/settings-store';
import { toast } from './ui/toast-store';

/**
 * 翻訳ヘルパー
 */
const getT = () => getTranslator(useSettingsStore.getState().language).t;

/**
 * 認証とワークスペースの確認
 */
function requireAuth(workspaceId: string) {
    const userId = auth.currentUser?.uid;
    if (!userId || !workspaceId) {
        throw new Error('Authentication and Workspace are required.');
    }
    return userId;
}

/**
 * タイムブロックの購読
 */
export function subscribeToTimeBlocks(workspaceId: string, callback: (blocks: TimeBlock[]) => void): Unsubscribe {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        callback([]);
        return () => { };
    }
    return subscribeToTimeBlocksRaw(userId, workspaceId, callback);
}

/**
 * 同期的にキャッシュを取得
 */
export function getTimeBlocks(workspaceId: string): TimeBlock[] {
    return getTimeBlocksRaw(workspaceId);
}

export function isTimeBlocksInitialized(workspaceId: string): boolean {
    return isTimeBlocksInitializedRaw(workspaceId);
}

/**
 * 以前の global 変数クリア関数 (互換性維持)
 */
export function clearTimeBlocksCache() {
    // No-op for now unless we expose cache clearing from raw
}

/**
 * タイムブロックを保存 (Create or Update)
 * NOTE: 既存の saveTimeBlock が Create/Update 両用だったため、ここでも分岐で処理
 */
export async function saveTimeBlock(workspaceId: string, block: Partial<TimeBlock>): Promise<boolean | undefined> {
    const userId = requireAuth(workspaceId);
    const t = getT();

    try {
        const id = block.id || crypto.randomUUID();
        const currentBlocks = getTimeBlocks(workspaceId);

        // Order calculation if not provided (Create case typically)
        const nextOrder = block.order !== undefined
            ? block.order
            : Math.max(...currentBlocks.map(b => b.order || 0), -1) + 1;

        const dataToSave: TimeBlock = {
            id,
            name: block.name || '',
            start: block.start || '09:00',
            end: block.end || '10:00',
            color: block.color || '#cccccc',
            order: nextOrder
        };

        // Zod Validation
        const result = TimeBlockSchema.safeParse(dataToSave);
        if (!result.success) {
            const errorMsg = result.error.issues.map(i => i.message).join(', ');
            console.error("[TimeBlocks] Validation error:", result.error);
            toast.error(`${t('validation.validation_error')}: ${errorMsg}`);
            return false;
        }

        const isUpdate = currentBlocks.some(b => b.id === id);

        if (isUpdate) {
            await updateTimeBlockRaw(userId, workspaceId, id, dataToSave);
        } else {
            await addTimeBlockRaw(userId, workspaceId, dataToSave);
        }

        return true;
    } catch (e) {
        console.error("[TimeBlocks] Save error:", e);
        // Toast is handled in raw layer's onFinalFailure
        return false;
    }
}

/**
 * タイムブロックを削除
 */
export async function deleteTimeBlock(workspaceId: string, id: string): Promise<boolean | undefined> {
    const userId = requireAuth(workspaceId);
    try {
        await deleteTimeBlockRaw(userId, workspaceId, id);
        return true;
    } catch (e) {
        console.error("[TimeBlocks] Delete error:", e);
        return false;
    }
}

/**
 * タイムブロックの順序を更新
 */
export async function updateTimeBlockOrder(workspaceId: string, orderedIds: string[]) {
    const userId = requireAuth(workspaceId);
    try {
        await updateTimeBlockOrderRaw(userId, workspaceId, orderedIds);
    } catch (e) {
        console.error("[TimeBlocks] Order update error:", e);
    }
}
