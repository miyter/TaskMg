/**
 * Store Layer 共通ユーティリティ
 * 更新日: 2026-01-03
 * 
 * 認証ガード、翻訳ヘルパー、Zod検証ユーティリティを集約。
 * 各 store/*.ts での重複を削減。
 */

import { ZodError, ZodSchema } from 'zod';
import { auth } from '../core/firebase';
import { I18nKeys } from '../core/i18n/types';
import { getTranslator } from '../core/i18n/utils';
import { withRetry } from '../utils/retry';
import { BaseEntity, FirestoreCollectionCache } from './base-cache';
import { useSettingsStore } from './ui/settings-store';
import { toast } from './ui/toast-store';
import { getCurrentWorkspaceId } from './workspace';

// ============================================================
// 認証ガード
// ============================================================

/**
 * 認証のみを要求するガード
 * @throws Error 認証されていない場合
 */
export function requireAuth(): string {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        throw new Error('Authentication required.');
    }
    return userId;
}

/**
 * 認証とワークスペース選択を要求するガード
 * @throws Error 認証されていないか、ワークスペースが選択されていない場合
 */
export function requireAuthAndWorkspace(): { userId: string; workspaceId: string } {
    const userId = auth.currentUser?.uid;
    const workspaceId = getCurrentWorkspaceId();
    if (!userId || !workspaceId) {
        throw new Error('Authentication or Workspace required.');
    }
    return { userId, workspaceId };
}

// ============================================================
// 翻訳ヘルパー
// ============================================================

/**
 * 現在の言語設定に基づいた翻訳関数を取得
 */
export function getT() {
    return getTranslator(useSettingsStore.getState().language).t;
}

// ============================================================
// Zod 検証ユーティリティ
// ============================================================

/**
 * Zod検証結果
 */
export interface ValidationResult<T> {
    success: boolean;
    data?: T;
    errorMessage?: string;
}

/**
 * Zodスキーマでデータを検証し、エラー時はToast通知
 * @param schema Zodスキーマ
 * @param data 検証するデータ
 * @param showToast エラー時にToast表示するか（デフォルト: true）
 */
export function validateWithSchema<T>(
    schema: ZodSchema<T>,
    data: unknown,
    showToast = true
): ValidationResult<T> {
    const result = schema.safeParse(data);

    if (result.success) {
        return { success: true, data: result.data };
    }

    const errorMessage = formatZodError(result.error);

    if (showToast) {
        const t = getT();
        toast.error(`${t('validation.validation_error')}: ${errorMessage}`);
    }

    return { success: false, errorMessage };
}

/**
 * ZodErrorをユーザー向けメッセージに変換
 */
export function formatZodError(error: ZodError): string {
    return error.issues.map(i => i.message).join(', ');
}

/**
 * 検証失敗時にエラーをスロー
 * @throws Error 検証に失敗した場合
 */
export function validateOrThrow<T>(
    schema: ZodSchema<T>,
    data: unknown,
    showToast = true
): T {
    const result = validateWithSchema(schema, data, showToast);
    if (!result.success) {
        throw new Error(`Validation failed: ${result.errorMessage}`);
    }
    return result.data!;
}

// ============================================================
// エラーハンドリングユーティリティ
// ============================================================

/**
 * Store操作のエラーハンドリングラッパー
 * @param operation 実行する非同期操作
 * @param errorMessageKey エラー時の翻訳キー
 * @param options オプション
 */
export async function withErrorHandling<T>(
    operation: () => Promise<T>,
    errorMessageKey: string,
    options: {
        successMessageKey?: string;
        rethrow?: boolean;
    } = {}
): Promise<T | undefined> {
    const { successMessageKey, rethrow = true } = options;
    const t = getT();

    try {
        const result = await operation();
        if (successMessageKey) {
            // Dynamic keys need to be cast - the caller ensures correctness
            toast.success(t(successMessageKey as I18nKeys));
        }
        return result;
    } catch (error) {
        console.error(`[Store] ${errorMessageKey}:`, error);

        // Validation エラーは既にToast表示済みなのでスキップ
        if (!(error as Error).message?.includes('Validation')) {
            toast.error(t(errorMessageKey as I18nKeys));
        }

        if (rethrow) throw error;
        return undefined;
    }
}

// ============================================================
// Optimistic UI ユーティリティ
// ============================================================

/**
 * Optimistic Update（楽観的UI更新）の共通ロジック
 * 
 * 1. 現在のキャッシュ状態をバックアップ
 * 2. キャッシュを先行更新（updater関数）
 * 3. 非同期操作を実行（fireStoreOp）
 * 4. 失敗時にキャッシュをロールバックしてエラー表示
 * 
 * @param cache FirestoreCollectionCacheインスタンス
 * @param key キャッシュキー (workspaceIdなど)
 * @param updater 現在のアイテムリストを受け取り、更新後のリストを返す関数
 * @param firestoreOp 実行するFirestore操作
 * @param errorMessage エラー時のメッセージ（または翻訳キー）
 */
export async function withOptimisticUpdate<T extends BaseEntity, K extends string = string>(
    cache: FirestoreCollectionCache<T, K>,
    key: K,
    updater: (current: T[]) => T[],
    firestoreOp: () => Promise<void>,
    errorMessage: string
): Promise<void> {
    const originalItems = cache.getItems(key);

    try {
        // 1 & 2. Optimistic update
        const newItems = updater(originalItems);
        cache.setCache(key, newItems);

        // 3. Execute operation
        await withRetry(firestoreOp, {
            onFinalFailure: (error: any) => {
                // 4. Rollback on definitive failure
                console.error(`[OptimisticUpdate] Failed:`, error);
                cache.setCache(key, originalItems);

                // Try translation, fallback to raw string
                const t = getT();
                const msg = errorMessage.includes('.') ? t(errorMessage as I18nKeys) : errorMessage;
                toast.error(msg);
            }
        });
    } catch (error) {
        // Here we catch errors that might have bubbled up from withRetry (it rethrows after onFinalFailure)
        // or errors from updater/setCache.
        // If withRetry threw, we already rolled back in onFinalFailure.
        // If updater threw, we haven't touched cache yet (or might have partial).
        // For safety, ensure rollback if not already handled is tricky without state.
        // But withRetry guarantees onFinalFailure is called before re-throwing.
        throw error;
    }
}
