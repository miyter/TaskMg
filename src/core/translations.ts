/**
 * 翻訳リソースマップ
 * UIの文言を一元管理する
 */

type I18nKeys =
    | 'dashboard'
    | 'inbox'
    | 'today'
    | 'upcoming'
    | 'completed'
    | 'trash'
    | 'projects'
    | 'labels'
    | 'filters'
    | 'timeblocks'
    | 'durations'
    | 'targets'
    | 'workspaces'
    | 'settings'
    | 'add_task'
    | 'search'
    | 'no_tasks'
    | 'loading'
    | 'error'
    | 'backup_restore'
    | 'general'
    | 'appearance'
    | 'account'
    | 'language'
    | 'important'
    | 'all_tasks'
    | 'add'
    | 'backward_map'
    | 'woop_board'
    | 'okr_tree';

export const translations: Record<'ja' | 'en', Record<I18nKeys, string>> = {
    ja: {
        dashboard: 'ダッシュボード',
        inbox: 'インボックス',
        today: '今日',
        upcoming: '今後の予定',
        completed: '完了済み',
        trash: 'ゴミ箱',
        projects: 'プロジェクト',
        labels: 'ラベル',
        filters: 'カスタムフィルタ',
        timeblocks: 'タイムブロック',
        durations: '所要時間',
        targets: '目標 (Targets)',
        workspaces: 'ワークスペース',
        settings: '設定',
        add_task: 'タスクを追加',
        search: '検索',
        no_tasks: 'タスクがありません',
        loading: '読み込み中...',
        error: 'エラーが発生しました',
        backup_restore: 'バックアップと復元',
        general: '一般',
        appearance: '外観',
        account: 'アカウント',
        language: '言語 (Language)',
        important: '重要',
        all_tasks: 'すべて',
        add: '追加',
        backward_map: 'バックワード',
        woop_board: 'WOOP',
        okr_tree: 'OKR',
    },
    en: {
        dashboard: 'Dashboard',
        inbox: 'Inbox',
        today: 'Today',
        upcoming: 'Upcoming',
        completed: 'Completed',
        trash: 'Trash',
        projects: 'Projects',
        labels: 'Labels',
        filters: 'Filters',
        timeblocks: 'Time Blocks',
        durations: 'Durations',
        targets: 'Targets',
        workspaces: 'Workspaces',
        settings: 'Settings',
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
    }
};

/**
 * 翻訳ヘルパーフックのような簡易関数
 * (Hooksではないが、storeからlangを取得して使う想定)
 */
import { useSettingsStore } from '../store/ui/settings-store';

export const useTranslation = () => {
    const { language } = useSettingsStore();

    function t(key: I18nKeys): string {
        return translations[language][key] || key;
    }

    return { t, language };
};
