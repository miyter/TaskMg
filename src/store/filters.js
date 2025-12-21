// @ts-nocheck
// @miyter:20251221
// フィルターデータの管理
// ★修正: ガード処理の統一(throw)、サーバータイムスタンプの導入

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
 * Note: フィルターはユーザー単位の設定として扱う（ワークスペース間で共有）
 */
export function subscribeToFilters(onUpdate) {
    const userId = auth.currentUser?.uid;

    if (!userId) {
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
    if (!userId) throw new Error("Authentication required");

    const path = paths.filters(userId);
    const { id, ...data } = filterData;

    await addDoc(collection(db, path), {
        ...data,
        ownerId: userId,
        createdAt: serverTimestamp() // 修正: サーバー時刻を使用
    });
}

/**
 * フィルターを更新
 */
export async function updateFilter(filterId, filterData) {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("Authentication required"); // 修正: ガードをthrowに統一

    const path = paths.filters(userId);
    const { id, ...data } = filterData;

    await updateDoc(doc(db, path, filterId), {
        ...data,
        updatedAt: serverTimestamp() // 修正: サーバー時刻を使用
    });
}

/**
 * フィルターを削除
 */
export async function deleteFilter(filterId) {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("Authentication required"); // 修正: ガードをthrowに統一

    const path = paths.filters(userId);
    await deleteDoc(doc(db, path, filterId));
}