/**
 * レイアウトに関する定数の一元管理
 * TypeScript化: 2025-12-29
 */
export const LAYOUT_CONFIG = {
    Z_INDEX: {
        HEADER: 10,
        OVERLAY: 20,
        SIDEBAR: 30,
        DROPDOWN: 40,
        MODAL: 50
    }
} as const;

export type LayoutConfig = typeof LAYOUT_CONFIG;
