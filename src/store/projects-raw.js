// @ts-nocheck
// @miyter:20251129

// 修正: SDKラッパーからインポート
import { 
    collection, addDoc, updateDoc, deleteDoc, doc, query, onSnapshot, orderBy 
} from "../core/firebase-sdk.js";

// 修正: dbの直接インポートを廃止し、getFirebaseヘルパーを使用
import { getFirebase } from '../core/firebase.js';

import { getCurrentWorkspaceId } from './workspace.js';

// ==========================================================
// ★ RAW FUNCTIONS (userId必須) - ラッパー層からのみ呼び出し
// ==========================================================

// プロジェクトリストのキャッシュ（同期的に取得するため）
let _cachedProjects = [];

/**
 * プロジェクトコレクションへのパスを取得する内部ヘルパー
 * @param {string} userId 
 * @returns {string|null} パスまたはnull（ワークスペース未選択時）
 */
function getProjectsPath(userId) {
    const appId = (typeof window !== 'undefined' && window.GLOBAL_APP_ID) 
        ? window.GLOBAL_APP_ID 
        : 'default-app-id';
        
    // ワークスペース選択状態を確認し、パスに含める
    const workspaceId = getCurrentWorkspaceId();
    if (!workspaceId) return null;

    // 修正: ワークスペースごとの階層に変更
    // /artifacts/${appId}/users/${userId}/workspaces/${workspaceId}/projects
    return `/artifacts/${appId}/users/${userId}/workspaces/${workspaceId}/projects`;
}

/**
 * プロジェクト数据的リアルタイムリスナーを開始する (RAW)。
 * @param {string} userId - ユーザーID (必須)
 * @param {function} onUpdate - データ更新時に呼び出されるコールバック関数
 * @returns {function} リスナーを解除するための関数
 */
export function subscribeToProjectsRaw(userId, onUpdate) {
    const path = getProjectsPath(userId);

    // ワークスペースが選択されていない、またはパス生成不可の場合は空で返す
    if (!path) {
        console.warn('subscribeToProjectsRaw: No workspace selected or path invalid');
        _cachedProjects = [];
        onUpdate([]);
        return () => {};
    }

    // 修正: 実行時にインスタンスを取得
    const { db } = getFirebase();

    // orderByはインデックスエラー回避のため一旦外しています。
    const q = query(collection(db, path)); 

    return onSnapshot(q, (snapshot) => {
        const projects = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        // キャッシュを更新
        _cachedProjects = projects;
        onUpdate(projects);
    });
}

/**
 * 現在キャッシュされているプロジェクトリストを取得する
 * @returns {Array} プロジェクトの配列
 */
export function getProjects() {
    return _cachedProjects;
}

/**
 * 新しいプロジェクトを追加する (RAW)。
 * @param {string} userId - ユーザーID (必須)
 * @param {string} name - プロジェクト名
 */
export async function addProjectRaw(userId, name) {
    const path = getProjectsPath(userId);
    if (!path) throw new Error('Workspace not selected');

    // 修正: 実行時にインスタンスを取得
    const { db } = getFirebase();

    await addDoc(collection(db, path), {
        name,
        ownerId: userId,
        createdAt: new Date()
    });
}

/**
 * プロジェクトを更新する (RAW)。
 * @param {string} userId - ユーザーID (必須)
 * @param {string} projectId - プロジェクトID
 * @param {object} updates - 更新内容
 */
export async function updateProjectRaw(userId, projectId, updates) {
    const path = getProjectsPath(userId);
    if (!path) throw new Error('Workspace not selected');

    // 修正: 実行時にインスタンスを取得
    const { db } = getFirebase();

    const ref = doc(db, path, projectId);
    return updateDoc(ref, updates);
}

/**
 * プロジェクトを削除する (RAW)。
 * @param {string} userId - ユーザーID (必須)
 * @param {string} projectId - プロジェクトID
 */
export async function deleteProjectRaw(userId, projectId) {
    const path = getProjectsPath(userId);
    if (!path) throw new Error('Workspace not selected');

    // 修正: 実行時にインスタンスを取得
    const { db } = getFirebase();

    await deleteDoc(doc(db, path, projectId));
}