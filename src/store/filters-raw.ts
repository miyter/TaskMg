/**
 * 更新日: 2026-01-03
 * 内容: FirestoreCollectionCache ベースクラスへの移行
 *      - 共通キャッシュロジックを base-cache.ts に集約
 */

import { db } from '../core/firebase';
import {
    Unsubscribe,
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    serverTimestamp,
    updateDoc
} from "../core/firebase-sdk";
import { paths } from '../utils/paths';
import { withRetry } from '../utils/retry';
import { FirestoreCollectionCache } from './base-cache';
import { Filter } from './schema';
import { toast } from './ui/toast-store';

/**
 * FilterCache - FirestoreCollectionCache を継承
 */
class FilterCache extends FirestoreCollectionCache<Filter> {
    private static instance: FilterCache;

    private constructor() {
        super({ logPrefix: '[FilterCache]' });
    }

    public static getInstance(): FilterCache {
        if (!FilterCache.instance) {
            FilterCache.instance = new FilterCache();
        }
        return FilterCache.instance;
    }

    // 後方互換性のためのエイリアス
    public getFilters(workspaceId: string): Filter[] {
        return this.getItems(workspaceId);
    }

    public subscribe(userId: string | undefined, workspaceId: string, callback: (filters: Filter[]) => void): Unsubscribe {
        if (!userId || !workspaceId) {
            callback([]);
            return () => { };
        }

        // リスナー登録とクリーンアップ関数取得
        const cleanup = this.registerListener(workspaceId, callback);

        // Firestore 購読開始（まだ未開始の場合）
        if (!this.hasFirestoreSubscription(workspaceId)) {
            const path = paths.filters(userId, workspaceId);
            const q = query(collection(db, path));

            const unsub = onSnapshot(q, (snapshot) => {
                const filters = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Filter[];

                this.setCache(workspaceId, filters);

            }, (error) => {
                console.error(`${this.config.logPrefix} Subscription error:`, error);
                this.setCache(workspaceId, []);
            });

            this.setFirestoreSubscription(workspaceId, unsub);
        }

        return cleanup;
    }
}

const cache = FilterCache.getInstance();

// --- Raw Exports ---

export function subscribeToFiltersRaw(userId: string, workspaceId: string, callback: (filters: Filter[]) => void): Unsubscribe {
    return cache.subscribe(userId, workspaceId, callback);
}

export function getFiltersRaw(workspaceId: string): Filter[] {
    return cache.getFilters(workspaceId);
}

export function isFiltersInitializedRaw(workspaceId: string): boolean {
    return cache.isInitialized(workspaceId);
}

export function clearFiltersCacheRaw(workspaceId?: string) {
    cache.clearCache(workspaceId);
}

export async function addFilterRaw(userId: string, workspaceId: string, filter: Omit<Filter, 'id' | 'createdAt'>) {
    const originalFilters = cache.getFilters(workspaceId);

    // Optimistic Update
    const tempId = 'temp_' + Date.now();
    const tempFilter = { ...filter, id: tempId, createdAt: new Date() } as unknown as Filter;

    cache.setCache(workspaceId, [...originalFilters, tempFilter]);

    const path = paths.filters(userId, workspaceId);

    return withRetry(async () => {
        const docRef = await addDoc(collection(db, path), {
            ...filter,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    }, {
        onFinalFailure: () => {
            cache.setCache(workspaceId, originalFilters);
            toast.error('フィルタの作成に失敗しました');
        }
    });
}

export async function updateFilterRaw(userId: string, workspaceId: string, filterId: string, updates: Partial<Filter>) {
    const originalFilters = cache.getFilters(workspaceId);

    // Optimistic Update
    const newFilters = originalFilters.map(f => f.id === filterId ? { ...f, ...updates } : f);
    cache.setCache(workspaceId, newFilters);

    const path = paths.filters(userId, workspaceId);

    return withRetry(async () => {
        await updateDoc(doc(db, path, filterId), {
            ...updates,
            updatedAt: serverTimestamp()
        });
    }, {
        onFinalFailure: () => {
            cache.setCache(workspaceId, originalFilters);
            toast.error('フィルタの更新に失敗しました');
        }
    });
}

export async function deleteFilterRaw(userId: string, workspaceId: string, filterId: string) {
    const originalFilters = cache.getFilters(workspaceId);

    // Optimistic Update
    const newFilters = originalFilters.filter(f => f.id !== filterId);
    cache.setCache(workspaceId, newFilters);

    const path = paths.filters(userId, workspaceId);

    return withRetry(async () => {
        await deleteDoc(doc(db, path, filterId));
    }, {
        onFinalFailure: () => {
            cache.setCache(workspaceId, originalFilters);
            toast.error('フィルタの削除に失敗しました');
        }
    });
}
