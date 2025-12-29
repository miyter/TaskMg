/**
 * UI設定の一元管理モジュール（リファクタリング版）
 * TypeScript化: 2025-12-29
 */

import { APP_EVENTS } from '../../core/event-constants';
import { SIDEBAR_CONFIG } from '../features/sidebar/sidebar-constants.js';

// ========================================
// 定数定義
// ========================================

const STORAGE_KEYS = {
    FONT_EN: 'font_family_en',
    FONT_JP: 'font_family_jp',
    FONT_SIZE: 'fontSize',
    DENSITY: SIDEBAR_CONFIG.STORAGE_KEYS.DENSITY
} as const;

const DEFAULTS = {
    FONT_EN: 'Inter',
    FONT_JP: 'M PLUS 2',
    FONT_SIZE: 'md',
    DENSITY: 'normal'
} as const;

export const FONT_SIZES = {
    SMALL: 'sm',
    BASE: 'base',
    MEDIUM: 'md',
    LARGE: 'lg',
    XL: 'xl'
} as const;

export const DENSITY_LEVELS = {
    COMPACT: 'compact',
    NORMAL: 'normal',
    COMFORTABLE: 'comfortable',
    SPACIOUS: 'spacious'
} as const;

export type DensityLevel = typeof DENSITY_LEVELS[keyof typeof DENSITY_LEVELS];

export interface UISettings {
    fontEn: string;
    fontJp: string;
    fontSize: string;
    density: string;
}

// ========================================
// 設定の取得と保存
// ========================================

export function getCurrentUISettings(): UISettings {
    return {
        fontEn: localStorage.getItem(STORAGE_KEYS.FONT_EN) || DEFAULTS.FONT_EN,
        fontJp: localStorage.getItem(STORAGE_KEYS.FONT_JP) || DEFAULTS.FONT_JP,
        fontSize: localStorage.getItem(STORAGE_KEYS.FONT_SIZE) || DEFAULTS.FONT_SIZE,
        density: localStorage.getItem(STORAGE_KEYS.DENSITY) || DEFAULTS.DENSITY
    };
}

export function setFont(type: 'EN' | 'JP', fontName: string): void {
    const key = type === 'EN' ? STORAGE_KEYS.FONT_EN : STORAGE_KEYS.FONT_JP;
    localStorage.setItem(key, fontName);
    applyAllUISettings();
    notifyUISettingsChange();
}

export function setFontSize(size: string): void {
    localStorage.setItem(STORAGE_KEYS.FONT_SIZE, size);
    applyAllUISettings();
    notifyUISettingsChange();
}

export function setDensity(density: DensityLevel): void {
    localStorage.setItem(STORAGE_KEYS.DENSITY, density);

    // レガシーサポート（サイドバー用）
    if (density === 'compact') {
        localStorage.setItem(SIDEBAR_CONFIG.STORAGE_KEYS.COMPACT, 'true');
    } else {
        localStorage.setItem(SIDEBAR_CONFIG.STORAGE_KEYS.COMPACT, 'false');
    }

    applyAllUISettings();
    notifyUISettingsChange();

    window.dispatchEvent(new CustomEvent(APP_EVENTS.SIDEBAR_SETTINGS_UPDATED, {
        detail: { density }
    }));
}

// ========================================
// セグメント別の設定適用
// ========================================

function applyFontSettings(): void {
    const settings = getCurrentUISettings();
    const root = document.documentElement;

    root.style.setProperty('--font-en', `"${settings.fontEn}"`);
    root.style.setProperty('--font-jp', `"${settings.fontJp}"`);
}

function applyFontSizeSettings(): void {
    const settings = getCurrentUISettings();
    const sizeClasses = ['font-app-sm', 'font-app-base', 'font-app-md', 'font-app-lg', 'font-app-xl'];

    document.body.classList.remove(...sizeClasses);
    document.body.classList.add(`font-app-${settings.fontSize}`);
}

function applyDensitySettings(): void {
    const settings = getCurrentUISettings();
    const densities = Object.values(DENSITY_LEVELS);
    const classes = densities.map(d => `app-density-${d}`);

    document.body.classList.remove(...classes);
    document.body.classList.add(`app-density-${settings.density}`);
}

function applySidebarSettings(): void {
    const settings = getCurrentUISettings();

    const items = document.querySelectorAll('.sidebar-item-row');
    const densityClasses = Object.values(SIDEBAR_CONFIG.DENSITY_CLASSES);
    // @ts-ignore
    const targetClass = SIDEBAR_CONFIG.DENSITY_CLASSES[settings.density] || SIDEBAR_CONFIG.DENSITY_CLASSES.normal;

    items.forEach(item => {
        item.classList.remove(...densityClasses);
        item.classList.add(targetClass);
    });
}

function applyMainColumnSettings(): void {
    const settings = getCurrentUISettings();

    const taskLists = document.querySelectorAll('#task-list, .task-list-container') as NodeListOf<HTMLElement>;
    taskLists.forEach(list => {
        list.dataset.density = settings.density;
    });
}

function applyModalSettings(): void {
    // モーダルはCSS変数を使用しているため、applyDensitySettings() で既に適用済み
}

function applyDashboardSettings(): void {
    const settings = getCurrentUISettings();

    const dashboards = document.querySelectorAll(
        '#dashboard-view, #target-dashboard-view, #wizard-view, #wiki-view'
    ) as NodeListOf<HTMLElement>;

    dashboards.forEach(dashboard => {
        dashboard.dataset.density = settings.density;
        dashboard.dataset.fontSize = settings.fontSize;
    });
}

// ========================================
// 統合適用関数
// ========================================

export function applyAllUISettings(): void {
    applyFontSettings();
    applyFontSizeSettings();
    applyDensitySettings();

    applySidebarSettings();
    applyMainColumnSettings();
    applyModalSettings();
    applyDashboardSettings();
}

export function applyUISettingsToSegment(segment: 'sidebar' | 'main' | 'modal' | 'dashboard'): void {
    switch (segment) {
        case 'sidebar':
            applySidebarSettings();
            break;
        case 'main':
            applyMainColumnSettings();
            break;
        case 'modal':
            applyModalSettings();
            break;
        case 'dashboard':
            applyDashboardSettings();
            break;
        default:
            console.warn(`Unknown segment: ${segment}`);
    }
}

// ========================================
// イベント管理
// ========================================

function notifyUISettingsChange(): void {
    window.dispatchEvent(new CustomEvent(APP_EVENTS.UI_SETTINGS_CHANGED, {
        detail: getCurrentUISettings()
    }));
}

export function onUISettingsChange(callback: () => void): void {
    window.addEventListener(APP_EVENTS.UI_SETTINGS_CHANGED, callback);
    callback();
}

// ========================================
// レガシー互換性
// ========================================

export function applyUISettingsToModal(modalElement: HTMLElement | null): void {
    if (!modalElement) return;
    // モーダルはbodyのクラスとCSS変数を継承するため、特別な処理は不要
}
