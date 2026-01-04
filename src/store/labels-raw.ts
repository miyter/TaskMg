/**
 * 更新日: 2026-01-03
 * 内容: FirestoreCollectionCache ベースクラスへの移行
 *      - 共通キャッシュロジックを base-cache.ts に集約
 */

import {
    addDoc,
    collection,
    deleteDoc, doc,
    query,
    serverTimestamp, Unsubscribe,
    updateDoc,
    writeBatch
} from "../core/firebase-sdk";

import { db } from '../core/firebase';
import { paths } from '../utils/paths';
import { withRetry } from '../utils/retry';
import { FirestoreCollectionCache } from './base-cache';
import { Label } from './schema';
import { toast } from './ui/toast-store';

/**
 * LabelCache - FirestoreCollectionCache を継承
 */
class LabelCache extends FirestoreCollectionCache<Label> {
    constructor() {
        super({ logPrefix: '[LabelCache]' });
    }

    // 後方互換性のためのエイリアス
    public getLabels(workspaceId: string): Label[] {
        return this.getItems(workspaceId);
    }

    public subscribe(userId: string, workspaceId: string, onUpdate: (labels: Label[]) => void): Unsubscribe {
        // リスナー登録とクリーンアップ関数取得
        const cleanup = this.registerListener(workspaceId, onUpdate);

        // Firestore 購読開始（まだ未開始の場合）
        if (!this.hasFirestoreSubscription(workspaceId)) {
            const path = paths.labels(userId, workspaceId);
            const q = query(collection(db, path));

            this.__subscribeToQuery(
                workspaceId,
                q,
                (d) => ({ id: d.id, ...d.data() } as Label)
            );
        }

        return cleanup;
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
