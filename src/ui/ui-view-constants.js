/**
 * UI関連の定数管理
 */

export const ASSETS = {
    FAVICON: '/images/favicon-96x96.png'
};

export const DOM_IDS = {
    CRITICAL_ERROR_OVERLAY: 'critical-error-overlay'
};

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