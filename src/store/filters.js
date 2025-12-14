// @ts-nocheck
// フィルターデータの管理

import { db, auth } from '../core/firebase.js';
import { collection, addDoc, deleteDoc, doc, query, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { showMessageModal } from '../ui/components.js';
import { getCurrentWorkspaceId } from './workspace.js';

let _cachedFilters = [];

// 修正: GLOBAL_APP_ID に統一
const appId = (typeof window !== 'undefined' && window.GLOBAL_APP_ID) 
    ? window.GLOBAL_APP_ID 
    : 'default-app-id';

/**
 * 現在キャッシュされているフィルターリストを取得する
 */
export function getFilters() {
    return _cachedFilters;
}

/**
 * キャッシュをクリアする (ワークスペース切り替え時などに使用)
 */
export function clearFiltersCache() {
    _cachedFilters = [];
}

/**
 * フィルターコレクションへのパスを取得する内部ヘルパー
 */
function getFiltersPath(userId) {
    const workspaceId = getCurrentWorkspaceId();
    if (!workspaceId) return null;

    return `/artifacts/${appId}/workspaces/${workspaceId}/users/${userId}/filters`;
}

/**
 * フィルターのリアルタイム購読
 */
export function subscribeToFilters(onUpdate) {
    const userId = auth.currentUser?.uid;
    const workspaceId = getCurrentWorkspaceId();

    // ユーザー未認証またはワークスペース未選択時は空データを返す
    if (!userId || !workspaceId) {
        _cachedFilters = [];
        if(onUpdate) onUpdate([]);
        return () => {};
    }

    const path = getFiltersPath(userId);
    // パス生成に失敗した場合も安全にリターン
    if (!path) {
        _cachedFilters = []; // 保証
        if(onUpdate) onUpdate([]);
        return () => {};
    }

    const q = query(collection(db, path)); 

    return onSnapshot(q, (snapshot) => {
        const filters = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        _cachedFilters = filters;
        if(onUpdate) onUpdate(filters);
    }, (error) => {
        console.error("Error subscribing to filters:", error);
        _cachedFilters = []; // エラー時もクリア
        if(onUpdate) onUpdate([]);
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

    const path = getFiltersPath(userId);
    if (!path) {
        showMessageModal("ワークスペースを選択してください");
        throw new Error("Workspace selection required");
    }
    
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

    const path = getFiltersPath(userId);
    if (!path) return; // ワークスペース未選択なら何もしない

    await deleteDoc(doc(db, path, filterId));
}