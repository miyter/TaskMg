/**
 * 更新日: 2026-01-03
 * 内容: FirestoreCollectionCache ベースクラスへの移行
 *      - 共通キャッシュロジックを base-cache.ts に集約
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
import { FirestoreCollectionCache } from './base-cache';
import { Target } from './schema';
import { toast } from './ui/toast-store';

/**
 * TargetCache - FirestoreCollectionCache を継承
 */
class TargetCache extends FirestoreCollectionCache<Target> {
    constructor() {
        super({ logPrefix: '[TargetCache]' });
    }

    // 後方互換性のためのエイリアス
    public getTargets(workspaceId: string): Target[] {
        return this.getItems(workspaceId);
    }

    public subscribe(userId: string, workspaceId: string, onUpdate: (targets: Target[]) => void): Unsubscribe {
        // リスナー登録とクリーンアップ関数取得
        const cleanup = this.registerListener(workspaceId, onUpdate);

        // Firestore 購読開始（まだ未開始の場合）
        if (!this.hasFirestoreSubscription(workspaceId)) {
            const path = paths.targets(userId, workspaceId);
            // 作成日順（新しいものが上）
            const q = query(collection(db, path), orderBy('createdAt', 'desc'));


            const unsub = onSnapshot(q, (snapshot) => {
                const targets = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Target[];
                const currentCached = this.getItems(workspaceId);

                // 変更がない場合は更新スキップ
                if (currentCached.length > 0 && areArraysEqual(currentCached, targets)) {
                    return;
                }


                this.setCache(workspaceId, targets);
            }, (error) => {
                console.error(`${this.config.logPrefix} Subscription error:`, error);
                this.setCache(workspaceId, []);
            });

            this.setFirestoreSubscription(workspaceId, unsub);
        }

        return cleanup;
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
