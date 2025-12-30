/**
 * 更新日: 2025-12-27
 * 内容: ワークスペースが0個の場合の処理を修正
 *      - ensureDefaultWorkspace() を呼び出す前に onUpdate([]) を呼び出すように変更
 *      - onSnapshot コールバックから async を削除（SDK互換性のため）
 *      - onUpdate を関数内で強制的に正規化（safeOnUpdate）し、Minifyエラーを根絶
 * TypeScript化: 2025-12-29
 */

import {
    addDoc,
    collection,
    deleteDoc, doc,
    getDocs, limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    Unsubscribe,
    updateDoc,
    where
} from "../core/firebase-sdk";

import { auth, db } from "../core/firebase";

import { paths } from '../utils/paths';

import { APP_EVENTS } from '../core/event-constants';

import { Workspace, WorkspaceSchema } from './schema';

import { useWorkspaceStore } from "./ui/workspace-store";

const CHANGE_EVENT = APP_EVENTS.WORKSPACE_CHANGED;

let unsubscribe: Unsubscribe | null = null;

export function getWorkspaces(): Workspace[] {
    return useWorkspaceStore.getState().workspaces;
}

/**
 * ワークスペース一覧をリアルタイム購読
 */
export function subscribeToWorkspaces(userId: string, onUpdate?: (workspaces: Workspace[]) => void): Unsubscribe {
    if (!userId) {
        if (onUpdate) onUpdate([]);
        return () => { };
    }

    if (unsubscribe) unsubscribe();

    const path = paths.workspaces(userId);
    const q = query(collection(db, path), orderBy('createdAt', 'asc'));

    const store = useWorkspaceStore.getState();

    unsubscribe = onSnapshot(q, (snapshot) => {
        const items: Workspace[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Workspace[];

        store.setWorkspaces(items);

        if (items.length === 0 && !snapshot.metadata.hasPendingWrites) {
            if (onUpdate) onUpdate([]);
            ensureDefaultWorkspace().catch(err => console.error('[Workspace] Default creation error:', err));
        } else {
            const currentId = validateCurrentWorkspace(items);
            if (onUpdate) onUpdate(items);
            dispatchWorkspaceEvent(currentId, items);
        }
    }, (error) => {
        console.error("[Workspace] Subscription error:", error);
        store.setWorkspaces([]);
        if (onUpdate) onUpdate([]);
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

function validateCurrentWorkspace(items: Workspace[]): string | null {
    if (items.length === 0) return null;
    const store = useWorkspaceStore.getState();
    let currentId = store.currentWorkspaceId;
    const exists = currentId ? items.some(w => w.id === currentId) : false;

    if (!currentId || !exists) {
        currentId = items[0].id!;
        store.setCurrentWorkspaceId(currentId);
    }
    return currentId;
}

export function getCurrentWorkspaceId(): string | null {
    return useWorkspaceStore.getState().currentWorkspaceId;
}

export function setCurrentWorkspaceId(id: string) {
    if (!id) return;
    const store = useWorkspaceStore.getState();
    if (store.currentWorkspaceId === id) return;
    store.setCurrentWorkspaceId(id);
    dispatchWorkspaceEvent(id, store.workspaces);
}

function dispatchWorkspaceEvent(id: string | null, workspaces: Workspace[]) {
    const event = new CustomEvent(CHANGE_EVENT, {
        detail: { workspaceId: id, workspaces: workspaces }
    });
    document.dispatchEvent(event);
}

export async function addWorkspace(name: string): Promise<{ id: string, name: string }> {
    try {
        // Validation
        WorkspaceSchema.pick({ name: true }).parse({ name });

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
        // Error notification handled by caller or UI layer
        throw e;
    }
}

export async function isWorkspaceNameDuplicate(name: string, excludeId: string | null = null): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;
    const path = paths.workspaces(user.uid);
    const q = query(collection(db, path), where('name', '==', name), limit(5));
    const snapshot = await getDocs(q);
    return snapshot.docs.some(doc => doc.id !== excludeId);
}

export async function updateWorkspaceName(id: string, newName: string): Promise<void> {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('Authentication required');
        const path = paths.workspaces(user.uid);
        await updateDoc(doc(db, path, id), { name: newName });
    } catch (e) {
        console.error("[Workspace] Update error:", e);
        // Error notification handled by caller or UI layer
    }
}

export async function deleteWorkspace(id: string): Promise<void> {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('Authentication required');
        const path = paths.workspaces(user.uid);
        await deleteDoc(doc(db, path, id));
    } catch (e) {
        console.error("[Workspace] Delete error:", e);
        // Error notification handled by caller or UI layer
    }
}
