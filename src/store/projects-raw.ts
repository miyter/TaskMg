/**
 * 更新日: 2026-01-03
 * 内容: FirestoreCollectionCache ベースクラスへの移行
 *      - 共通キャッシュロジックを base-cache.ts に集約
 */

import {
    addDoc,
    collection,
    deleteDoc, doc,
    onSnapshot,
    query,
    serverTimestamp, Unsubscribe,
    updateDoc,
    writeBatch
} from "../core/firebase-sdk";

import { db } from '../core/firebase';
import { areProjectArraysIdentical } from '../utils/compare';
import { paths } from '../utils/paths';
import { withRetry } from '../utils/retry';
import { FirestoreCollectionCache } from './base-cache';
import { Project } from './schema';
import { toast } from './ui/toast-store';

/**
 * ProjectCache - FirestoreCollectionCache を継承
 */
class ProjectCache extends FirestoreCollectionCache<Project> {
    constructor() {
        super({ logPrefix: '[ProjectCache]' });
    }

    // 後方互換性のためのエイリアス
    public getProjects(workspaceId: string): Project[] {
        return this.getItems(workspaceId);
    }

    public subscribe(userId: string, workspaceId: string, onUpdate: (projects: Project[]) => void): Unsubscribe {
        // リスナー登録とクリーンアップ関数取得
        const cleanup = this.registerListener(workspaceId, onUpdate);

        // Firestore 購読開始（まだ未開始の場合）
        if (!this.hasFirestoreSubscription(workspaceId)) {
            const path = paths.projects(userId, workspaceId);
            const q = query(collection(db, path));


            const unsub = onSnapshot(q, (snapshot) => {
                const projects = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Project[];

                const current = this.getItems(workspaceId);

                if (current.length > 0 && areProjectArraysIdentical(current, projects)) {

                    return;
                }


                this.setCache(workspaceId, projects);
            }, (error) => {
                console.error(`${this.config.logPrefix} Subscription error:`, error);
                this.setCache(workspaceId, []);
            });

            this.setFirestoreSubscription(workspaceId, unsub);
        }

        return cleanup;
    }
}

export const projectCache = new ProjectCache();

export const isProjectsInitialized = (workspaceId: string) => projectCache.isInitialized(workspaceId);
export const getProjects = (workspaceId: string) => projectCache.getProjects(workspaceId);
export const updateProjectsCacheRaw = (workspaceId: string, projects: Project[]) => projectCache.setCache(workspaceId, projects);

export function subscribeToProjectsRaw(userId: string, workspaceId: string, onUpdate: (projects: Project[]) => void): Unsubscribe {
    return projectCache.subscribe(userId, workspaceId, onUpdate);
}

export async function addProjectRaw(userId: string, workspaceId: string, name: string, color?: string) {
    const originalProjects = projectCache.getProjects(workspaceId);

    // Optimistic Update
    const tempId = 'temp-' + Date.now();
    const newProject: Project = { id: tempId, name, color, ownerId: userId, createdAt: new Date() } as Project;
    projectCache.setCache(workspaceId, [...originalProjects, newProject]);

    const path = paths.projects(userId, workspaceId);


    return withRetry(async () => {
        const docRef = await addDoc(collection(db, path), {
            name,
            color,
            ownerId: userId,
            createdAt: serverTimestamp()
        });

    }, {
        onFinalFailure: () => {
            console.error(`[ProjectCache] Failed to add project: ${name}`);
            projectCache.setCache(workspaceId, originalProjects);
            toast.error('プロジェクトの追加に失敗しました');
        }
    });
}

export async function updateProjectRaw(userId: string, workspaceId: string, projectId: string, updates: Partial<Project>) {
    const originalProjects = projectCache.getProjects(workspaceId);

    // Optimistic Update
    const newProjects = originalProjects.map(p => p.id === projectId ? { ...p, ...updates } : p);
    projectCache.setCache(workspaceId, newProjects);

    return withRetry(async () => {
        const path = paths.projects(userId, workspaceId);
        const ref = doc(db, path, projectId);
        await updateDoc(ref, updates);
    }, {
        onFinalFailure: () => {
            projectCache.setCache(workspaceId, originalProjects);
            toast.error('プロジェクトの更新に失敗しました');
        }
    });
}

export async function deleteProjectRaw(userId: string, workspaceId: string, projectId: string) {
    const originalProjects = projectCache.getProjects(workspaceId);

    // Optimistic Update
    const newProjects = originalProjects.filter(p => p.id !== projectId);
    projectCache.setCache(workspaceId, newProjects);

    return withRetry(async () => {
        const path = paths.projects(userId, workspaceId);
        await deleteDoc(doc(db, path, projectId));
    }, {
        onFinalFailure: () => {
            projectCache.setCache(workspaceId, originalProjects);
            toast.error('プロジェクトの削除に失敗しました');
        }
    });
}

export async function reorderProjectsRaw(userId: string, workspaceId: string, orderedProjectIds: string[]) {
    const originalProjects = projectCache.getProjects(workspaceId);

    // Optimistic Update: order フィールドを更新してソート
    const orderMap = new Map<string, number>();
    orderedProjectIds.forEach((id, index) => orderMap.set(id, index));

    const updatedProjects = originalProjects.map(p => {
        const newOrder = orderMap.get(p.id!);
        if (newOrder !== undefined) {
            return { ...p, order: newOrder };
        }
        return p;
    });
    updatedProjects.sort((a, b) => {
        const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
        const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
    });
    projectCache.setCache(workspaceId, updatedProjects);

    return withRetry(async () => {
        const batch = writeBatch(db);
        const path = paths.projects(userId, workspaceId);

        orderedProjectIds.forEach((id, index) => {
            if (id && !id.startsWith('temp-')) {
                const ref = doc(db, path, id);
                batch.update(ref, { order: index });
            }
        });

        await batch.commit();
    }, {
        onFinalFailure: () => {
            projectCache.setCache(workspaceId, originalProjects);
            toast.error('並び替えの保存に失敗しました');
        }
    });
}
