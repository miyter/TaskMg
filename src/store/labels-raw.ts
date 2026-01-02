/**
 * 更新日: 2025-12-21
 * 内容: serverTimestamp導入、paths利用によるパス統一、エラーハンドリング追加
 * TypeScript化: 2025-12-29
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
import { Label } from './schema';

// ==========================================================
// ★ RAW FUNCTIONS (userId必須)
// ==========================================================

// Map<workspaceId, Label[]> to prevent data mixing between workspaces
const _cachedLabelsMap = new Map<string, Label[]>();

export function getLabels(workspaceId?: string): Label[] {
    if (!workspaceId) return [];
    return _cachedLabelsMap.get(workspaceId) || [];
}

export function isLabelsInitialized(workspaceId: string): boolean {
    return _cachedLabelsMap.has(workspaceId);
}

/**
 * ラベルデータのリアルタイムリスナーを開始する (RAW)
 */
export function subscribeToLabelsRaw(userId: string, workspaceId: string, onUpdate: (labels: Label[]) => void): Unsubscribe {
    if (!userId || !workspaceId) {
        onUpdate([]);
        return () => { };
    }

    const path = paths.labels(userId, workspaceId);
    // db is directly imported from firebase.ts
    const q = query(collection(db, path));

    return onSnapshot(q, (snapshot) => {
        const labels = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Label[];
        _cachedLabelsMap.set(workspaceId, labels);
        onUpdate(labels);
    }, (error) => {
        console.error("[Labels] Subscription error:", error);
        _cachedLabelsMap.set(workspaceId, []);
        onUpdate([]);
    });
}

/**
 * 新しいラベルを追加する (RAW)
 */
export async function addLabelRaw(userId: string, workspaceId: string, name: string, color: string) {
    const path = paths.labels(userId, workspaceId);
    // db is directly imported from firebase.ts

    await addDoc(collection(db, path), {
        name,
        color,
        ownerId: userId,
        workspaceId,
        createdAt: serverTimestamp() // 修正: サーバー時刻を使用
    });
}

/**
 * ラベルを更新する (RAW)
 */
export async function updateLabelRaw(userId: string, workspaceId: string, labelId: string, updates: Partial<Label>) {
    const path = paths.labels(userId, workspaceId);
    // db is directly imported from firebase.ts
    const ref = doc(db, path, labelId);
    return updateDoc(ref, updates);
}

/**
 * ラベルを削除する (RAW)
 */
export async function deleteLabelRaw(userId: string, workspaceId: string, labelId: string) {
    const path = paths.labels(userId, workspaceId);
    // db is directly imported from firebase.ts
    await deleteDoc(doc(db, path, labelId));
}
