/**
 * User-facing messages
 */
export const MESSAGES = {
    // Tasks
    TASK_CREATE_SUCCESS: 'タスクを作成しました',
    TASK_CREATE_FAIL: 'タスクの作成に失敗しました',
    TASK_UPDATE_SUCCESS: 'タスクを更新しました',
    TASK_UPDATE_FAIL: 'タスクの保存に失敗しました',
    TASK_DELETE_SUCCESS: 'タスクを削除しました',
    TASK_DELETE_FAIL: 'タスクの削除に失敗しました',
    TASK_COMPLETE_SUCCESS: 'タスクを完了しました 🎉',
    TASK_STATUS_UPDATE_FAIL: 'ステータスの更新に失敗しました',
    TASK_MOVE_FAIL: 'タスクの移動に失敗しました',

    // Auth
    AUTH_LOGIN_SUCCESS: 'ログインしました',
    AUTH_LOGIN_FAIL: 'ログインに失敗しました',
    AUTH_LOGOUT_SUCCESS: 'ログアウトしました',

    // Projects
    PROJECT_REORDER_FAIL: 'プロジェクトの並び替えに失敗しました',
} as const;
