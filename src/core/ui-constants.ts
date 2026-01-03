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
    // Issue #10: Explicitly scoped constants
    SIDEBAR_DENSITY: {
        'compact': 'py-0.5',
        'normal': 'py-1.5',
        'comfortable': 'py-2.5',
        'spacious': 'py-3.5'
    },
    DND: {
        PREFIX_TASK: 'task:',
        PREFIX_PROJECT: 'project:',
        PREFIX_FILTER: 'filter:',
        TYPE_PROJECT: 'project',
        TYPE_INBOX: 'inbox',
        TYPE_TIMEBLOCK: 'timeblock',
        TYPE_LABEL: 'label',
        TOUCH_DELAY: 250, // Issue #9
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
    TIME_BLOCK: {
        MAX_COUNT: 10,
        DEFAULTS: [
            { id: 'tb_morning', name: '06:00 - 09:00', start: '06:00', end: '09:00', color: '#EF4444', order: 0 },
            { id: 'tb_afternoon', name: '13:00 - 17:00', start: '13:00', end: '17:00', color: '#3B82F6', order: 1 },
            { id: 'tb_night', name: '20:00 - 22:00', start: '20:00', end: '22:00', color: '#8B5CF6', order: 2 }
        ]
    },
    LAYOUT: {
        // Tailwind class for main content width
        CONTAINER_WIDTH_CLASS: 'w-full max-w-full',
        MOBILE_SIDEBAR_WIDTH_PX: 280,
    },
    FONTS: {
        EU: [
            { label: 'Google Sans', value: '"Google Sans", Inter, sans-serif' },
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

export const COLOR_PALETTE = [
    { value: '#EF5350', key: 'red' },
    { value: '#EC407A', key: 'pink' },
    { value: '#AB47BC', key: 'purple' },
    { value: '#7E57C2', key: 'deep_purple' },
    { value: '#5C6BC0', key: 'indigo' },
    { value: '#42A5F5', key: 'blue' },
    { value: '#29B6F6', key: 'light_blue' },
    { value: '#26C6DA', key: 'cyan' },
    { value: '#26A69A', key: 'teal' },
    { value: '#66BB6A', key: 'green' },
    { value: '#9CCC65', key: 'light_green' },
    { value: '#D4E157', key: 'lime' },
    { value: '#FFEE58', key: 'yellow' },
    { value: '#FFCA28', key: 'amber' },
    { value: '#FFA726', key: 'orange' },
    { value: '#FF7043', key: 'deep_orange' },
    { value: '#8D6E63', key: 'brown' },
    { value: '#BDBDBD', key: 'grey' },
    { value: '#78909C', key: 'blue_grey' }
] as const;

export const SHARED_COLORS = COLOR_PALETTE.map(c => c.value);

export type Density = 'compact' | 'normal' | 'comfortable' | 'spacious';
export type SidebarDensity = Density;
