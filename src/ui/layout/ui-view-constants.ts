/**
 * UI関連の定数管理
 * TypeScript化: 2025-12-29
 */

export const ASSETS = {
    FAVICON: '/images/favicon-96x96.png'
} as const;

export const DOM_IDS = {
    CRITICAL_ERROR_OVERLAY: 'critical-error-overlay'
} as const;

/**
 * サイドバーのアイテム種別定義
 */
export const SIDEBAR_TYPE = {
    PROJECT: 'project',
    LABEL: 'label',
    TIMEBLOCK: 'timeblock',
    DURATION: 'duration',
    FILTER: 'filter'
} as const;

/**
 * UI全体で使用する定数定義
 */
export const UI_CONFIG = {
    VIEW_IDS: {
        TASK: 'task-view',
        DASHBOARD: 'dashboard-view',
        SEARCH: 'search-view',
        SETTINGS: 'settings-view',
        WIZARD: 'wizard-view',
        TARGET_DASHBOARD: 'target-dashboard-view',
        WIKI: 'wiki-view'
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
} as const;

export type SidebarType = typeof SIDEBAR_TYPE[keyof typeof SIDEBAR_TYPE];
