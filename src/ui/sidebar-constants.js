/**
 * 更新日: 2025-12-21
 * 内容: SIDEBAR_CONFIG の定義と明確な export
 */
export const SIDEBAR_CONFIG = {
    MIN_WIDTH: 150,
    MAX_WIDTH: 500,
    DEFAULT_WIDTH: 280,
    BREAKPOINT_MD: 768,
    CLASSES: {
        COMPACT_PY: 'py-0.5',
        NORMAL_PY: 'py-1.5',
        CLOSED: 'sidebar-closed',
        HIDDEN: 'hidden',
        DRAG_OVER: ['bg-blue-100', 'dark:bg-blue-900', 'ring-2', 'ring-blue-400']
    },
    STORAGE_KEYS: {
        WIDTH: 'sidebarWidth',
        COMPACT: 'sidebar_compact',
        SECTION_PREFIX: 'sidebar-section:'
    },
    LIST_IDS: {
        PROJECTS: 'project-list',
        LABELS: 'label-list',
        TIMEBLOCKS: 'timeblock-list',
        DURATIONS: 'duration-list',
        FILTERS: 'filter-list',
        BASIC: 'basic-list'
    },
    MODAL_IDS: {
        SETTINGS: 'settings-modal-dynamic'
    },
    DURATIONS: [30, 45, 60, 75, 90],
    DURATION_LIMITS: {
        MIN: 5,
        MAX: 480
    }
};