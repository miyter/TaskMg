
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

// ==========================================================
// ★ RAW FUNCTIONS (userId, workspaceId 必須)
// ==========================================================

const _cachedTargetsMap = new Map<string, Target[]>();

/**
 * ターゲット（目標）データのリアルタイムリスナーを開始する (RAW)
 */
export function subscribeToTargetsRaw(userId: string, workspaceId: string, onUpdate: (targets: Target[]) => void, onError?: (error: any) => void): Unsubscribe {
    const path = paths.targets(userId, workspaceId);

    // 作成日順（新しいものが上）
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));

    let isFirst = true;

    return onSnapshot(q, (snapshot) => {
        const targets = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Target[];
        const currentCached = _cachedTargetsMap.get(workspaceId);

        // 変更がない場合は更新スキップ
        if (currentCached && areArraysEqual(currentCached, targets)) {
            if (isFirst) {
                onUpdate(currentCached);
            }
            isFirst = false;
            return;
        }

        _cachedTargetsMap.set(workspaceId, targets);
        isFirst = false;
        onUpdate(targets);
    }, (error) => {
        console.error("Error subscribing to targets:", error);
        _cachedTargetsMap.set(workspaceId, []);
        onUpdate([]); // Still clear UI
        if (onError) onError(error);
    });
}

/**
 * 指定したワークスペースの現在キャッシュされているターゲットリストを取得する
 */
export function getTargets(workspaceId: string): Target[] {
    return _cachedTargetsMap.get(workspaceId) || [];
}

/**
 * 新しいターゲットを追加する (RAW)
 */
export async function addTargetRaw(userId: string, workspaceId: string, targetData: Partial<Target>) {
    return withRetry(async () => {
        const path = paths.targets(userId, workspaceId);

        // メタデータ付与
        const payload = {
            ...targetData,
            ownerId: userId,
            workspaceId: workspaceId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
        // idはFirestoreが生成するので除外
        delete payload.id;

        await addDoc(collection(db, path), payload);
    });
}

/**
 * ターゲットを更新する (RAW)
 */
export async function updateTargetRaw(userId: string, workspaceId: string, targetId: string, updates: Partial<Target>) {
    return withRetry(async () => {
        const path = paths.targets(userId, workspaceId);
        const ref = doc(db, path, targetId);

        await updateDoc(ref, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    });
}

/**
 * ターゲットを削除する (RAW)
 */
export async function deleteTargetRaw(userId: string, workspaceId: string, targetId: string) {
    return withRetry(async () => {
        const path = paths.targets(userId, workspaceId);
        await deleteDoc(doc(db, path, targetId));
    });
}
