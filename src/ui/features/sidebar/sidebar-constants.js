/**
 * サイドバー用定数定義
 */
export const SIDEBAR_CONFIG = {
    MIN_WIDTH: 150,
    MAX_WIDTH: 500,
    DEFAULT_WIDTH: 280,
    BREAKPOINT_MD: 768,
    // Density Levels
    DENSITY_LEVELS: {
        COMPACT: 'compact',
        NORMAL: 'normal',
        COMFORTABLE: 'comfortable',
        SPACIOUS: 'spacious'
    },
    // Map levels to utility classes (Sidebar items padding)
    DENSITY_CLASSES: {
        'compact': 'py-0.5',
        'normal': 'py-1.5',
        'comfortable': 'py-2.5',
        'spacious': 'py-3.5'
    },
    CLASSES: {
        // Deprecated: COMPACT_PY, NORMAL_PY (use DENSITY_CLASSES)
        CLOSED: '-translate-x-full',
        HIDDEN: 'hidden',
        DRAG_OVER: ['bg-blue-100', 'dark:bg-blue-900', 'ring-2', 'ring-blue-400']
    },
    COLORS: {
        DEFAULT: '#CBD5E0' // gray-300 equivalent
    },
    STORAGE_KEYS: {
        WIDTH: 'sidebarWidth',
        DENSITY: 'sidebar_density', // New key
        COMPACT: 'sidebar_compact', // Legacy key (migration needed if we care)
        SECTION_PREFIX: 'sidebar-section:',
        SECTION_ORDER: 'sidebar_section_order'
    },
    LIST_IDS: {
        PROJECTS: 'project-list',
        LABELS: 'label-list',
        TIMEBLOCKS: 'timeblock-list',
        DURATIONS: 'duration-list',
        FILTERS: 'filter-list',
        TARGETS: 'target-tool-list',
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