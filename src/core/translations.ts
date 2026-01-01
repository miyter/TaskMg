/**
 * 翻訳リソースマップ
 * UIの文言を一元管理する (Nested Structure)
 */

import { useMemo } from 'react';
import { useSettingsStore } from '../store/ui/settings-store';

const ja = {
    dashboard: 'ダッシュボード',
    inbox: 'インボックス',
    today: '今日',
    upcoming: '今後の予定',
    completed: '完了済み',
    trash: 'ゴミ箱',
    projects: 'プロジェクト',
    project: 'プロジェクト',
    labels: 'ラベル',
    filters: 'カスタムフィルタ',
    timeblocks: 'タイムブロック',
    durations: '所要時間',
    targets: '目標',
    workspaces: 'ワークスペース',

    settings: '設定',
    edit: '編集',
    active: '選択中',
    add_task: 'タスクを追加',
    search: '検索',
    no_tasks: 'タスクがありません',
    loading: '読み込み中...',
    error: 'エラーが発生しました',
    backup_restore: 'バックアップと復元',
    general: '一般',
    appearance: '外観',
    account: 'アカウント',
    language: '言語',
    important: '重要',

    all_tasks: 'すべて',
    add: '追加',
    backward_map: 'バックワード',
    woop_board: 'WOOP',
    okr_tree: 'OKR',

    msg: {
        task: {
            create_success: 'タスクを作成しました',
            create_fail: 'タスクの作成に失敗しました',
            update_success: 'タスクを更新しました',
            update_fail: 'タスクの保存に失敗しました',
            delete_success: 'タスクを削除しました',
            delete_fail: 'タスクの削除に失敗しました',
            complete_success: 'タスクを完了しました 🎉',
            status_update_fail: 'ステータスの更新に失敗しました',
            move_fail: 'タスクの移動に失敗しました',
        },
        auth: {
            login_success: 'ログインしました',
            login_fail: 'ログインに失敗しました',
            logout_success: 'ログアウトしました',
        },
        project: {
            reorder_fail: 'プロジェクトの並び替えに失敗しました',
        }
    },

    sidebar: {
        add_workspace: 'ワークスペースを追加',
        search_placeholder: '検索 (/)',
        target_wizard: '目標設計ウィザード',
        target_dashboard: '目標ダッシュボード',
        framework_wiki: 'フレームワークWiki',
        unassigned: '未定',
    }
};

const en = {
    dashboard: 'Dashboard',
    inbox: 'Inbox',
    today: 'Today',
    upcoming: 'Upcoming',
    completed: 'Completed',
    trash: 'Trash',
    projects: 'Projects',
    project: 'Project',
    labels: 'Labels',
    filters: 'Filters',
    timeblocks: 'Time Blocks',
    durations: 'Durations',
    targets: 'Targets',
    workspaces: 'Workspaces',
    settings: 'Settings',
    edit: 'Edit',
    active: 'Active',
    add_task: 'Add Task',
    search: 'Search',
    no_tasks: 'No tasks found',
    loading: 'Loading...',
    error: 'An error occurred',
    backup_restore: 'Backup & Restore',
    general: 'General',
    appearance: 'Appearance',
    account: 'Account',
    language: 'Language',
    important: 'Important',
    all_tasks: 'All Tasks',
    add: 'Add',
    backward_map: 'Backward Map',
    woop_board: 'WOOP Board',
    okr_tree: 'OKR Tree',

    msg: {
        task: {
            create_success: 'Task created',
            create_fail: 'Failed to create task',
            update_success: 'Task updated',
            update_fail: 'Failed to save task',
            delete_success: 'Task deleted',
            delete_fail: 'Failed to delete task',
            complete_success: 'Task completed 🎉',
            status_update_fail: 'Failed to update status',
            move_fail: 'Failed to move task',
        },
        auth: {
            login_success: 'Logged in',
            login_fail: 'Login failed',
            logout_success: 'Logged out',
        },
        project: {
            reorder_fail: 'Failed to reorder projects',
        }
    },

    sidebar: {
        add_workspace: 'Add Workspace',
        search_placeholder: 'Search (/)',
        target_wizard: 'Target Wizard',
        target_dashboard: 'Target Dashboard',
        framework_wiki: 'Framework Wiki',
        unassigned: 'Unassigned',
    }
};

export const translations = { ja, en };

// Helper to generate dot notation types
type NestedKeyOf<ObjectType extends object> = {
    [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)];

export type I18nKeys = NestedKeyOf<typeof ja>;

/**
 * 翻訳ヘルパー関数
 * ストアから言語設定を受け取って翻訳関数を返す
 */
export const getTranslator = (language: 'ja' | 'en') => {
    function t(key: I18nKeys): string {
        const langData = translations[language];
        const enData = translations['en'];

        // Resolve path
        const resolve = (obj: any, path: string): string => {
            return path.split('.').reduce((acc, part) => acc && acc[part], obj);
        };

        const result = resolve(langData, key);
        if (result) return result;

        // Fallback
        const fallback = resolve(enData, key);
        return fallback || key;
    }

    return { t };
};

/**
 * React Hook for translations
 * Uses settings store to get current language
 */
export const useTranslation = () => {
    const language = useSettingsStore((state) => state.language);

    // Issue #18: Memoized
    const translator = useMemo(() => getTranslator(language), [language]);

    return translator;
};
