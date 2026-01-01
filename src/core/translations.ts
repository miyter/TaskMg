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
    close: '閉じる',
    clear: 'クリア',
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
        },
        confirm_delete: '本当に削除しますか？\n削除されたデータは元に戻せません。',
    },

    delete: '削除',
    timeblock: 'タイムブロック',
    filter: 'フィルター',
    sidebar: {
        add_workspace: 'ワークスペースを追加',
        search_placeholder: '検索 (/)',
        target_wizard: '目標設計ウィザード',
        target_dashboard: '目標ダッシュボード',
        framework_wiki: 'フレームワークWiki',
        unassigned: '未定',
        toggle_collapse: 'サイドバーを閉じる',
        toggle_expand: 'サイドバーを開く',
        resizer_label: 'サイドバーの幅調整',
        resizer_hint: 'ドラッグまたは矢印キーでリサイズ',
        menu_open: 'メニューを開く',
        reorder_section: 'セクションを並び替え',
    },

    modal: {
        task_title_placeholder: 'タスクのタイトル',
        memo_markdown: 'メモ (Markdown)',
        edit: '編集',
        preview: 'プレビュー',
        schedule: 'スケジュール',
        due_date: '期限日',
        recurrence: '繰り返し',
        recurrence_days: '繰り返す曜日',
        time_block: '時間帯',
        duration: '所要時間',
        no_duration: '指定なし',
        no_project: 'プロジェクトなし',
        cancel: 'キャンセル',
        save: '保存',
        create: '作成',
        delete: '削除',
        delete_confirm: '本当にこのタスクを削除しますか？',
        no_memo: 'メモがありません',
    },

    recurrence: {
        none: 'なし',
        daily: '毎日',
        weekdays: '平日',
        weekly: '毎週',
        monthly: '毎月',
    },

    days: {
        sun: '日',
        mon: '月',
        tue: '火',
        wed: '水',
        thu: '木',
        fri: '金',
        sat: '土',
    },

    settings_modal: {
        title: '設定',
        tabs: {
            general: '一般設定',
            appearance: '外観・表示',
            account: 'アカウント',
            advanced: '高度な設定',
        },
        appearance: {
            theme: 'テーマ',
            density: '表示密度',
            font_size: '文字サイズ',
            fonts: 'フォント設定',
            font_en: '欧文フォント',
            font_jp: '和文フォント',
        },
        backup: {
            title: 'バックアップと復元',
            description: '現在のワークスペースのタスク、プロジェクト、ラベル、目標、設定などをJSONファイルとしてダウンロードしたり、バックアップファイルからデータを復元したりできます。',
            create: 'バックアップを作成',
            import: 'インポート',
            import_confirm: '現在のワークスペースにデータをインポートしますか？\n既存のデータは保持されますが、重複データの作成を防ぐため一部のIDが変更される場合があります。',
            import_success: 'インポートが完了しました。\nタスク: {tasks}件\nプロジェクト: {projects}件',
            import_fail: 'インポートに失敗しました。ファイル形式が正しいか確認してください。',
            create_fail: 'バックアップの作成に失敗しました。',
        },
        options: {
            theme: {
                light: 'ライト',
                dark: 'ダーク',
                system: 'システム'
            },
            density: {
                compact: 'コンパクト',
                normal: '通常',
                comfortable: 'ゆったり',
                spacious: '広め'
            }
        },
        language: {
            title: '言語設定 (Language)',
            description: 'UIの言語設定を変更します。',
        },
        maintenance: {
            title: 'データベースメンテナンス',
            description: 'データベース内の重複したデータを検出し、整理します。この操作は取り消せません。実行前にバックアップを作成することを強く推奨します。',
            cleanup_duplicate: '重複タスクの削除（要確認）',
            confirm_backup: '【警告】重複したタスクを削除します。\n実行前にバックアップを作成しましたか？\n（タイトルが同じタスクのうち、古いものを残して削除します）',
            confirm_final: '【最終確認】この操作は取り消せません。本当に実行しますか？',
            cleanup_success: '{count} 件の重複タスクを削除しました。',
            cleanup_fail: 'エラーが発生しました: {error}',
        }
    },

    inline_input: {
        placeholder: 'タスク名を入力...',
        label: 'タスク名',
        tooltip_today: '今日やる',
        tooltip_today_remove: '今日の設定を解除',
        tooltip_important: '重要',
        tooltip_important_remove: '重要を解除',
        aria_today: '今日やるタスクに設定',
        aria_today_remove: '今日の日付を解除',
        aria_important: '重要に設定',
        aria_important_remove: '重要を解除',
        adding: '追加中...',
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
    close: 'Close',
    clear: 'Clear',
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
        },
        confirm_delete: 'Are you sure you want to delete this item?\nThis action cannot be undone.',
    },

    delete: 'Delete',
    timeblock: 'Time Block',
    filter: 'Filter',
    sidebar: {
        add_workspace: 'Add Workspace',
        search_placeholder: 'Search (/)',
        target_wizard: 'Target Wizard',
        target_dashboard: 'Target Dashboard',
        framework_wiki: 'Framework Wiki',
        unassigned: 'Unassigned',
        toggle_collapse: 'Collapse Sidebar',
        toggle_expand: 'Expand Sidebar',
        resizer_label: 'Resize Sidebar',
        resizer_hint: 'Drag or use arrow keys to resize',
        menu_open: 'Open Menu',
        reorder_section: 'Reorder Section',
    },

    modal: {
        task_title_placeholder: 'Task Title',
        memo_markdown: 'Memo (Markdown)',
        edit: 'Edit',
        preview: 'Preview',
        schedule: 'Schedule',
        due_date: 'Due Date',
        recurrence: 'Recurrence',
        recurrence_days: 'Repeat Days',
        time_block: 'Time Block',
        duration: 'Duration',
        no_duration: 'Not Set',
        no_project: 'No Project',
        cancel: 'Cancel',
        save: 'Save',
        create: 'Create',
        delete: 'Delete',
        delete_confirm: 'Are you sure you want to delete this task?',
        no_memo: 'No memo',
    },

    recurrence: {
        none: 'None',
        daily: 'Daily',
        weekdays: 'Weekdays',
        weekly: 'Weekly',
        monthly: 'Monthly',
    },

    days: {
        sun: 'Sun',
        mon: 'Mon',
        tue: 'Tue',
        wed: 'Wed',
        thu: 'Thu',
        fri: 'Fri',
        sat: 'Sat',
    },

    settings_modal: {
        title: 'Settings',
        tabs: {
            general: 'General',
            appearance: 'Appearance',
            account: 'Account',
            advanced: 'Advanced',
        },
        appearance: {
            theme: 'Theme',
            density: 'Density',
            font_size: 'Font Size',
            fonts: 'Fonts',
            font_en: 'English Font',
            font_jp: 'Japanese Font',
        },
        backup: {
            title: 'Backup & Restore',
            description: 'Download workspace data (tasks, projects, settings) as JSON or restore from backup.',
            create: 'Create Backup',
            import: 'Import',
            import_confirm: 'Import data into current workspace?\nExisting data remains, but some IDs may change to prevent duplicates.',
            import_success: 'Import completed.\nTasks: {tasks}\nProjects: {projects}',
            import_fail: 'Import failed. Please check the file format.',
            create_fail: 'Failed to create backup.',
        },
        options: {
            theme: {
                light: 'Light',
                dark: 'Dark',
                system: 'System'
            },
            density: {
                compact: 'Compact',
                normal: 'Normal',
                comfortable: 'Comfortable',
                spacious: 'Spacious'
            }
        },
        language: {
            title: 'Language',
            description: 'Change the UI language.',
        },
        maintenance: {
            title: 'Database Maintenance',
            description: 'Detect and clean up duplicate data. This action cannot be undone. Please backup before running.',
            cleanup_duplicate: 'Clean Up Duplicates (Confirm)',
            confirm_backup: '[Warning] Deleting duplicate tasks.\nDid you create a backup?\n(Older duplicates will be removed)',
            confirm_final: '[Final Confirm] This cannot be undone. Execute?',
            cleanup_success: 'Deleted {count} duplicate tasks.',
            cleanup_fail: 'Error occurred: {error}',
        }
    },

    inline_input: {
        placeholder: 'Enter task name...',
        label: 'Task Name',
        tooltip_today: 'Do Today',
        tooltip_today_remove: 'Remove Today',
        tooltip_important: 'Mark Important',
        tooltip_important_remove: 'Unmark Important',
        aria_today: 'Set for today',
        aria_today_remove: 'Remove from today',
        aria_important: 'Mark as important',
        aria_important_remove: 'Unmark as important',
        adding: 'Adding...',
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
