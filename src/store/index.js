// @ts-nocheck
// @miyter:20251129

import { auth } from '../core/firebase.js';
import { showMessageModal } from '../ui/components.js';

import { 
    subscribeToTasksRaw,
    addTaskRaw, 
    updateTaskStatusRaw,
    updateTaskRaw, 
    deleteTaskRaw,
    createBackupDataRaw
} from './store-raw.js';

/**
 * 認証ガード。未認証ならエラーモーダルを表示し例外をスローする。
 * @returns {string} 認証済みのユーザーID
 */
function requireAuth() {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        // ★修正: alertの代わりにshowMessageModalを使用
        showMessageModal("操作にはログインが必要です。", null); 
        // 呼び出し元で処理を中止させるためにスロー
        throw new Error('Authentication required.'); 
    }
    return userId;
}

// ==========================================================
// ★ UI層向けラッパー関数 (認証ガードと userId の自動注入)
// ==========================================================

/**
 * タスク一覧をリアルタイム購読する。
 * (これは認証前に呼ばれる可能性があるので、ラッパー内では認証チェックしない)
 */
export function subscribeToTasks(onUpdate) {
    // onAuthStateChangedでuserIdが得られた後に、App.jsから呼ばれる
    const userId = auth.currentUser?.uid;
    if (userId) {
        subscribeToTasksRaw(userId, onUpdate);
    } else {
        // ログアウト状態でも呼べるよう、onUpdateに空配列を渡すなどの処理が必要な場合はここで実装可能
        subscribeToTasksRaw(null, onUpdate); 
    }
}

/**
 * タスクを追加する。
 * @param {object} taskData - タスクデータ
 */
export async function addTask(taskData) {
    const userId = requireAuth();
    return addTaskRaw(userId, taskData);
}

/**
 * タスクのステータスを更新する。
 * @param {string} taskId - タスクID
 * @param {string} status - 新しいステータス ('todo' or 'completed')
 */
export async function updateTaskStatus(taskId, status) {
    const userId = requireAuth();
    return updateTaskStatusRaw(userId, taskId, status);
}

/**
 * タスクの情報を更新（汎用）。
 * @param {string} taskId - タスクID
 * @param {object} updates - 更新内容
 */
export async function updateTask(taskId, updates) {
    const userId = requireAuth();
    return updateTaskRaw(userId, taskId, updates);
}

/**
 * タスクを削除する。
 * @param {string} taskId - タスクID
 */
export async function deleteTask(taskId) {
    const userId = requireAuth();
    return deleteTaskRaw(userId, taskId);
}

/**
 * バックアップデータを作成する。
 * (userIdはラッパー内で取得)
 */
export async function createBackupData() {
    const userId = requireAuth();
    return createBackupDataRaw(userId);
}

// ==========================================================
// ★ 既存コードの修正対応
// ==========================================================

// addTask の引数が (title, desc, dueDate, projectId, labelId) の形式で呼び出されている箇所があるため、
// 互換性ラッパーを一時的に提供します。
// （最終的にはaddTask(taskData)の形式に統一することが望ましい）
export async function addTaskCompatibility(title, description, dueDate, projectId, labelId) {
    const userId = requireAuth();
    const taskData = {
        title,
        description,
        dueDate,
        projectId,
        labelId: labelId ? [labelId] : []
    };
    return addTaskRaw(userId, taskData);
}

// ★既存の store.js からの export をすべて削除し、index.js に移譲するため、
// 他のファイルは store.js からではなく index.js からインポートするようにパスを修正する必要があります。