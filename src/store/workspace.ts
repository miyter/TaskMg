/**
 * 更新日: 2026-01-02
 * 内容: Facade/Raw パターンに移行
 *      - workspace-raw.ts を内部実装として、このファイルは認証ガード付きのファサードを提供
 */

import { auth } from '../core/firebase';
import { Unsubscribe } from '../core/firebase-sdk';
import { Workspace } from './schema';
import { useWorkspaceStore } from "./ui/workspace-store";
import {
    addWorkspaceRaw,
    deleteWorkspaceRaw,
    ensureDefaultWorkspaceRaw,
    getWorkspacesRaw,
    isWorkspaceNameDuplicateRaw,
    isWorkspacesInitialized as isWorkspacesInitializedRaw,
    subscribeToWorkspacesRaw,
    updateWorkspaceRaw,
    updateWorkspacesCacheRaw,
    workspaceCache
} from './workspace-raw';

// ========================================
// 同期取得用のエクスポート
// ========================================

export function getWorkspaces(userId?: string): Workspace[] {
    const targetUserId = userId || auth.currentUser?.uid;
    if (!targetUserId) return [];
    return getWorkspacesRaw(targetUserId);
}

export function isWorkspacesInitialized(userId?: string): boolean {
    const targetUserId = userId || auth.currentUser?.uid;
    if (!targetUserId) return false;
    return isWorkspacesInitializedRaw(targetUserId);
}

export function updateWorkspacesCache(workspaces: Workspace[], userId?: string): void {
    const targetUserId = userId || auth.currentUser?.uid;
    if (targetUserId) updateWorkspacesCacheRaw(targetUserId, workspaces);
}

// ========================================
// ワークスペースID管理（UI State）
// ========================================

export function getCurrentWorkspaceId(): string | null {
    return useWorkspaceStore.getState().currentWorkspaceId;
}

export function setCurrentWorkspaceId(id: string): void {
    if (!id) return;
    const store = useWorkspaceStore.getState();
    if (store.currentWorkspaceId === id) return;
    store.setCurrentWorkspaceId(id);
}

// ========================================
// サブスクリプション
// ========================================

/**
 * ワークスペースのリアルタイム購読
 * @param userId ユーザーIDまたはコールバック（後方互換性のため）
 * @param onUpdate コールバック
 */
export function subscribeToWorkspaces(
    userId: string | ((workspaces: Workspace[]) => void),
    onUpdate?: (workspaces: Workspace[]) => void
): Unsubscribe {
    // 引数解決ガード（後方互換性）
    const callback = typeof userId === 'function' ? userId : onUpdate;
    const targetUserId = typeof userId === 'string' ? userId : auth.currentUser?.uid;

    if (!targetUserId) {
        if (typeof callback === 'function') callback([]);
        return () => { };
    }

    // ワークスペースが0個の場合、デフォルトを作成
    const wrappedCallback = (workspaces: Workspace[]) => {
        // Workspaces が 0 個でデフォルト作成が必要かチェック
        if (workspaces.length === 0) {
            ensureDefaultWorkspaceRaw(targetUserId).catch(err =>
                console.error('[Workspace] Default creation error:', err)
            );
        } else {
            // 現在の workspaceId が有効かバリデート
            validateCurrentWorkspace(workspaces);
        }

        if (typeof callback === 'function') callback(workspaces);
    };

    return subscribeToWorkspacesRaw(targetUserId, wrappedCallback);
}

function validateCurrentWorkspace(items: Workspace[]): string | null {
    if (items.length === 0) return null;
    const store = useWorkspaceStore.getState();
    let currentId = store.currentWorkspaceId;
    const exists = currentId ? items.some(w => w.id === currentId) : false;

    if (!currentId || !exists) {
        currentId = items[0].id!;
        store.setCurrentWorkspaceId(currentId);
    }
    return currentId;
}

// ========================================
// CRUD 操作
// ========================================

export async function addWorkspace(name: string): Promise<{ id: string, name: string }> {
    const user = auth.currentUser;
    if (!user) throw new Error('Authentication required');

    return addWorkspaceRaw(user.uid, name);
}

export async function isWorkspaceNameDuplicate(name: string, excludeId: string | null = null): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;

    return isWorkspaceNameDuplicateRaw(user.uid, name, excludeId);
}

export async function updateWorkspaceName(id: string, newName: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('Authentication required');

    return updateWorkspaceRaw(user.uid, id, { name: newName });
}

export async function deleteWorkspace(id: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('Authentication required');

    return deleteWorkspaceRaw(user.uid, id);
}

// ========================================
// キャッシュクリア（ログアウト時）
// ========================================

export function clearWorkspaceCache(): void {
    const user = auth.currentUser;
    if (user) {
        workspaceCache.clearCache(user.uid);
    }
}
