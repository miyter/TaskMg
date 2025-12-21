// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: 引数シグネチャの修正 (userId, onUpdate)
 */

import {
    collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDocs, limit, where
} from "../core/firebase-sdk.js";

import { db, auth } from "../core/firebase.js";
import { paths } from '../utils/paths.js';
import { showMessageModal } from '../ui/components.js';

const STORAGE_KEY = 'currentWorkspaceId';
const CHANGE_EVENT = 'workspace-changed';

let unsubscribe = null;
let _workspaces = [];

export function getWorkspaces() {
    return _workspaces;
}

/**
 * ワークスペース一覧をリアルタイム購読
 * @param {string} userId
 * @param {function} onUpdate
 */
export function subscribeToWorkspaces(userId, onUpdate) {
    if (!userId) {
        if (typeof onUpdate === 'function') onUpdate([]);
        return () => { };
    }

    if (unsubscribe) unsubscribe();

    const path = paths.workspaces(userId);
    const q = query(collection(db, path), orderBy('createdAt', 'asc'));

    unsubscribe = onSnapshot(q, async (snapshot) => {
        const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        _workspaces = items;

        if (items.length === 0 && !snapshot.metadata.hasPendingWrites) {
            await ensureDefaultWorkspace();
        } else {
            const currentId = validateCurrentWorkspace(items);
            if (typeof onUpdate === 'function') onUpdate(items);
            dispatchWorkspaceEvent(currentId, items);
        }
    }, (error) => {
        console.error("[Workspace] Subscription error:", error);
        if (typeof onUpdate === 'function') onUpdate([]);
    });

    return unsubscribe;
}

async function ensureDefaultWorkspace() {
    try {
        const user = auth.currentUser;
        if (!user) return;
        const path = paths.workspaces(user.uid);
        const snapshot = await getDocs(query(collection(db, path), limit(1)));
        if (snapshot.empty) {
            await addWorkspace('メイン');
        }
    } catch (err) {
        console.error('[Workspace] Failed to ensure default workspace:', err);
    }
}

function validateCurrentWorkspace(items) {
    if (items.length === 0) return null;
    let currentId = getCurrentWorkspaceId();
    const exists = items.some(w => w.id === currentId);
    if (!currentId || !exists) {
        currentId = items[0].id;
        localStorage.setItem(STORAGE_KEY, currentId);
    }
    return currentId;
}

export function getCurrentWorkspaceId() {
    return localStorage.getItem(STORAGE_KEY);
}

export function setCurrentWorkspaceId(id) {
    if (!id) return;
    const oldId = localStorage.getItem(STORAGE_KEY);
    if (oldId === id) return;
    localStorage.setItem(STORAGE_KEY, id);
    dispatchWorkspaceEvent(id, _workspaces);
}

function dispatchWorkspaceEvent(id, workspaces) {
    const event = new CustomEvent(CHANGE_EVENT, {
        detail: { workspaceId: id, workspaces: workspaces }
    });
    document.dispatchEvent(event);
}

export async function addWorkspace(name) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('Authentication required');
        const path = paths.workspaces(user.uid);
        const docRef = await addDoc(collection(db, path), {
            name: name,
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, name: name };
    } catch (e) {
        console.error("[Workspace] Add error:", e);
        showMessageModal("ワークスペースの作成に失敗した。");
        throw e;
    }
}

export async function isWorkspaceNameDuplicate(name, excludeId = null) {
    const user = auth.currentUser;
    if (!user) return false;
    const path = paths.workspaces(user.uid);
    const q = query(collection(db, path), where('name', '==', name), limit(5));
    const snapshot = await getDocs(q);
    return snapshot.docs.some(doc => doc.id !== excludeId);
}

export async function updateWorkspaceName(id, newName) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('Authentication required');
        const path = paths.workspaces(user.uid);
        await updateDoc(doc(db, path, id), { name: newName });
    } catch (e) {
        console.error("[Workspace] Update error:", e);
        showMessageModal("名前の更新に失敗した。");
    }
}

export async function deleteWorkspace(id) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('Authentication required');
        const path = paths.workspaces(user.uid);
        await deleteDoc(doc(db, path, id));
    } catch (e) {
        console.error("[Workspace] Delete error:", e);
        showMessageModal("削除に失敗した。");
    }
}