// @ts-nocheck
// @miyter:20251221
// フィルターデータの管理

import { db, auth } from '../core/firebase.js';
import { 
    collection, addDoc, deleteDoc, updateDoc, doc, query, onSnapshot 
} from "../core/firebase-sdk.js";
import { showMessageModal } from '../ui/components.js';
import { getCurrentWorkspaceId } from './workspace.js';
import { paths } from '../utils/paths.js'; // パス管理を導入

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
export function subscribeToFilters(onUpdate) {
    const userId = auth.currentUser?.uid;
    const workspaceId = getCurrentWorkspaceId();

    if (!userId || !workspaceId) {
        _cachedFilters = [];
        if(onUpdate) onUpdate([]);
        return () => {};
    }

    const path = paths.filters(userId);
    const q = query(collection(db, path)); 

    return onSnapshot(q, (snapshot) => {
        const filters = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        _cachedFilters = filters;
        if(onUpdate) onUpdate(filters);
    }, (error) => {
        console.error("Error subscribing to filters:", error);
        _cachedFilters = [];
        if(onUpdate) onUpdate([]);
    });
}

/**
 * フィルターを追加
 */
export async function addFilter(filterData) {
    const userId = auth.currentUser?.uid;
    const workspaceId = getCurrentWorkspaceId();
    if (!userId || !workspaceId) {
        showMessageModal("ログインまたはワークスペースの選択が必要です");
        return;
    }

    const path = paths.filters(userId);
    const { id, ...data } = filterData;

    await addDoc(collection(db, path), {
        ...data,
        ownerId: userId,
        createdAt: new Date().toISOString()
    });
}

/**
 * フィルターを更新
 */
export async function updateFilter(filterId, filterData) {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const path = paths.filters(userId);
    const { id, ...data } = filterData;

    await updateDoc(doc(db, path, filterId), {
        ...data,
        updatedAt: new Date().toISOString()
    });
}

/**
 * フィルターを削除
 */
export async function deleteFilter(filterId) {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const path = paths.filters(userId);
    await deleteDoc(doc(db, path, filterId));
}