// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: Grokのレビューに基づく不整合の修正（createdAt戻り値、二重発火防止、境界チェック）
 */

import { 
    collection, 
    query, 
    orderBy, 
    onSnapshot, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    serverTimestamp,
    getDocs,
    limit,
    where
} from "../core/firebase-sdk.js";

import { db, auth } from "../core/firebase.js";

const appId = (typeof window !== 'undefined' && window.GLOBAL_APP_ID) 
    ? window.GLOBAL_APP_ID 
    : (typeof __app_id !== 'undefined' ? __app_id : 'default-app-id');

const STORAGE_KEY = 'currentWorkspaceId';
const CHANGE_EVENT = 'workspace-changed';
const COLLECTION_NAME = 'workspaces';

let unsubscribe = null;
let _workspaces = [];

/**
 * キャッシュされたワークスペース一覧を取得
 */
export function getWorkspaces() {
    return _workspaces;
}

/**
 * ワークスペース一覧をリアルタイム購読
 */
export function subscribeToWorkspaces(onUpdate) {
    const user = auth.currentUser;
    if (!user) {
        onUpdate([]);
        return () => {};
    }

    if (unsubscribe) unsubscribe();

    const collRef = collection(db, 'artifacts', appId, 'users', user.uid, COLLECTION_NAME);
    const q = query(collRef, orderBy('createdAt', 'asc'));

    unsubscribe = onSnapshot(q, async (snapshot) => {
        const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        _workspaces = items;

        if (items.length === 0 && !snapshot.metadata.hasPendingWrites) {
            await ensureDefaultWorkspace(onUpdate);
        } else {
            validateCurrentWorkspace(items);
            onUpdate(items);
        }
    }, (error) => {
        console.error("Error subscribing to workspaces:", error);
        onUpdate([]);
    });

    return unsubscribe;
}

/**
 * デフォルトワークスペースの確保（二重更新を防止）
 */
async function ensureDefaultWorkspace(onUpdate) {
    try {
        const user = auth.currentUser;
        if (!user) return;
        
        const collRef = collection(db, 'artifacts', appId, 'users', user.uid, COLLECTION_NAME);
        const snapshot = await getDocs(query(collRef, limit(1)));
        
        if (snapshot.empty) {
            // 作成のみ行う。状態更新はonSnapshotに任せることで二重発火を防止
            await addWorkspace('メイン');
        }
    } catch (err) {
        console.error('Failed to ensure default workspace:', err);
    }
}

/**
 * 選択中のIDが有効か確認（境界条件チェック強化）
 */
function validateCurrentWorkspace(items) {
    if (items.length === 0) return;

    const currentId = getCurrentWorkspaceId();
    const exists = items.some(w => w.id === currentId);

    if (!currentId || !exists) {
        setCurrentWorkspaceId(items[0].id);
    }
}

export function getCurrentWorkspaceId() {
    return localStorage.getItem(STORAGE_KEY);
}

export function setCurrentWorkspaceId(id) {
    if (!id) return;
    
    const oldId = localStorage.getItem(STORAGE_KEY);
    if (oldId === id) return;

    localStorage.setItem(STORAGE_KEY, id);
    
    const event = new CustomEvent(CHANGE_EVENT, { 
        detail: { workspaceId: id } 
    });
    document.dispatchEvent(event);
}

/**
 * ワークスペース追加（戻り値のcreatedAt不整合を修正）
 */
export async function addWorkspace(name) {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const collRef = collection(db, 'artifacts', appId, 'users', user.uid, COLLECTION_NAME);
    
    const newDocData = {
        name: name,
        createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collRef, newDocData);
    
    // createdAtはサーバーでセットされるため、クライアント側では返さない（不整合防止）
    return {
        id: docRef.id,
        name: name
    };
}

/**
 * 名前の重複チェック（Grok指摘事項）
 */
export async function isWorkspaceNameDuplicate(name, excludeId = null) {
    const user = auth.currentUser;
    if (!user) return false;

    const collRef = collection(db, 'artifacts', appId, 'users', user.uid, COLLECTION_NAME);
    const q = query(collRef, where('name', '==', name), limit(5));
    const snapshot = await getDocs(q);

    return snapshot.docs.some(doc => doc.id !== excludeId);
}

export async function updateWorkspaceName(id, newName) {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, COLLECTION_NAME, id);
    await updateDoc(docRef, { name: newName });
}

export async function deleteWorkspace(id) {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, COLLECTION_NAME, id);
    await deleteDoc(docRef);
}