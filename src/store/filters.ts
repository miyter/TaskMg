/**
 * 更新日: 2025-12-31
 * 内容: subscribeToFilters の引数シグネチャを (workspaceId, onUpdate) に統一
 *       Zod バリデーションを有効化
 * TypeScript化: 2025-12-29
 */

import { auth, db } from '../core/firebase';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    serverTimestamp, Unsubscribe,
    updateDoc
} from "../core/firebase-sdk";
import { paths } from '../utils/paths';
import { Filter, FilterSchema } from './schema';
import { toast } from './ui/toast-store';

// Map<workspaceId, Filter[]> to prevent data mixing between workspaces
const _cachedFiltersMap = new Map<string, Filter[]>();

export function getFilters(workspaceId?: string): Filter[] {
    if (!workspaceId) return [];
    return _cachedFiltersMap.get(workspaceId) || [];
}

export function clearFiltersCache(workspaceId?: string) {
    if (workspaceId) {
        _cachedFiltersMap.delete(workspaceId);
    } else {
        _cachedFiltersMap.clear();
    }
}

export function isFiltersInitialized(workspaceId: string): boolean {
    return _cachedFiltersMap.has(workspaceId);
}

/**
 * フィルターのリアルタイム購読
 * @param workspaceId ワークスペースID
 * @param onUpdate フィルター更新時のコールバック
 */
export function subscribeToFilters(workspaceId: string, onUpdate: (filters: Filter[]) => void): Unsubscribe {
    const userId = auth.currentUser?.uid;

    if (!userId || !workspaceId) {
        _cachedFiltersMap.set(workspaceId || '', []);
        onUpdate([]);
        return () => { };
    }

    const path = paths.filters(userId, workspaceId);
    const q = query(collection(db, path));

    return onSnapshot(q, (snapshot) => {
        const filters = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Filter[];
        _cachedFiltersMap.set(workspaceId, filters);
        onUpdate(filters);
    }, (error) => {
        console.error("[Filters] Subscription error:", error);
        _cachedFiltersMap.set(workspaceId, []);
        onUpdate([]);
    });
}

/**
 * フィルターを追加
 */
export async function addFilter(filterData: Partial<Filter> & { workspaceId: string }) {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        toast.error('認証が必要です');
        throw new Error("Authentication required");
    }

    const { workspaceId, ...rest } = filterData;
    if (!workspaceId) {
        toast.error('ワークスペースIDが必要です');
        throw new Error("Workspace ID required");
    }

    // Validate input (partial validation - only check name and query)
    const result = FilterSchema.pick({ name: true, query: true }).safeParse(rest);
    if (!result.success) {
        const errorMsg = result.error.issues.map((e) => e.message).join(', ');
        console.error("[Filters] Validation failed:", result.error.flatten());
        toast.error(`バリデーションエラー: ${errorMsg}`);
        throw new Error(`Validation failed: ${errorMsg}`);
    }

    const path = paths.filters(userId, workspaceId);
    const { id, ...data } = rest;

    await addDoc(collection(db, path), {
        ...data,
        ownerId: userId,
        workspaceId,
        createdAt: serverTimestamp()
    });
}

/**
 * フィルターを更新
 */
export async function updateFilter(workspaceId: string, filterId: string, filterData: Partial<Filter>) {
    const userId = auth.currentUser?.uid;
    if (!userId || !workspaceId) {
        toast.error('認証が必要です');
        throw new Error("Authentication required");
    }

    // Validate input (partial - allow partial updates)
    const result = FilterSchema.partial().safeParse(filterData);
    if (!result.success) {
        const errorMsg = result.error.issues.map((e) => e.message).join(', ');
        console.error("[Filters] Validation failed:", result.error.flatten());
        toast.error(`バリデーションエラー: ${errorMsg}`);
        throw new Error(`Validation failed: ${errorMsg}`);
    }

    const path = paths.filters(userId, workspaceId);
    const { id, ...data } = filterData;

    await updateDoc(doc(db, path, filterId), {
        ...data,
        updatedAt: serverTimestamp()
    });
}


/**
 * フィルターを削除
 */
export async function deleteFilter(workspaceId: string, filterId: string) {
    const userId = auth.currentUser?.uid;
    if (!userId || !workspaceId) {
        toast.error('認証が必要です');
        throw new Error("Authentication required");
    }

    const path = paths.filters(userId, workspaceId);
    await deleteDoc(doc(db, path, filterId));
}
