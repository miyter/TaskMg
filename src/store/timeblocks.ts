/**
 * TimeBlock Store with Caching
 * Updated to use Workspace-aware caching (Map) instead of global array.
 */

import { auth, db } from "../core/firebase";
import {
    Unsubscribe,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    writeBatch
} from "../core/firebase-sdk";
import { paths } from '../utils/paths';
import { TimeBlock } from './schema';

const defaultTimeBlocks: TimeBlock[] = [
    { id: 'tb_morning', name: '06:00 - 09:00', start: '06:00', end: '09:00', color: '#EF4444', order: 0 },
    { id: 'tb_afternoon', name: '13:00 - 17:00', start: '13:00', end: '17:00', color: '#3B82F6', order: 1 },
    { id: 'tb_night', name: '20:00 - 22:00', start: '20:00', end: '22:00', color: '#8B5CF6', order: 2 }
];

class TimeBlockCache {
    private static instance: TimeBlockCache;
    private cacheMap = new Map<string, TimeBlock[]>();
    private listeners = new Map<string, Set<(blocks: TimeBlock[]) => void>>();
    private unsubscribes = new Map<string, Unsubscribe>();

    private constructor() { }

    public static getInstance(): TimeBlockCache {
        if (!TimeBlockCache.instance) {
            TimeBlockCache.instance = new TimeBlockCache();
        }
        return TimeBlockCache.instance;
    }

    public getBlocks(workspaceId: string): TimeBlock[] {
        return this.cacheMap.get(workspaceId) || [];
    }

    public isInitialized(workspaceId: string): boolean {
        return this.cacheMap.has(workspaceId);
    }

    public setCache(workspaceId: string, blocks: TimeBlock[]) {
        this.cacheMap.set(workspaceId, blocks);
        this.notify(workspaceId);
    }

    private notify(workspaceId: string) {
        const blocks = this.getBlocks(workspaceId);
        const workspaceListeners = this.listeners.get(workspaceId);
        if (workspaceListeners) {
            workspaceListeners.forEach(cb => cb([...blocks]));
        }
    }

    public subscribe(userId: string | undefined, workspaceId: string, callback: (blocks: TimeBlock[]) => void): Unsubscribe {
        if (!userId || !workspaceId) {
            callback([]);
            return () => { };
        }

        // Register listener
        if (!this.listeners.has(workspaceId)) {
            this.listeners.set(workspaceId, new Set());
        }
        this.listeners.get(workspaceId)!.add(callback);

        // Initial Return (Optimistic)
        const cached = this.cacheMap.get(workspaceId);
        if (cached) {
            // Async callback to avoid React warning
            queueMicrotask(() => callback([...cached]));
        }

        // Start Firestore subscription if needed
        if (!this.unsubscribes.has(workspaceId)) {
            const path = paths.timeblocks(userId, workspaceId);
            const q = query(collection(db, path), orderBy('order', 'asc'));

            let isFirstSnapshot = true;

            const unsub = onSnapshot(q, (snapshot) => {
                const blocks = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as TimeBlock[];

                // Default creation logic
                if (isFirstSnapshot && blocks.length === 0 && !snapshot.metadata.hasPendingWrites) {
                    isFirstSnapshot = false;
                    createDefaultTimeBlocks(userId, workspaceId).catch(err =>
                        console.error('[TimeBlocks] Failed to create defaults:', err)
                    );
                    return;
                }
                isFirstSnapshot = false;

                // Update cache
                this.cacheMap.set(workspaceId, blocks);
                this.notify(workspaceId);

            }, (error) => {
                console.error("[TimeBlocks] Subscription error:", error);
            });

            this.unsubscribes.set(workspaceId, unsub);
        }

        return () => {
            const workspaceListeners = this.listeners.get(workspaceId);
            if (workspaceListeners) {
                workspaceListeners.delete(callback);
                // Clean up if no listeners? 
                // Currently keeping cache for fast switching (Memory leak risk if many workspaces, but usually small)
                // If we want to strictly clean up:
                /*
                if (workspaceListeners.size === 0) {
                    this.unsubscribes.get(workspaceId)?.();
                    this.unsubscribes.delete(workspaceId);
                    this.cacheMap.delete(workspaceId); 
                }
                */
            }
        };
    }
}

const cache = TimeBlockCache.getInstance();

async function createDefaultTimeBlocks(userId: string, workspaceId: string): Promise<void> {
    const path = paths.timeblocks(userId, workspaceId);
    const batch = writeBatch(db);

    defaultTimeBlocks.forEach((block) => {
        const ref = doc(db, path, block.id!);
        batch.set(ref, {
            name: block.name,
            start: block.start,
            end: block.end,
            color: block.color,
            order: block.order,
            updatedAt: serverTimestamp()
        });
    });

    await batch.commit();
}

/**
 * タイムブロックの購読
 */
export function subscribeToTimeBlocks(workspaceId: string, callback: (blocks: TimeBlock[]) => void): Unsubscribe {
    const userId = auth.currentUser?.uid;
    return cache.subscribe(userId, workspaceId, callback);
}

/**
 * 同期的にキャッシュを取得
 */
export function getTimeBlocks(workspaceId: string): TimeBlock[] {
    return cache.getBlocks(workspaceId);
}

export function isTimeBlocksInitialized(workspaceId: string): boolean {
    return cache.isInitialized(workspaceId);
}

/**
 * 以前の global 変数クリア関数 (互換性維持または削除)
 */
export function clearTimeBlocksCache() {
    // No-op or clear all?
    // cache.reset(); // Not implemented yet
}

// Write functions (Using generic writes, trusting cache updates via listener)

export async function saveTimeBlock(workspaceId: string, block: Partial<TimeBlock>): Promise<boolean | undefined> {
    const userId = auth.currentUser?.uid;
    if (!userId || !workspaceId) return;

    try {
        const path = paths.timeblocks(userId, workspaceId);
        const id = block.id || crypto.randomUUID();
        const currentBlocks = cache.getBlocks(workspaceId);
        const nextOrder = block.order !== undefined
            ? block.order
            : Math.max(...currentBlocks.map(b => b.order || 0), -1) + 1;

        const dataToSave = {
            name: block.name,
            start: block.start,
            end: block.end,
            color: block.color,
            order: nextOrder,
            updatedAt: serverTimestamp()
        };

        // Optimistic update could be added here to cache
        // But listener is fast enough usually. 
        // For strict optimistic, we would update cacheMap.

        await setDoc(doc(db, path, id), dataToSave, { merge: true });
        return true;
    } catch (e) {
        console.error("[TimeBlocks] Save error:", e);
    }
}

export async function deleteTimeBlock(workspaceId: string, id: string): Promise<boolean | undefined> {
    const userId = auth.currentUser?.uid;
    if (!userId || !workspaceId) return;
    try {
        const path = paths.timeblocks(userId, workspaceId);
        await deleteDoc(doc(db, path, id));
        return true;
    } catch (e) {
        console.error("[TimeBlocks] Delete error:", e);
    }
}

export async function updateTimeBlockOrder(workspaceId: string, orderedIds: string[]) {
    const userId = auth.currentUser?.uid;
    if (!userId || !workspaceId) return;
    try {
        // Optimistic update
        const currentBlocks = cache.getBlocks(workspaceId);
        const idToIndex = new Map(orderedIds.map((id, index) => [id, index]));
        const newBlocks = currentBlocks.map(b => ({
            ...b,
            order: idToIndex.has(b.id!) ? idToIndex.get(b.id!) : b.order
        })).sort((a, b) => (a.order || 0) - (b.order || 0));

        cache.setCache(workspaceId, newBlocks);

        const path = paths.timeblocks(userId, workspaceId);
        const batch = writeBatch(db);
        orderedIds.forEach((id, index) => {
            const ref = doc(db, path, id);
            batch.update(ref, { order: index });
        });
        await batch.commit();
    } catch (e) {
        console.error("[TimeBlocks] Order update error:", e);
    }
}
