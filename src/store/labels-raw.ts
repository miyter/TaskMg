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
import { FirestoreCollectionCache } from './base-cache';
import { Label } from './schema';
import { withOptimisticUpdate } from './store-utils';

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

    public subscribe(userId: string, workspaceId: string, onUpdate: (labels: Label[]) => void, onError?: (error: any) => void): Unsubscribe {
        // リスナー登録とクリーンアップ関数取得
        const cleanup = this.registerListener(workspaceId, onUpdate);

        // Firestore 購読開始（まだ未開始の場合）
        if (!this.hasFirestoreSubscription(workspaceId)) {
            const path = paths.labels(userId, workspaceId);
            const q = query(collection(db, path));

            this.__subscribeToQuery(
                workspaceId,
                q,
                (d) => ({ id: d.id, ...d.data() } as Label),
                undefined,
                onError
            );
        }

        return cleanup;
    }
}

export const labelCache = new LabelCache();

export const isLabelsInitialized = (workspaceId: string) => labelCache.isInitialized(workspaceId);
export const getLabels = (workspaceId: string) => labelCache.getLabels(workspaceId);
export const updateLabelsCacheRaw = (workspaceId: string, labels: Label[]) => labelCache.setCache(workspaceId, labels);

export function subscribeToLabelsRaw(userId: string, workspaceId: string, onUpdate: (labels: Label[]) => void, onError?: (error: any) => void): Unsubscribe {
    if (!userId || !workspaceId) {
        onUpdate([]);
        return () => { };
    }
    return labelCache.subscribe(userId, workspaceId, onUpdate, onError);
}

export async function addLabelRaw(userId: string, workspaceId: string, name: string, color: string) {
    const tempId = 'temp-' + Date.now();
    const newLabel: Label = { id: tempId, name, color, ownerId: userId, createdAt: new Date() } as Label;

    return withOptimisticUpdate(
        labelCache,
        workspaceId,
        (current) => [...current, newLabel],
        async () => {
            const path = paths.labels(userId, workspaceId);
            await addDoc(collection(db, path), {
                name,
                color,
                ownerId: userId,
                workspaceId,
                createdAt: serverTimestamp()
            });
        },
        'ラベルの追加に失敗しました'
    );
}

export async function updateLabelRaw(userId: string, workspaceId: string, labelId: string, updates: Partial<Label>) {
    return withOptimisticUpdate(
        labelCache,
        workspaceId,
        (current) => current.map(l => l.id === labelId ? { ...l, ...updates } : l),
        async () => {
            const path = paths.labels(userId, workspaceId);
            const ref = doc(db, path, labelId);
            await updateDoc(ref, updates);
        },
        'ラベルの更新に失敗しました'
    );
}

export async function deleteLabelRaw(userId: string, workspaceId: string, labelId: string) {
    return withOptimisticUpdate(
        labelCache,
        workspaceId,
        (current) => current.filter(l => l.id !== labelId),
        async () => {
            const path = paths.labels(userId, workspaceId);
            await deleteDoc(doc(db, path, labelId));
        },
        'ラベルの削除に失敗しました'
    );
}

export async function reorderLabelsRaw(userId: string, workspaceId: string, orderedLabelIds: string[]) {
    return withOptimisticUpdate(
        labelCache,
        workspaceId,
        (current) => {
            const orderMap = new Map(orderedLabelIds.map((id, index) => [id, index]));
            const updatedLabels = current.map(l => {
                const newIndex = orderMap.get(l.id!);
                return newIndex !== undefined ? { ...l, order: newIndex } : l;
            });
            // Sort to reflect UI immediately
            return updatedLabels.sort((a, b) => {
                const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
                const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
                return orderA - orderB;
            });
        },
        async () => {
            const path = paths.labels(userId, workspaceId);
            const chunks: string[][] = [];
            for (let i = 0; i < orderedLabelIds.length; i += 500) {
                chunks.push(orderedLabelIds.slice(i, i + 500));
            }

            for (const chunk of chunks) {
                const batch = writeBatch(db);
                chunk.forEach((id) => {
                    const globalIndex = orderedLabelIds.indexOf(id); // Re-calculate or pass map if needed, but indexOf is fine for batch construction
                    const ref = doc(db, path, id);
                    batch.update(ref, { order: globalIndex });
                });
                await batch.commit();
            }
        },
        'ラベルの並び替えに失敗しました'
    );
}
