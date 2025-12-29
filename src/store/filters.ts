/**
 * 更新日: 2025-12-21
 * 内容: subscribeToFilters の引数シグネチャを (workspaceId, onUpdate) に統一
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
import { Filter } from './schema';

let _cachedFilters: Filter[] = [];

export function getFilters(): Filter[] {
    return _cachedFilters;
}

export function clearFiltersCache() {
    _cachedFilters = [];
}

/**
 * フィルターのリアルタイム購読
 */
export function subscribeToFilters(workspaceId: string | ((filters: Filter[]) => void), onUpdate?: (filters: Filter[]) => void): Unsubscribe {
    const callback = typeof workspaceId === 'function' ? workspaceId : onUpdate;
    const userId = auth.currentUser?.uid;

    if (!userId || typeof callback !== 'function') {
        _cachedFilters = [];
        if (typeof callback === 'function') callback([]);
        return () => { };
    }

    const path = paths.filters(userId);
    const q = query(collection(db, path));

    return onSnapshot(q, (snapshot) => {
        const filters = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Filter[];
        _cachedFilters = filters;
        callback(filters);
    }, (error) => {
        console.error("Error subscribing to filters:", error);
        _cachedFilters = [];
        callback([]);
    });
}

/**
 * フィルターを追加
 */
export async function addFilter(filterData: Partial<Filter>) {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("Authentication required");

    // Validation
    // FilterSchema.parse(filterData); // id is optional in schema, created at optional

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
    if (!userId) throw new Error("Authentication required");

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
    if (!userId) throw new Error("Authentication required");

    const path = paths.filters(userId);
    await deleteDoc(doc(db, path, filterId));
}
