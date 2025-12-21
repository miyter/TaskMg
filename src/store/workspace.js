// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: paths.jsへの依存統合、appId重複排除
 */

import { 
    collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDocs, limit, where
} from "../core/firebase-sdk.js";

import { db, auth } from "../core/firebase.js";
import { paths } from '../utils/paths.js';

const STORAGE_KEY = 'currentWorkspaceId';
const CHANGE_EVENT = 'workspace-changed';

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

    // paths.jsを利用してパス生成
    const path = paths.workspaces(user.uid);
    const q = query(collection(db, path), orderBy('createdAt', 'asc'));

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
 * デフォルトワークスペースの確保
 */
async function ensureDefaultWorkspace(onUpdate) {
    try {
        const user = auth.currentUser;
        if (!user) return;
        
        const path = paths.workspaces(user.uid);
        const snapshot = await getDocs(query(collection(db, path), limit(1)));
        
        if (snapshot.empty) {
            await addWorkspace('メイン');
        }
    } catch (err) {
        console.error('Failed to ensure default workspace:', err);
    }
}

/**
 * 選択中のIDが有効か確認
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
 * ワークスペース追加
 */
export async function addWorkspace(name) {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const path = paths.workspaces(user.uid);
    
    const newDocData = {
        name: name,
        createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, path), newDocData);
    
    return {
        id: docRef.id,
        name: name
    };
}

/**
 * 名前の重複チェック
 */
export async function isWorkspaceNameDuplicate(name, excludeId = null) {
    const user = auth.currentUser;
    if (!user) return false;

    const path = paths.workspaces(user.uid);
    const q = query(collection(db, path), where('name', '==', name), limit(5));
    const snapshot = await getDocs(q);

    return snapshot.docs.some(doc => doc.id !== excludeId);
}

export async function updateWorkspaceName(id, newName) {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const path = paths.workspaces(user.uid);
    await updateDoc(doc(db, path, id), { name: newName });
}

export async function deleteWorkspace(id) {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const path = paths.workspaces(user.uid);
    await deleteDoc(doc(db, path, id));
}