/**
 * 更新日: 2026-01-03
 * 内容: FirestoreCollectionCache ベースクラスへの移行
 *      - 共通キャッシュロジックを base-cache.ts に集約
 */

import {
    addDoc,
    collection,
    deleteDoc, doc,
    getDocs, limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp, Unsubscribe,
    updateDoc,
    where
} from "../core/firebase-sdk";

import { db } from '../core/firebase';
import { paths } from '../utils/paths';
import { withRetry } from '../utils/retry';
import { FirestoreCollectionCache } from './base-cache';
import { Workspace, WorkspaceSchema } from './schema';
import { toast } from './ui/toast-store';

/**
 * WorkspaceCache - FirestoreCollectionCache を継承
 * Workspace は userId をキーとして使用
 */
class WorkspaceCache extends FirestoreCollectionCache<Workspace> {
    constructor() {
        super({ logPrefix: '[WorkspaceCache]' });
    }

    // 後方互換性のためのエイリアス
    public getWorkspaces(userId: string): Workspace[] {
        return this.getItems(userId);
    }

    public subscribe(userId: string, onUpdate: (workspaces: Workspace[]) => void): Unsubscribe {
        // リスナー登録とクリーンアップ関数取得
        const cleanup = this.registerListener(userId, onUpdate);

        // Firestore 購読開始（まだ未開始の場合）
        if (!this.hasFirestoreSubscription(userId)) {
            const path = paths.workspaces(userId);
            const q = query(collection(db, path), orderBy('createdAt', 'asc'));
            console.log(`${this.config.logPrefix} Subscribing to path: ${path}`);

            const unsub = onSnapshot(q, (snapshot) => {
                const workspaces = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Workspace[];
                console.log(`${this.config.logPrefix} Received ${workspaces.length} workspaces from Firestore`);

                // Zod validation
                const validWorkspaces = workspaces.filter(w => {
                    const result = WorkspaceSchema.safeParse(w);
                    if (!result.success) {
                        console.error(`${this.config.logPrefix} Invalid workspace data:`, w, result.error);
                        return false;
                    }
                    return true;
                });

                this.setCache(userId, validWorkspaces);
            }, (error) => {
                console.error(`${this.config.logPrefix} Subscription error:`, error);
                this.setCache(userId, []);
            });

            this.setFirestoreSubscription(userId, unsub);
        }

        return cleanup;
    }
}

export const workspaceCache = new WorkspaceCache();

export const isWorkspacesInitialized = (userId: string) => workspaceCache.isInitialized(userId);
export const getWorkspacesRaw = (userId: string) => workspaceCache.getWorkspaces(userId);
export const updateWorkspacesCacheRaw = (userId: string, workspaces: Workspace[]) => workspaceCache.setCache(userId, workspaces);

export function subscribeToWorkspacesRaw(userId: string, onUpdate: (workspaces: Workspace[]) => void): Unsubscribe {
    return workspaceCache.subscribe(userId, onUpdate);
}

export async function addWorkspaceRaw(userId: string, name: string): Promise<{ id: string, name: string }> {
    const originalWorkspaces = workspaceCache.getWorkspaces(userId);

    // Validation
    WorkspaceSchema.pick({ name: true }).parse({ name });

    // Optimistic Update
    const tempId = 'temp-' + Date.now();
    const newWorkspace: Workspace = { id: tempId, name, createdAt: new Date() } as Workspace;
    workspaceCache.setCache(userId, [...originalWorkspaces, newWorkspace]);

    const path = paths.workspaces(userId);
    console.log(`[WorkspaceCache] Adding workspace to path: ${path}`);

    let docId = tempId;

    await withRetry(async () => {
        const docRef = await addDoc(collection(db, path), {
            name,
            createdAt: serverTimestamp()
        });
        docId = docRef.id;
        console.log(`[WorkspaceCache] Successfully added workspace with ID: ${docRef.id}`);
    }, {
        onFinalFailure: () => {
            console.error(`[WorkspaceCache] Failed to add workspace: ${name}`);
            workspaceCache.setCache(userId, originalWorkspaces);
            toast.error('ワークスペースの追加に失敗しました');
        }
    });

    return { id: docId, name };
}

export async function isWorkspaceNameDuplicateRaw(userId: string, name: string, excludeId: string | null = null): Promise<boolean> {
    const path = paths.workspaces(userId);
    const q = query(collection(db, path), where('name', '==', name), limit(5));
    const snapshot = await getDocs(q);
    return snapshot.docs.some(d => d.id !== excludeId);
}

export async function updateWorkspaceRaw(userId: string, workspaceId: string, updates: Partial<Workspace>): Promise<void> {
    const originalWorkspaces = workspaceCache.getWorkspaces(userId);

    // Optimistic Update
    const newWorkspaces = originalWorkspaces.map(w => w.id === workspaceId ? { ...w, ...updates } : w);
    workspaceCache.setCache(userId, newWorkspaces);

    await withRetry(async () => {
        const path = paths.workspaces(userId);
        const ref = doc(db, path, workspaceId);
        await updateDoc(ref, updates);
    }, {
        onFinalFailure: () => {
            workspaceCache.setCache(userId, originalWorkspaces);
            toast.error('ワークスペースの更新に失敗しました');
        }
    });
}

export async function deleteWorkspaceRaw(userId: string, workspaceId: string): Promise<void> {
    const originalWorkspaces = workspaceCache.getWorkspaces(userId);

    // Optimistic Update
    const newWorkspaces = originalWorkspaces.filter(w => w.id !== workspaceId);
    workspaceCache.setCache(userId, newWorkspaces);

    await withRetry(async () => {
        const path = paths.workspaces(userId);
        await deleteDoc(doc(db, path, workspaceId));
    }, {
        onFinalFailure: () => {
            workspaceCache.setCache(userId, originalWorkspaces);
            toast.error('ワークスペースの削除に失敗しました');
        }
    });
}

export async function ensureDefaultWorkspaceRaw(userId: string): Promise<void> {
    try {
        const path = paths.workspaces(userId);
        const snapshot = await getDocs(query(collection(db, path), limit(1)));
        if (snapshot.empty) {
            await addWorkspaceRaw(userId, 'メイン');
        }
    } catch (err) {
        console.error('[WorkspaceCache] Failed to ensure default workspace:', err);
    }
}
