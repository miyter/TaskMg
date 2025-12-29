/**
 * デザインシステム - タイポグラフィとスペーシングの統一管理
 * TypeScript化: 2025-12-29
 */

// ========================================
// タイポグラフィ階層
// ========================================

export const TYPOGRAPHY = {
    HEADING: {
        H1: 'text-xl font-bold',
        H2: 'text-lg font-bold',
        H3: 'text-base font-bold',
        H4: 'text-sm font-bold',
    },
    TEXT: {
        LARGE: 'text-base',
        NORMAL: 'text-sm',
        SMALL: 'text-xs',
        TINY: 'text-[10px]',
    },
    SPECIAL: {
        MONO: 'font-mono tabular-nums',
        LABEL: 'text-xs font-bold uppercase tracking-wider',
        CAPTION: 'text-xs text-gray-500 dark:text-gray-400',
    }
} as const;

export const SPACING = {
    VERTICAL: {
        SECTION: 'mb-6',
        BLOCK: 'mb-4',
        ITEM: 'mb-2',
        TIGHT: 'mb-1',
    },
    HORIZONTAL: {
        SECTION: 'gap-6',
        BLOCK: 'gap-4',
        ITEM: 'gap-2',
        TIGHT: 'gap-1',
    },
    PADDING: {
        LARGE: 'p-6',
        MEDIUM: 'p-4',
        SMALL: 'p-3',
        COMPACT: 'p-2',
        MINIMAL: 'p-1',
    }
} as const;

export const LAYOUT = {
    MAX_HEIGHT: '700px',
    MAX_HEIGHT_CLASS: 'max-h-[700px]',
    HEADER_HEIGHT: 'h-12',
    FOOTER_HEIGHT: 'h-12',
    CONTENT_HEIGHT: 'h-[676px]',
    CONTAINER: {
        NARROW: 'max-w-3xl',
        NORMAL: 'max-w-4xl',
        WIDE: 'max-w-5xl',
        FULL: 'max-w-6xl',
    }
} as const;

export const ICON_SIZE = {
    TINY: 'w-3 h-3',
    SMALL: 'w-4 h-4',
    NORMAL: 'w-5 h-5',
    MEDIUM: 'w-6 h-6',
    LARGE: 'w-8 h-8',
} as const;

// ========================================
// 設定による動的変更
// ========================================

interface FontSizePreset {
    H1: string;
    H2: string;
    H3: string;
    H4: string;
    LARGE: string;
    NORMAL: string;
    SMALL: string;
}

export const FONT_SIZE_PRESETS: Record<string, FontSizePreset> = {
    xs: {
        H1: 'text-lg',
        H2: 'text-base',
        H3: 'text-sm',
        H4: 'text-xs',
        LARGE: 'text-sm',
        NORMAL: 'text-xs',
        SMALL: 'text-[10px]',
    },
    sm: {
        H1: 'text-xl',
        H2: 'text-lg',
        H3: 'text-base',
        H4: 'text-sm',
        LARGE: 'text-base',
        NORMAL: 'text-sm',
        SMALL: 'text-xs',
    },
    md: {
        H1: 'text-2xl',
        H2: 'text-xl',
        H3: 'text-lg',
        H4: 'text-base',
        LARGE: 'text-lg',
        NORMAL: 'text-base',
        SMALL: 'text-sm',
    },
    lg: {
        H1: 'text-3xl',
        H2: 'text-2xl',
        H3: 'text-xl',
        H4: 'text-lg',
        LARGE: 'text-xl',
        NORMAL: 'text-lg',
        SMALL: 'text-base',
    },
};

export function getCurrentFontSizePreset(): FontSizePreset {
    const fontSize = localStorage.getItem('fontSize') || 'sm';
    return FONT_SIZE_PRESETS[fontSize] || FONT_SIZE_PRESETS.sm;
}

export function applyFontSizePreset(preset: string): void {
    localStorage.setItem('fontSize', preset);

    const root = document.documentElement;
    const sizes = FONT_SIZE_PRESETS[preset];

    if (sizes) {
        root.style.setProperty('--font-h1', sizes.H1);
        root.style.setProperty('--font-h2', sizes.H2);
        root.style.setProperty('--font-h3', sizes.H3);
        root.style.setProperty('--font-h4', sizes.H4);
        root.style.setProperty('--font-large', sizes.LARGE);
        root.style.setProperty('--font-normal', sizes.NORMAL);
        root.style.setProperty('--font-small', sizes.SMALL);
    }

    window.dispatchEvent(new CustomEvent('font-size-changed', { detail: { preset } }));
}

// ========================================
// ユーティリティ関数
// ========================================

type HeadingLevel = keyof typeof TYPOGRAPHY.HEADING;
type TextSize = keyof typeof TYPOGRAPHY.TEXT;
type SpacingType = keyof typeof SPACING.VERTICAL;
type SpacingDirection = 'VERTICAL' | 'HORIZONTAL';

export function getHeadingClass(level: HeadingLevel): string {
    return TYPOGRAPHY.HEADING[level] || TYPOGRAPHY.HEADING.H3;
}

export function getTextClass(size: TextSize = 'NORMAL'): string {
    return TYPOGRAPHY.TEXT[size] || TYPOGRAPHY.TEXT.NORMAL;
}

export function getSpacingClass(type: SpacingType, direction: SpacingDirection = 'VERTICAL'): string {
    return SPACING[direction][type] || SPACING.VERTICAL.ITEM;
}

// ========================================
// 初期化
// ========================================

export function initDesignSystem(): void {
    const currentPreset = localStorage.getItem('fontSize') || 'sm';
    applyFontSizePreset(currentPreset);
}
