// @ts-nocheck
// フィルターデータの管理

import { db, auth } from '../core/firebase.js';
import { collection, addDoc, deleteDoc, doc, query, onSnapshot } from "firebase/firestore";
import { showMessageModal } from '../ui/components.js';

let _cachedFilters = [];

/**
 * 現在キャッシュされているフィルターリストを取得する
 */
export function getFilters() {
    return _cachedFilters;
}

/**
 * フィルターのリアルタイム購読
 */
export function subscribeToFilters(onUpdate) {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        if(onUpdate) onUpdate([]);
        return () => {};
    }

    const appId = window.GLOBAL_APP_ID;
    const path = `/artifacts/${appId}/users/${userId}/filters`;
    const q = query(collection(db, path)); 

    return onSnapshot(q, (snapshot) => {
        const filters = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        _cachedFilters = filters;
        if(onUpdate) onUpdate(filters);
    });
}

/**
 * フィルターを追加する
 * @param {Object} filterData - フィルター情報
 */
export async function addFilter(filterData) {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        showMessageModal("ログインが必要です");
        throw new Error("Authentication required");
    }

    const appId = window.GLOBAL_APP_ID;
    const path = `/artifacts/${appId}/users/${userId}/filters`;
    
    // UIで生成された仮IDは除外し、FirestoreにID生成を委ねる
    const { id, ...data } = filterData;

    await addDoc(collection(db, path), {
        ...data,
        ownerId: userId,
        createdAt: new Date().toISOString()
    });
}

/**
 * フィルターを削除する
 * @param {string} filterId 
 */
export async function deleteFilter(filterId) {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    const appId = window.GLOBAL_APP_ID;
    const path = `/artifacts/${appId}/users/${userId}/filters`;
    await deleteDoc(doc(db, path, filterId));
}