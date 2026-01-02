/**
 * 更新日: 2026-01-02
 * 内容: ProjectCache クラスへの移行と Optimistic Update の強化
 *      - 成功時の自動更新、失敗時のロールバック、Toast通知を追加
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
import { Project } from './schema';
import { toast } from './ui/toast-store';

class ProjectCache {
    private cachedProjectsMap = new Map<string, Project[]>();
    private listeners = new Map<string, Set<(projects: Project[]) => void>>();
    private unsubscribes = new Map<string, Unsubscribe>();

    public isInitialized(workspaceId: string): boolean {
        return this.cachedProjectsMap.has(workspaceId);
    }

    private notifyListeners(workspaceId: string) {
        const projects = this.cachedProjectsMap.get(workspaceId) || [];
        const listeners = this.listeners.get(workspaceId);
        if (listeners) {
            const projectsCopy = [...projects];
            listeners.forEach(listener => listener(projectsCopy));
        }
    }

    public setCache(workspaceId: string, projects: Project[]) {
        this.cachedProjectsMap.set(workspaceId, projects);
        this.notifyListeners(workspaceId);
    }

    public getProjects(workspaceId: string): Project[] {
        return this.cachedProjectsMap.get(workspaceId) || [];
    }

    public subscribe(userId: string, workspaceId: string, onUpdate: (projects: Project[]) => void): Unsubscribe {
        if (!this.listeners.has(workspaceId)) {
            this.listeners.set(workspaceId, new Set());
        }
        const listeners = this.listeners.get(workspaceId)!;
        listeners.add(onUpdate);

        const cached = this.cachedProjectsMap.get(workspaceId);
        if (cached) {
            queueMicrotask(() => onUpdate([...cached]));
        }

        if (!this.unsubscribes.has(workspaceId)) {
            const path = paths.projects(userId, workspaceId);
            const q = query(collection(db, path));
            console.log(`[ProjectCache] Subscribing to path: ${path} for user: ${userId}`);
            const unsub = onSnapshot(q, (snapshot) => {
                const projects = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Project[];
                console.log(`[ProjectCache] Received ${projects.length} projects from Firestore for workspace: ${workspaceId}`);
                const current = this.cachedProjectsMap.get(workspaceId);

                if (current && areProjectArraysIdentical(current, projects)) {
                    console.log("[ProjectCache] Data identical, skipping update");
                    return;
                }

                console.log("[ProjectCache] Updating cache and notifying listeners");
                this.cachedProjectsMap.set(workspaceId, projects);
                this.notifyListeners(workspaceId);
            }, (error) => {
                console.error("[ProjectCache] Subscription error:", error);
                this.cachedProjectsMap.set(workspaceId, []);
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
    const newProject: Project = { id: tempId, name, color, ownerId: userId, createdAt: new Date() } as any;
    projectCache.setCache(workspaceId, [...originalProjects, newProject]);

    const path = paths.projects(userId, workspaceId);
    console.log(`[ProjectCache] Adding project to path: ${path}`);

    return withRetry(async () => {
        const docRef = await addDoc(collection(db, path), {
            name,
            color,
            ownerId: userId,
            createdAt: serverTimestamp()
        });
        console.log(`[ProjectCache] Successfully added project with ID: ${docRef.id}`);
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

export async function reorderProjectsRaw(userId: string, workspaceId: string, projects: Project[]) {
    const originalProjects = projectCache.getProjects(workspaceId);
    projectCache.setCache(workspaceId, projects);

    return withRetry(async () => {
        const batch = writeBatch(db);
        const path = paths.projects(userId, workspaceId);

        projects.forEach((p, index) => {
            if (p.id && !p.id.startsWith('temp-')) {
                const ref = doc(db, path, p.id);
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
