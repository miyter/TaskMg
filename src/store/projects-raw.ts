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
    updateDoc
} from "../core/firebase-sdk";

import { db } from '../core/firebase';
import { paths } from '../utils/paths';
import { Project } from './schema';

// ==========================================================
// ★ RAW FUNCTIONS (userId, workspaceId 必須)
// ==========================================================

// プロジェクトリストのキャッシュ
// 最後に購読されたワークスペースのデータを保持する。
// 購読切り替え時に不整合を防ぐため、subscribe時にリセットされる。
let _cachedProjects: Project[] = [];

/**
 * プロジェクトデータのリアルタイムリスナーを開始する (RAW)
 */
export function subscribeToProjectsRaw(userId: string, workspaceId: string, onUpdate: (projects: Project[]) => void): Unsubscribe {
    // 購読開始時にキャッシュを一旦クリア（古いワークスペースのデータ混入防止）
    _cachedProjects = [];

    const path = paths.projects(userId, workspaceId);

    // 並び順を保証
    const q = query(collection(db, path), orderBy('createdAt', 'asc'));

    return onSnapshot(q, (snapshot) => {
        const projects = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Project[];
        // キャッシュを更新
        _cachedProjects = projects;
        onUpdate(projects);
    }, (error) => {
        console.error("Error subscribing to projects:", error);
        _cachedProjects = [];
        onUpdate([]);
    });
}

/**
 * 現在キャッシュされているプロジェクトリストを取得する
 * TaskInput等の同期的なUI描画用。
 */
export function getProjects(): Project[] {
    return _cachedProjects;
}

/**
 * 新しいプロジェクトを追加する (RAW)
 */
export async function addProjectRaw(userId: string, workspaceId: string, name: string) {
    const path = paths.projects(userId, workspaceId);

    await addDoc(collection(db, path), {
        name,
        ownerId: userId,
        createdAt: serverTimestamp()
    });
}

/**
 * プロジェクトを更新する (RAW)
 */
export async function updateProjectRaw(userId: string, workspaceId: string, projectId: string, updates: Partial<Project>) {
    const path = paths.projects(userId, workspaceId);
    const ref = doc(db, path, projectId);
    return updateDoc(ref, updates);
}

/**
 * プロジェクトを削除する (RAW)
 */
export async function deleteProjectRaw(userId: string, workspaceId: string, projectId: string) {
    const path = paths.projects(userId, workspaceId);
    await deleteDoc(doc(db, path, projectId));
}
