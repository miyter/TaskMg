/**
 * 更新日: 2025-12-21
 * 内容: ビューID、スタイルクラス、属性の定数化
 */
export const UI_VIEW_CONFIG = {
    VIEW_IDS: {
        TASK: 'task-view',
        DASHBOARD: 'dashboard-view',
        SEARCH: 'search-view',
        SETTINGS: 'settings-view'
    },
    HEADER_IDS: {
        TITLE: 'header-title',
        COUNT: 'header-count'
    },
    CLASSES: {
        HIGHLIGHT: ['bg-blue-600', 'dark:bg-blue-600', 'text-white', 'dark:text-white'],
        NORMAL: ['text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-800'],
        FADE_IN: 'animate-fade-in',
        HIDDEN: 'hidden'
    },
    DATA_ATTRS: {
        DEFAULT_COLOR: 'data-default-color'
    }
};