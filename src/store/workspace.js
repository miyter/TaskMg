// @ts-nocheck
/**
 * 更新日: 2025-12-27
 * 内容: ワークスペースが0個の場合の処理を修正
 *      - ensureDefaultWorkspace() を呼び出す前に onUpdate([]) を呼び出すように変更
 *      - onSnapshot コールバックから async を削除（SDK互換性のため）
 *      - onUpdate を関数内で強制的に正規化（safeOnUpdate）し、Minifyエラーを根絶
 */

import {
    collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDocs, limit, where
} from "../core/firebase-sdk.js";

import { db, auth } from "../core/firebase.js";
import { paths } from '../utils/paths.js';
import { showMessageModal } from '../ui/components.js';

import { APP_EVENTS } from '../core/event-constants.js';

const STORAGE_KEY = 'currentWorkspaceId';
const CHANGE_EVENT = APP_EVENTS.WORKSPACE_CHANGED;

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
    // コールバックの安全な正規化（nullやundefined対策の決定版）
    const safeOnUpdate = typeof onUpdate === 'function' ? onUpdate : () => { };

    if (!userId) {
        safeOnUpdate([]);
        return () => { };
    }

    if (unsubscribe) unsubscribe();

    const path = paths.workspaces(userId);
    const q = query(collection(db, path), orderBy('createdAt', 'asc'));


    unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        _workspaces = items;

        if (items.length === 0 && !snapshot.metadata.hasPendingWrites) {
            // ワークスペースが0個の場合、デフォルトを作成
            // 作成後、再度 onSnapshot が発火して正しく処理される
            safeOnUpdate([]);
            ensureDefaultWorkspace().catch(err => console.error('[Workspace] Default creation error:', err));
        } else {
            const currentId = validateCurrentWorkspace(items);
            safeOnUpdate(items);
            dispatchWorkspaceEvent(currentId, items);
        }
    }, (error) => {
        console.error("[Workspace] Subscription error:", error);
        safeOnUpdate([]);
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