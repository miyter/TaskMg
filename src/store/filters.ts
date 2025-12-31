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

let _cachedFilters: Filter[] = [];

export function getFilters(): Filter[] {
    return _cachedFilters;
}

export function clearFiltersCache() {
    _cachedFilters = [];
}

/**
 * フィルターのリアルタイム購読
 * @param _workspaceId 現在は未使用（将来のマルチワークスペース対応用）
 * @param onUpdate フィルター更新時のコールバック
 */
export function subscribeToFilters(_workspaceId: string, onUpdate: (filters: Filter[]) => void): Unsubscribe {
    const userId = auth.currentUser?.uid;

    if (!userId) {
        _cachedFilters = [];
        onUpdate([]);
        return () => { };
    }

    const path = paths.filters(userId);
    const q = query(collection(db, path));

    return onSnapshot(q, (snapshot) => {
        const filters = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Filter[];
        _cachedFilters = filters;
        onUpdate(filters);
    }, (error) => {
        console.error("[Filters] Subscription error:", error);
        _cachedFilters = [];
        onUpdate([]);
    });
}

/**
 * フィルターを追加
 */
export async function addFilter(filterData: Partial<Filter>) {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        toast.error('認証が必要です');
        throw new Error("Authentication required");
    }

    // Validate input (partial validation - only check name and query)
    const result = FilterSchema.pick({ name: true, query: true }).safeParse(filterData);
    if (!result.success) {
        const errorMsg = result.error.issues.map((e) => e.message).join(', ');
        console.error("[Filters] Validation failed:", result.error.flatten());
        toast.error(`バリデーションエラー: ${errorMsg}`);
        throw new Error(`Validation failed: ${errorMsg}`);
    }

    const path = paths.filters(userId);
    const { id, ...data } = filterData;

    await addDoc(collection(db, path), {
        ...data,
        ownerId: userId,
        createdAt: serverTimestamp()
    });
}

/**
 * フィルターを更新
 */
export async function updateFilter(filterId: string, filterData: Partial<Filter>) {
    const userId = auth.currentUser?.uid;
    if (!userId) {
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

    const path = paths.filters(userId);
    const { id, ...data } = filterData;

    await updateDoc(doc(db, path, filterId), {
        ...data,
        updatedAt: serverTimestamp()
    });
}


/**
 * フィルターを削除
 */
export async function deleteFilter(filterId: string) {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        toast.error('認証が必要です');
        throw new Error("Authentication required");
    }

    const path = paths.filters(userId);
    await deleteDoc(doc(db, path, filterId));
}
