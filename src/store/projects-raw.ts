/**
 * 更新日: 2025-12-30
 * 内容: firebase.tsの自動初期化対応によるリファクタリング
 */

import {
    addDoc,
    collection,
    deleteDoc, doc,
    onSnapshot, orderBy,
    query,
    serverTimestamp, Unsubscribe,
    updateDoc,
    writeBatch
} from "../core/firebase-sdk";

import { db } from '../core/firebase';
import { areProjectArraysIdentical } from '../utils/compare';
import { paths } from '../utils/paths';
import { withRetry } from '../utils/retry';
import { Project } from './schema';

// ==========================================================
// ★ RAW FUNCTIONS (userId, workspaceId 必須)
// ==========================================================

// プロジェクトリストのキャッシュ（複数ワークスペース対応）
const _cachedProjectsMap = new Map<string, Project[]>();
const _projectListeners = new Map<string, Set<(projects: Project[]) => void>>();
const _projectUnsubscribes = new Map<string, Unsubscribe>();

/**
 * キャッシュが初期化されているか確認する
 */
export function isProjectsInitialized(workspaceId: string): boolean {
    return _cachedProjectsMap.has(workspaceId);
}

/**
 * リスナーへの通知ヘルパー
 */
function notifyProjectListeners(workspaceId: string) {
    const projects = _cachedProjectsMap.get(workspaceId) || [];
    const listeners = _projectListeners.get(workspaceId);
    if (listeners) {
        const projectsCopy = [...projects];
        listeners.forEach(listener => listener(projectsCopy));
    }
}

/**
 * キャッシュを手動更新する (Optimistic Update用)
 */
export function updateProjectsCacheRaw(workspaceId: string, projects: Project[]) {
    _cachedProjectsMap.set(workspaceId, projects);
    notifyProjectListeners(workspaceId);
}

/**
 * プロジェクトデータのリアルタイムリスナーを開始する (RAW)
 */
export function subscribeToProjectsRaw(userId: string, workspaceId: string, onUpdate: (projects: Project[]) => void): Unsubscribe {
    // リスナー登録
    if (!_projectListeners.has(workspaceId)) {
        _projectListeners.set(workspaceId, new Set());
    }
    const listeners = _projectListeners.get(workspaceId)!;
    listeners.add(onUpdate);

    // 即時キャッシュ返却 (React strict mode対応: 非同期で実行)
    const cached = _cachedProjectsMap.get(workspaceId);
    if (cached) {
        queueMicrotask(() => onUpdate([...cached]));
    }

    // サブスクリプション未確立なら開始
    if (!_projectUnsubscribes.has(workspaceId)) {
        const path = paths.projects(userId, workspaceId);
        // 並び順を保証
        const q = query(collection(db, path), orderBy('createdAt', 'asc'));

        const unsub = onSnapshot(q, (snapshot) => {
            const projects = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Project[];
            const currentCached = _cachedProjectsMap.get(workspaceId);

            // Custom optimization for reference stability
            if (currentCached && areProjectArraysIdentical(currentCached, projects)) {
                return;
            }

            // キャッシュを更新
            _cachedProjectsMap.set(workspaceId, projects);
            notifyProjectListeners(workspaceId);
        }, (error) => {
            console.error("Error subscribing to projects:", error);
            _cachedProjectsMap.set(workspaceId, []);
            notifyProjectListeners(workspaceId);
        });

        _projectUnsubscribes.set(workspaceId, unsub);
    }

    // Unsubscribe関数
    return () => {
        listeners.delete(onUpdate);
        if (listeners.size === 0) {
            const unsub = _projectUnsubscribes.get(workspaceId);
            if (unsub) {
                unsub();
                _projectUnsubscribes.delete(workspaceId);
            }
            _projectListeners.delete(workspaceId);
            // _cachedProjectsMap.delete(workspaceId); // キャッシュは残す（再接続時の高速化）
        }
    };
}

/**
 * 指定したワークスペースの現在キャッシュされているプロジェクトリストを取得する
 * @param workspaceId ワークスペースID
 */
export function getProjects(workspaceId: string): Project[] {
    return _cachedProjectsMap.get(workspaceId) || [];
}

/**
 * 新しいプロジェクトを追加する (RAW)
 */
export async function addProjectRaw(userId: string, workspaceId: string, name: string, color?: string) {
    return withRetry(async () => {
        const path = paths.projects(userId, workspaceId);

        await addDoc(collection(db, path), {
            name,
            color,
            ownerId: userId,
            createdAt: serverTimestamp()
        });
    });
}

/**
 * プロジェクトを更新する (RAW)
 */
export async function updateProjectRaw(userId: string, workspaceId: string, projectId: string, updates: Partial<Project>) {
    return withRetry(async () => {
        const path = paths.projects(userId, workspaceId);
        const ref = doc(db, path, projectId);
        await updateDoc(ref, updates);
    });
}

/**
 * プロジェクトを削除する (RAW)
 */
export async function deleteProjectRaw(userId: string, workspaceId: string, projectId: string) {
    return withRetry(async () => {
        const path = paths.projects(userId, workspaceId);
        await deleteDoc(doc(db, path, projectId));
    });
}

/**
 * プロジェクトの並び順を一括更新する (Batch)
 */
export async function reorderProjectsRaw(userId: string, workspaceId: string, projects: Project[]) {
    return withRetry(async () => {
        const batch = writeBatch(db);
        const path = paths.projects(userId, workspaceId);

        projects.forEach((p, index) => {
            if (p.id) {
                const ref = doc(db, path, p.id);
                batch.update(ref, { order: index });
            }
        });

        await batch.commit();
    });
}
