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

let _cachedLabels: Label[] = [];

export function getLabels(): Label[] {
    return _cachedLabels;
}

/**
 * ラベルデータのリアルタイムリスナーを開始する (RAW)
 */
export function subscribeToLabelsRaw(userId: string, onUpdate: (labels: Label[]) => void): Unsubscribe {
    if (!userId) {
        onUpdate([]);
        return () => { };
    }

    const path = paths.labels(userId);
    // db is directly imported from firebase.ts
    const q = query(collection(db, path));

    return onSnapshot(q, (snapshot) => {
        const labels = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Label[];
        _cachedLabels = labels;
        onUpdate(labels);
    }, (error) => {
        console.error("[Labels] Subscription error:", error);
        _cachedLabels = [];
        onUpdate([]);
    });
}

/**
 * 新しいラベルを追加する (RAW)
 */
export async function addLabelRaw(userId: string, name: string, color: string) {
    const path = paths.labels(userId);
    // db is directly imported from firebase.ts

    await addDoc(collection(db, path), {
        name,
        color,
        ownerId: userId,
        createdAt: serverTimestamp() // 修正: サーバー時刻を使用
    });
}

/**
 * ラベルを更新する (RAW)
 */
export async function updateLabelRaw(userId: string, labelId: string, updates: Partial<Label>) {
    const path = paths.labels(userId);
    // db is directly imported from firebase.ts
    const ref = doc(db, path, labelId);
    return updateDoc(ref, updates);
}

/**
 * ラベルを削除する (RAW)
 */
export async function deleteLabelRaw(userId: string, labelId: string) {
    const path = paths.labels(userId);
    // db is directly imported from firebase.ts
    await deleteDoc(doc(db, path, labelId));
}
