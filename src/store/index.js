// @ts-nocheck
// @miyter:20251129

import { auth } from '../core/firebase.js';
import { showMessageModal } from '../ui/components.js';
import { getNextRecurrenceDate } from '../utils/date.js'; // ★追加: 繰り返し日付計算用のヘルパー

import { 
    subscribeToTasksRaw,
    addTaskRaw, 
    updateTaskStatusRaw,
    updateTaskRaw, 
    deleteTaskRaw,
    createBackupDataRaw,
    getTaskByIdRaw // ★追加: タスク情報を取得するため
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
// ★ 繰り返しタスクの処理ロジック (暫定フロントエンド実装)
// ==========================================================

/**
 * 完了したタスクに繰り返し設定がある場合、次期タスクを生成する
 * @param {object} completedTask - 完了したタスクオブジェクト
 */
async function handleRecurringTask(completedTask) {
    if (completedTask.status !== 'completed' || !completedTask.recurrence) {
        return;
    }

    const { recurrence, dueDate } = completedTask;

    // dueDateがない、またはrecurrenceの型がおかしい場合はスキップ
    if (!dueDate || typeof recurrence !== 'object' || !recurrence.type) {
        return;
    }

    // 次の期限日を計算 (utils/date.jsに依存)
    const nextDueDate = getNextRecurrenceDate(dueDate, recurrence);

    if (nextDueDate) {
        // 新しいタスクデータを作成
        const newTaskData = {
            title: completedTask.title,
            description: completedTask.description || '',
            status: 'todo', // 次期タスクは未完了
            dueDate: nextDueDate, // 新しい期限日
            projectId: completedTask.projectId,
            labelIds: completedTask.labelIds,
            recurrence: completedTask.recurrence, // 繰り返し設定は引き継ぐ
        };

        try {
            // 新しいタスクとしてFirestoreに追加
            await addTask(newTaskData);
            console.log(`Generated next recurring task for: ${completedTask.title}, next due: ${nextDueDate}`);
        } catch (e) {
            console.error('Failed to generate next recurring task:', e);
            // ユーザーへの通知は省略
        }
    }
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
    
    // 1. ステータスを更新する
    const result = await updateTaskStatusRaw(userId, taskId, status);
    
    // 2. 完了ステータスに変更した場合、繰り返しタスクをチェック
    if (status === 'completed') {
        // 完了したタスクのデータを取得
        const task = await getTaskByIdRaw(userId, taskId);
        if (task) {
            // ★追加: 繰り返しタスクの処理を実行
            // この処理は非同期で実行するが、UIのブロックは避けるためawaitしない
            handleRecurringTask(task).catch(e => console.error('Recurring task handler failed:', e));
        }
    }
    
    return result;
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
 * @param {object} data - タスクデータオブジェクト (title, description, projectId, labelIdsなどを含む)
 */
export async function addTaskCompatibility(data) {
    const userId = requireAuth();
    
    // descriptionがundefinedでないこと、labelIdsが配列であることを保証
    const finalTaskData = {
        title: data.title,
        description: data.description || '', // undefinedの場合に空文字列にフォールバック
        dueDate: data.dueDate || null,
        projectId: data.projectId || null,
        // labelIdsが配列であることを保証
        labelIds: Array.isArray(data.labelIds) ? data.labelIds : [], 
        recurrence: data.recurrence || null, // ★追加: recurrenceもここで拾っておく
    };

    return addTaskRaw(userId, finalTaskData);
}

// ★既存の store.js からの export をすべて削除し、index.js に移譲するため、
// 他のファイルは store.js からではなく index.js からインポートするようにパスを修正する必要があります。