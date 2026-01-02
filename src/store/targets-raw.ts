/**
 * 更新日: 2026-01-02
 * 内容: TargetCache クラスへの移行と Optimistic Update の強化
 *      - 成功時の自動更新、失敗時のロールバック、Toast通知を追加
 *      - queueMicrotask による React 18 Strict Mode 対応
 */

import {
    addDoc,
    collection,
    deleteDoc, doc,
    onSnapshot, orderBy,
    query,
    serverTimestamp, Unsubscribe,
    updateDoc
} from "../core/firebase-sdk";

import { db } from '../core/firebase';
import { areArraysEqual } from '../utils/compare';
import { paths } from '../utils/paths';
import { withRetry } from '../utils/retry';
import { Target } from './schema';
import { toast } from './ui/toast-store';

class TargetCache {
    private cachedTargetsMap = new Map<string, Target[]>();
    private listeners = new Map<string, Set<(targets: Target[]) => void>>();
    private unsubscribes = new Map<string, Unsubscribe>();

    public isInitialized(workspaceId: string): boolean {
        return this.cachedTargetsMap.has(workspaceId);
    }

    private notifyListeners(workspaceId: string) {
        const targets = this.cachedTargetsMap.get(workspaceId) || [];
        const listeners = this.listeners.get(workspaceId);
        if (listeners) {
            const targetsCopy = [...targets];
            listeners.forEach(listener => listener(targetsCopy));
        }
    }

    public setCache(workspaceId: string, targets: Target[]) {
        this.cachedTargetsMap.set(workspaceId, targets);
        this.notifyListeners(workspaceId);
    }

    public getTargets(workspaceId: string): Target[] {
        return this.cachedTargetsMap.get(workspaceId) || [];
    }

    public subscribe(userId: string, workspaceId: string, onUpdate: (targets: Target[]) => void): Unsubscribe {
        if (!this.listeners.has(workspaceId)) {
            this.listeners.set(workspaceId, new Set());
        }
        const listeners = this.listeners.get(workspaceId)!;
        listeners.add(onUpdate);

        const cached = this.cachedTargetsMap.get(workspaceId);
        if (cached) {
            queueMicrotask(() => onUpdate([...cached]));
        }

        if (!this.unsubscribes.has(workspaceId)) {
            const path = paths.targets(userId, workspaceId);
            // 作成日順（新しいものが上）
            const q = query(collection(db, path), orderBy('createdAt', 'desc'));
            console.log(`[TargetCache] Subscribing to path: ${path}`);
            const unsub = onSnapshot(q, (snapshot) => {
                const targets = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Target[];
                const currentCached = this.cachedTargetsMap.get(workspaceId);

                // 変更がない場合は更新スキップ
                if (currentCached && areArraysEqual(currentCached, targets)) {
                    return;
                }

                console.log(`[TargetCache] Received ${targets.length} targets from Firestore for workspace: ${workspaceId}`);
                this.cachedTargetsMap.set(workspaceId, targets);
                this.notifyListeners(workspaceId);
            }, (error) => {
                console.error("[TargetCache] Subscription error:", error);
                this.cachedTargetsMap.set(workspaceId, []);
                this.notifyListeners(workspaceId);
            });

            this.unsubscribes.set(workspaceId, unsub);
        }

        return () => {
            listeners.delete(onUpdate);
            if (listeners.size === 0) {
                this.unsubscribes.get(workspaceId)?.();
                this.unsubscribes.delete(workspaceId);
                this.listeners.delete(workspaceId);
            }
        };
    }
}

export const targetCache = new TargetCache();

export const isTargetsInitialized = (workspaceId: string) => targetCache.isInitialized(workspaceId);
export const getTargets = (workspaceId: string) => targetCache.getTargets(workspaceId);
export const updateTargetsCacheRaw = (workspaceId: string, targets: Target[]) => targetCache.setCache(workspaceId, targets);

export function subscribeToTargetsRaw(userId: string, workspaceId: string, onUpdate: (targets: Target[]) => void, onError?: (error: unknown) => void): Unsubscribe {
    if (!userId || !workspaceId) {
        onUpdate([]);
        return () => { };
    }
    return targetCache.subscribe(userId, workspaceId, (targets) => {
        onUpdate(targets);
    });
}

export async function addTargetRaw(userId: string, workspaceId: string, targetData: Partial<Target>) {
    const originalTargets = targetCache.getTargets(workspaceId);

    // Optimistic Update
    const tempId = 'temp-' + Date.now();
    const newTarget: Target = {
        id: tempId,
        mode: targetData.mode || '',
        data: targetData.data || {},
        ownerId: userId,
        workspaceId,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...targetData
    } as Target;
    targetCache.setCache(workspaceId, [newTarget, ...originalTargets]); // 新しいものが上

    return withRetry(async () => {
        const path = paths.targets(userId, workspaceId);

        const payload = {
            ...targetData,
            ownerId: userId,
            workspaceId: workspaceId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
        delete payload.id;

        await addDoc(collection(db, path), payload);
    }, {
        onFinalFailure: () => {
            console.error(`[TargetCache] Failed to add target`);
            targetCache.setCache(workspaceId, originalTargets);
            toast.error('目標の追加に失敗しました');
        }
    });
}

export async function updateTargetRaw(userId: string, workspaceId: string, targetId: string, updates: Partial<Target>) {
    const originalTargets = targetCache.getTargets(workspaceId);

    // Optimistic Update
    const newTargets = originalTargets.map(t => t.id === targetId ? { ...t, ...updates, updatedAt: new Date() } : t);
    targetCache.setCache(workspaceId, newTargets);

    return withRetry(async () => {
        const path = paths.targets(userId, workspaceId);
        const ref = doc(db, path, targetId);
        await updateDoc(ref, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    }, {
        onFinalFailure: () => {
            targetCache.setCache(workspaceId, originalTargets);
            toast.error('目標の更新に失敗しました');
        }
    });
}

export async function deleteTargetRaw(userId: string, workspaceId: string, targetId: string) {
    const originalTargets = targetCache.getTargets(workspaceId);

    // Optimistic Update
    const newTargets = originalTargets.filter(t => t.id !== targetId);
    targetCache.setCache(workspaceId, newTargets);

    return withRetry(async () => {
        const path = paths.targets(userId, workspaceId);
        await deleteDoc(doc(db, path, targetId));
    }, {
        onFinalFailure: () => {
            targetCache.setCache(workspaceId, originalTargets);
            toast.error('目標の削除に失敗しました');
        }
    });
}
