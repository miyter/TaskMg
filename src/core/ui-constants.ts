/**
 * UI関連の定数定義
 * 旧 src/ui/features/sidebar/sidebar-constants.ts から移行
 */

export const UI_CONFIG = {
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
    DND: {
        PREFIX_TASK: 'task:',
        PREFIX_FILTER: 'filter:',
        TYPE_PROJECT: 'project',
        TYPE_INBOX: 'inbox',
        TYPE_TIMEBLOCK: 'timeblock',
    },
    STORAGE_KEYS: {
        WIDTH: 'sidebarWidth',
        DENSITY: 'sidebar_density',
        COMPACT: 'sidebar_compact', // @deprecated Legacy key - 移行完了後に削除予定
        SECTION_PREFIX: 'sidebar-section:',
        SECTION_ORDER: 'sidebar_section_order',
        FONT_EN: 'font_family_en',
        FONT_JP: 'font_family_jp',
        FONT_SIZE: 'fontSize',
    },
    SIDEBAR: {
        MIN_WIDTH: 150,
        MAX_WIDTH: 500,
        DEFAULT_WIDTH: 280,
        BREAKPOINT_MD: 768,
        DURATIONS: [30, 45, 60, 75, 90],
    }
} as const;

export type Density = 'compact' | 'normal' | 'comfortable' | 'spacious';
export type SidebarDensity = Density;
