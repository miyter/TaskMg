/**
 * TimeBlock Store - Raw Implementation
 * Handles Firestore Direct Access and Caching
 */

import { db } from '../core/firebase';
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
import { UI_CONFIG } from '../core/ui-constants';
import { paths } from '../utils/paths';
import { withRetry } from '../utils/retry';
import { TimeBlock } from './schema';
import { toast } from './ui/toast-store';


const defaultTimeBlocks: TimeBlock[] = UI_CONFIG.TIME_BLOCK.DEFAULTS.map(b => ({ ...b })) as TimeBlock[];

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
            // Defensive copy
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

// --- Raw Exports ---

export function subscribeToTimeBlocksRaw(userId: string, workspaceId: string, callback: (blocks: TimeBlock[]) => void): Unsubscribe {
    return cache.subscribe(userId, workspaceId, callback);
}

export function getTimeBlocksRaw(workspaceId: string): TimeBlock[] {
    return cache.getBlocks(workspaceId);
}

export function isTimeBlocksInitializedRaw(workspaceId: string): boolean {
    return cache.isInitialized(workspaceId);
}

export async function addTimeBlockRaw(userId: string, workspaceId: string, block: TimeBlock) {
    const originalBlocks = cache.getBlocks(workspaceId);

    // Optimistic Update
    const newBlocks = [...originalBlocks, block].sort((a, b) => (a.order || 0) - (b.order || 0));
    cache.setCache(workspaceId, newBlocks);

    const path = paths.timeblocks(userId, workspaceId);
    const id = block.id || crypto.randomUUID(); // Fallback if no ID, but usually provided by caller

    return withRetry(async () => {
        await setDoc(doc(db, path, id), {
            ...block,
            updatedAt: serverTimestamp()
        });
    }, {
        onFinalFailure: () => {
            cache.setCache(workspaceId, originalBlocks);
            toast.error('タイムブロックの作成に失敗しました');
        }
    });
}

export async function updateTimeBlockRaw(userId: string, workspaceId: string, blockId: string, updates: Partial<TimeBlock>) {
    const originalBlocks = cache.getBlocks(workspaceId);

    // Optimistic Update
    const newBlocks = originalBlocks.map(b => b.id === blockId ? { ...b, ...updates } : b)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    cache.setCache(workspaceId, newBlocks);

    const path = paths.timeblocks(userId, workspaceId);

    return withRetry(async () => {
        await setDoc(doc(db, path, blockId), {
            ...updates,
            updatedAt: serverTimestamp()
        }, { merge: true });
    }, {
        onFinalFailure: () => {
            cache.setCache(workspaceId, originalBlocks);
            toast.error('タイムブロックの更新に失敗しました');
        }
    });
}

export async function deleteTimeBlockRaw(userId: string, workspaceId: string, blockId: string) {
    const originalBlocks = cache.getBlocks(workspaceId);

    // Optimistic Update
    const newBlocks = originalBlocks.filter(b => b.id !== blockId);
    cache.setCache(workspaceId, newBlocks);

    const path = paths.timeblocks(userId, workspaceId);

    return withRetry(async () => {
        await deleteDoc(doc(db, path, blockId));
    }, {
        onFinalFailure: () => {
            cache.setCache(workspaceId, originalBlocks);
            toast.error('タイムブロックの削除に失敗しました');
        }
    });
}

export async function updateTimeBlockOrderRaw(userId: string, workspaceId: string, orderedIds: string[]) {
    const originalBlocks = cache.getBlocks(workspaceId);

    // Optimistic Update
    const idToIndex = new Map(orderedIds.map((id, index) => [id, index]));
    const newBlocks = originalBlocks.map(b => ({
        ...b,
        order: idToIndex.has(b.id!) ? idToIndex.get(b.id!) : b.order
    })).sort((a, b) => (a.order || 0) - (b.order || 0));

    cache.setCache(workspaceId, newBlocks);

    const path = paths.timeblocks(userId, workspaceId);

    return withRetry(async () => {
        const batch = writeBatch(db);
        orderedIds.forEach((id, index) => {
            const ref = doc(db, path, id);
            batch.update(ref, { order: index });
        });
        await batch.commit();
    }, {
        onFinalFailure: () => {
            cache.setCache(workspaceId, originalBlocks);
            toast.error('並び替えの保存に失敗しました');
        }
    });
}
