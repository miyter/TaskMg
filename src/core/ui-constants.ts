/**
 * UI関連の定数定義
 * 旧 src/ui/features/sidebar/sidebar-constants.ts から移行
 */

export const UI_CONFIG = {
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
        BREAKPOINT_MD: 768, // Matches Tailwind 'md' breakpoint (768px)
        DURATIONS: [30, 45, 60, 75, 90],
    },
    LAYOUT: {
        // Tailwind class for main content width
        CONTAINER_WIDTH_CLASS: 'max-w-5xl',
        MOBILE_SIDEBAR_WIDTH_PX: 280,
    },
    FONTS: {
        EU: [
            { label: 'Inter', value: 'Inter, sans-serif' },
            { label: 'Roboto', value: 'Roboto, sans-serif' },
            { label: 'System UI', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }
        ],
        JP: [
            { label: 'M PLUS 2', value: '"M PLUS 2", sans-serif' },
            { label: 'Noto Sans JP', value: '"Noto Sans JP", sans-serif' },
            { label: 'Hiragino / Yu Gothic', value: '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif' }
        ]
    }
} as const;

export type Density = 'compact' | 'normal' | 'comfortable' | 'spacious';
export type SidebarDensity = Density;
