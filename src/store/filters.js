// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: subscribeToFilters の引数シグネチャを (workspaceId, onUpdate) に統一
 */

import { db, auth } from '../core/firebase.js';
import { 
    collection, addDoc, deleteDoc, updateDoc, doc, query, onSnapshot, serverTimestamp 
} from "../core/firebase-sdk.js";
import { paths } from '../utils/paths.js';

let _cachedFilters = [];

export function getFilters() {
    return _cachedFilters;
}

export function clearFiltersCache() {
    _cachedFilters = [];
}

/**
 * フィルターのリアルタイム購読
 */
export function subscribeToFilters(workspaceId, onUpdate) {
    const callback = typeof workspaceId === 'function' ? workspaceId : onUpdate;
    const userId = auth.currentUser?.uid;

    if (!userId || typeof callback !== 'function') {
        _cachedFilters = [];
        if (typeof callback === 'function') callback([]);
        return () => {};
    }

    const path = paths.filters(userId);
    const q = query(collection(db, path)); 

    return onSnapshot(q, (snapshot) => {
        const filters = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
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
export async function addFilter(filterData) {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("Authentication required");

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
export async function updateFilter(filterId, filterData) {
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
export async function deleteFilter(filterId) {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("Authentication required");

    const path = paths.filters(userId);
    await deleteDoc(doc(db, path, filterId));
}