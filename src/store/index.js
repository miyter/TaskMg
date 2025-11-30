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

// ★修正: addTaskCompatibility の引数を taskData オブジェクトとして受け取る形式に変更
// task-input.js からの呼び出しに合わせるため
/**
 * UI層からの taskData オブジェクトを受け取る互換性ラッパー。
 * 最終的には addTask(taskData) に統一することが望ましい。
 * @param {object} taskData - タスクデータオブジェクト (title, description, projectId, labelIdsなどを含む)
 */
export async function addTaskCompatibility(taskData) {
    const userId = requireAuth();
    
    // taskDataをそのまま addTaskRaw に渡す
    // task-input.jsで生成されたデータは title, description, projectId, labelIds を持つ
    
    // NOTE: descriptionがundefinedの場合は空文字列に変換するガードを追加しても良いが、
    // task-input.jsで既に.trim()されているため、ここではそのまま渡す
    
    // ★重要: descriptionがundefinedでないことを保証するため、明示的にtaskDataに存在するプロパティだけを使用する
    // これは、UI層からのtaskDataの構造に依存する一時的な対応です。
    const finalTaskData = {
        title: taskData.title,
        description: taskData.description || '', // 空文字列かundefinedの場合に備え、空文字列をデフォルト値とする
        dueDate: taskData.dueDate || null,
        projectId: taskData.projectId || null,
        // labelIdsが配列であることを保証
        labelIds: Array.isArray(taskData.labelIds) ? taskData.labelIds : [], 
    };

    return addTaskRaw(userId, finalTaskData);
}

// ★既存の store.js からの export をすべて削除し、index.js に移譲するため、
// 他のファイルは store.js からではなく index.js からインポートするようにパスを修正する必要があります。