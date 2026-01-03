/**
 * 更新日: 2026-01-02
 * 内容: LabelCache クラスへの移行と Optimistic Update の強化
 *      - 成功時の自動更新、失敗時のロールバック、Toast通知を追加
 *      - queueMicrotask による React 18 Strict Mode 対応
 */

import {
    addDoc,
    collection,
    deleteDoc, doc,
    onSnapshot,
    query,
    serverTimestamp, Unsubscribe,
    updateDoc
} from "../core/firebase-sdk";

import { db } from '../core/firebase';
import { paths } from '../utils/paths';
import { withRetry } from '../utils/retry';
import { Label } from './schema';
import { toast } from './ui/toast-store';

class LabelCache {
    private cachedLabelsMap = new Map<string, Label[]>();
    private listeners = new Map<string, Set<(labels: Label[]) => void>>();
    private unsubscribes = new Map<string, Unsubscribe>();

    public isInitialized(workspaceId: string): boolean {
        return this.cachedLabelsMap.has(workspaceId);
    }

    private notifyListeners(workspaceId: string) {
        const labels = this.cachedLabelsMap.get(workspaceId) || [];
        const listeners = this.listeners.get(workspaceId);
        if (listeners) {
            const labelsCopy = [...labels];
            listeners.forEach(listener => listener(labelsCopy));
        }
    }

    public setCache(workspaceId: string, labels: Label[]) {
        this.cachedLabelsMap.set(workspaceId, labels);
        this.notifyListeners(workspaceId);
    }

    public getLabels(workspaceId: string): Label[] {
        return this.cachedLabelsMap.get(workspaceId) || [];
    }

    public subscribe(userId: string, workspaceId: string, onUpdate: (labels: Label[]) => void): Unsubscribe {
        if (!this.listeners.has(workspaceId)) {
            this.listeners.set(workspaceId, new Set());
        }
        const listeners = this.listeners.get(workspaceId)!;
        listeners.add(onUpdate);

        const cached = this.cachedLabelsMap.get(workspaceId);
        if (cached) {
            queueMicrotask(() => onUpdate([...cached]));
        }

        if (!this.unsubscribes.has(workspaceId)) {
            const path = paths.labels(userId, workspaceId);
            const q = query(collection(db, path));
            console.log(`[LabelCache] Subscribing to path: ${path}`);
            const unsub = onSnapshot(q, (snapshot) => {
                const labels = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Label[];
                console.log(`[LabelCache] Received ${labels.length} labels from Firestore for workspace: ${workspaceId}`);

                this.cachedLabelsMap.set(workspaceId, labels);
                this.notifyListeners(workspaceId);
            }, (error) => {
                console.error("[LabelCache] Subscription error:", error);
                this.cachedLabelsMap.set(workspaceId, []);
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

export const labelCache = new LabelCache();

export const isLabelsInitialized = (workspaceId: string) => labelCache.isInitialized(workspaceId);
export const getLabels = (workspaceId: string) => labelCache.getLabels(workspaceId);
export const updateLabelsCacheRaw = (workspaceId: string, labels: Label[]) => labelCache.setCache(workspaceId, labels);

export function subscribeToLabelsRaw(userId: string, workspaceId: string, onUpdate: (labels: Label[]) => void): Unsubscribe {
    if (!userId || !workspaceId) {
        onUpdate([]);
        return () => { };
    }
    return labelCache.subscribe(userId, workspaceId, onUpdate);
}

export async function addLabelRaw(userId: string, workspaceId: string, name: string, color: string) {
    const originalLabels = labelCache.getLabels(workspaceId);

    // Optimistic Update
    const tempId = 'temp-' + Date.now();
    const newLabel: Label = { id: tempId, name, color, ownerId: userId, createdAt: new Date() } as Label;
    labelCache.setCache(workspaceId, [...originalLabels, newLabel]);

    const path = paths.labels(userId, workspaceId);
    console.log(`[LabelCache] Adding label to path: ${path}`);

    return withRetry(async () => {
        await addDoc(collection(db, path), {
            name,
            color,
            ownerId: userId,
            workspaceId,
            createdAt: serverTimestamp()
        });
    }, {
        onFinalFailure: () => {
            console.error(`[LabelCache] Failed to add label: ${name}`);
            labelCache.setCache(workspaceId, originalLabels);
            toast.error('ラベルの追加に失敗しました');
        }
    });
}

export async function updateLabelRaw(userId: string, workspaceId: string, labelId: string, updates: Partial<Label>) {
    const originalLabels = labelCache.getLabels(workspaceId);

    // Optimistic Update
    const newLabels = originalLabels.map(l => l.id === labelId ? { ...l, ...updates } : l);
    labelCache.setCache(workspaceId, newLabels);

    return withRetry(async () => {
        const path = paths.labels(userId, workspaceId);
        const ref = doc(db, path, labelId);
        await updateDoc(ref, updates);
    }, {
        onFinalFailure: () => {
            labelCache.setCache(workspaceId, originalLabels);
            toast.error('ラベルの更新に失敗しました');
        }
    });
}

export async function deleteLabelRaw(userId: string, workspaceId: string, labelId: string) {
    const originalLabels = labelCache.getLabels(workspaceId);

    // Optimistic Update
    const newLabels = originalLabels.filter(l => l.id !== labelId);
    labelCache.setCache(workspaceId, newLabels);

    return withRetry(async () => {
        const path = paths.labels(userId, workspaceId);
        await deleteDoc(doc(db, path, labelId));
    }, {
        onFinalFailure: () => {
            labelCache.setCache(workspaceId, originalLabels);
            toast.error('ラベルの削除に失敗しました');
        }
    });
}

import { writeBatch } from "../core/firebase-sdk";

export async function reorderLabelsRaw(userId: string, workspaceId: string, orderedLabelIds: string[]) {
    const originalLabels = labelCache.getLabels(workspaceId);
    const orderMap = new Map<string, number>();
    orderedLabelIds.forEach((id, index) => orderMap.set(id, index));

    // Optimistic Update
    if (originalLabels && originalLabels.length > 0) {
        const updatedLabels = originalLabels.map(l => {
            const newIndex = orderMap.get(l.id!);
            if (newIndex !== undefined) {
                return { ...l, order: newIndex };
            }
            return l;
        });

        // Sort to reflect UI immediately
        updatedLabels.sort((a, b) => {
            const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
            const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
            return orderA - orderB;
        });

        labelCache.setCache(workspaceId, updatedLabels);
    }

    return withRetry(async () => {
        const path = paths.labels(userId, workspaceId);

        const chunks: string[][] = [];
        for (let i = 0; i < orderedLabelIds.length; i += 500) {
            chunks.push(orderedLabelIds.slice(i, i + 500));
        }

        for (const chunk of chunks) {
            const batch = writeBatch(db);
            chunk.forEach((id) => {
                const globalIndex = orderMap.get(id)!;
                const ref = doc(db, path, id);
                batch.update(ref, { order: globalIndex });
            });
            await batch.commit();
        }
    }, {
        onFinalFailure: () => {
            labelCache.setCache(workspaceId, originalLabels);
            toast.error('ラベルの並び替えに失敗しました');
        }
    });
}
