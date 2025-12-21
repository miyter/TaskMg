// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: パス生成の統一、serverTimestamp導入、キャッシュ管理の改善、orderBy有効化
 */

import { 
    collection, addDoc, updateDoc, deleteDoc, doc, query, onSnapshot, orderBy, serverTimestamp 
} from "../core/firebase-sdk.js";

import { getFirebase } from '../core/firebase.js';
import { paths } from '../utils/paths.js';

// ==========================================================
// ★ RAW FUNCTIONS (userId, workspaceId 必須)
// ==========================================================

// プロジェクトリストのキャッシュ
// 注意: このキャッシュは同期的な getProjects() のためだけに使用され、
// 最後に購読されたワークスペースのデータを保持します。
let _cachedProjects = [];

/**
 * プロジェクトデータのリアルタイムリスナーを開始する (RAW)
 * @param {string} userId - ユーザーID (必須)
 * @param {string} workspaceId - ワークスペースID (必須)
 * @param {function} onUpdate - データ更新時に呼び出されるコールバック関数
 * @returns {function} リスナーを解除するための関数
 */
export function subscribeToProjectsRaw(userId, workspaceId, onUpdate) {
    // パスを paths ユーティリティから生成
    const path = paths.projects(userId, workspaceId);

    const { db } = getFirebase();

    // 並び順を保証（インデックス未作成時はコンソールにリンクが表示されるので作成すること）
    const q = query(collection(db, path), orderBy('createdAt', 'asc')); 

    return onSnapshot(q, (snapshot) => {
        const projects = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        // キャッシュを更新
        _cachedProjects = projects;
        onUpdate(projects);
    }, (error) => {
        console.error("Error subscribing to projects:", error);
        // エラー時はキャッシュもクリアして空を返す
        _cachedProjects = [];
        onUpdate([]);
    });
}

/**
 * 現在キャッシュされているプロジェクトリストを取得する
 * 注意: 購読中の最新データが返るが、ワークスペース切り替え直後などは古い可能性があるため、
 * 基本的にはリアクティブなデータソース（onUpdate経由）を使用すること。
 */
export function getProjects() {
    return _cachedProjects;
}

/**
 * 新しいプロジェクトを追加する (RAW)
 */
export async function addProjectRaw(userId, workspaceId, name) {
    const path = paths.projects(userId, workspaceId);
    const { db } = getFirebase();

    await addDoc(collection(db, path), {
        name,
        ownerId: userId,
        // クライアント時刻ではなくサーバー時刻を使用
        createdAt: serverTimestamp()
    });
}

/**
 * プロジェクトを更新する (RAW)
 */
export async function updateProjectRaw(userId, workspaceId, projectId, updates) {
    const path = paths.projects(userId, workspaceId);
    const { db } = getFirebase();
    const ref = doc(db, path, projectId);
    return updateDoc(ref, updates);
}

/**
 * プロジェクトを削除する (RAW)
 */
export async function deleteProjectRaw(userId, workspaceId, projectId) {
    const path = paths.projects(userId, workspaceId);
    const { db } = getFirebase();
    await deleteDoc(doc(db, path, projectId));
}