/**
 * UI関連の定数管理
 */

export const ASSETS = {
    FAVICON: '/images/favicon-96x96.png'
};

export const DOM_IDS = {
    CRITICAL_ERROR_OVERLAY: 'critical-error-overlay'
};

/**
 * サイドバーのアイテム種別定義
 */
export const SIDEBAR_TYPE = {
    PROJECT: 'project',
    LABEL: 'label',
    TIMEBLOCK: 'timeblock',
    DURATION: 'duration',
    FILTER: 'filter'
};

/**
 * UI全体で使用する定数定義
 * Note: ui-view-utils.js で UI_CONFIG としてインポートされるため名称を統一
 */
export const UI_CONFIG = {
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