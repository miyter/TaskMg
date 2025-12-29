/**
 * UI設定の一元管理モジュール（リファクタリング版）
 * 各画面セグメント（サイドバー、メインカラム、モーダル、ダッシュボード）への設定適用を統括
 */

import { SIDEBAR_CONFIG } from '../features/sidebar/sidebar-constants.js';
import { APP_EVENTS } from '../../core/event-constants';

// ========================================
// 定数定義
// ========================================

const STORAGE_KEYS = {
    FONT_EN: 'font_family_en',
    FONT_JP: 'font_family_jp',
    FONT_SIZE: 'fontSize',
    DENSITY: SIDEBAR_CONFIG.STORAGE_KEYS.DENSITY
};

const DEFAULTS = {
    FONT_EN: 'Inter',
    FONT_JP: 'M PLUS 2',
    FONT_SIZE: 'md',
    DENSITY: 'normal'
};

// フォントサイズのマッピング
export const FONT_SIZES = {
    SMALL: 'sm',
    BASE: 'base',
    MEDIUM: 'md',
    LARGE: 'lg',
    XL: 'xl'
};

// UI密度のマッピング
export const DENSITY_LEVELS = {
    COMPACT: 'compact',
    NORMAL: 'normal',
    COMFORTABLE: 'comfortable',
    SPACIOUS: 'spacious'
};

// ========================================
// 設定の取得と保存
// ========================================

/**
 * 現在のUI設定を取得
 */
export function getCurrentUISettings() {
    return {
        fontEn: localStorage.getItem(STORAGE_KEYS.FONT_EN) || DEFAULTS.FONT_EN,
        fontJp: localStorage.getItem(STORAGE_KEYS.FONT_JP) || DEFAULTS.FONT_JP,
        fontSize: localStorage.getItem(STORAGE_KEYS.FONT_SIZE) || DEFAULTS.FONT_SIZE,
        density: localStorage.getItem(STORAGE_KEYS.DENSITY) || DEFAULTS.DENSITY
    };
}

/**
 * フォント設定を保存して適用
 */
export function setFont(type, fontName) {
    const key = type === 'EN' ? STORAGE_KEYS.FONT_EN : STORAGE_KEYS.FONT_JP;
    localStorage.setItem(key, fontName);
    applyAllUISettings();
    notifyUISettingsChange();
}

/**
 * フォントサイズ設定を保存して適用
 */
export function setFontSize(size) {
    localStorage.setItem(STORAGE_KEYS.FONT_SIZE, size);
    applyAllUISettings();
    notifyUISettingsChange();
}

/**
 * UI密度設定を保存して適用
 */
export function setDensity(density) {
    localStorage.setItem(STORAGE_KEYS.DENSITY, density);

    // レガシーサポート（サイドバー用）
    if (density === 'compact') {
        localStorage.setItem(SIDEBAR_CONFIG.STORAGE_KEYS.COMPACT, 'true');
    } else {
        localStorage.setItem(SIDEBAR_CONFIG.STORAGE_KEYS.COMPACT, 'false');
    }

    applyAllUISettings();
    notifyUISettingsChange();

    // サイドバー更新イベントも発火
    window.dispatchEvent(new CustomEvent(APP_EVENTS.SIDEBAR_SETTINGS_UPDATED, {
        detail: { density }
    }));
}

// ========================================
// セグメント別の設定適用
// ========================================

/**
 * 1. フォント設定を適用（全セグメント共通）
 */
function applyFontSettings() {
    const settings = getCurrentUISettings();
    const root = document.documentElement;

    root.style.setProperty('--font-en', `"${settings.fontEn}"`);
    root.style.setProperty('--font-jp', `"${settings.fontJp}"`);
}

/**
 * 2. フォントサイズ設定を適用（全セグメント共通）
 */
function applyFontSizeSettings() {
    const settings = getCurrentUISettings();
    const sizeClasses = ['font-app-sm', 'font-app-base', 'font-app-md', 'font-app-lg', 'font-app-xl'];

    document.body.classList.remove(...sizeClasses);
    document.body.classList.add(`font-app-${settings.fontSize}`);
}

/**
 * 3. UI密度設定を適用（全セグメント共通）
 */
function applyDensitySettings() {
    const settings = getCurrentUISettings();
    const densities = Object.values(DENSITY_LEVELS);
    const classes = densities.map(d => `app-density-${d}`);

    document.body.classList.remove(...classes);
    document.body.classList.add(`app-density-${settings.density}`);
}

/**
 * 4. サイドバー固有の設定を適用
 */
function applySidebarSettings() {
    const settings = getCurrentUISettings();

    // サイドバーアイテムの密度クラスを適用
    const items = document.querySelectorAll('.sidebar-item-row');
    const densityClasses = Object.values(SIDEBAR_CONFIG.DENSITY_CLASSES);
    const targetClass = SIDEBAR_CONFIG.DENSITY_CLASSES[settings.density] || SIDEBAR_CONFIG.DENSITY_CLASSES.normal;

    items.forEach(item => {
        item.classList.remove(...densityClasses);
        item.classList.add(targetClass);
    });
}

/**
 * 5. メインカラム固有の設定を適用
 */
function applyMainColumnSettings() {
    const settings = getCurrentUISettings();

    // タスクリストのスペーシング調整
    const taskLists = document.querySelectorAll('#task-list, .task-list-container');
    taskLists.forEach(list => {
        // 密度に応じたクラスを適用（必要に応じて）
        list.dataset.density = settings.density;
    });
}

/**
 * 6. モーダル固有の設定を適用
 */
function applyModalSettings() {
    // モーダルはCSS変数（--modal-p, --modal-gap）を使用しているため、
    // applyDensitySettings() で既に適用済み
    // 追加の処理が必要な場合はここに記述
}

/**
 * 7. ダッシュボード固有の設定を適用
 */
function applyDashboardSettings() {
    const settings = getCurrentUISettings();

    // ダッシュボードコンテナに密度クラスを適用
    const dashboards = document.querySelectorAll(
        '#dashboard-view, #target-dashboard-view, #wizard-view, #wiki-view'
    );

    dashboards.forEach(dashboard => {
        dashboard.dataset.density = settings.density;
        dashboard.dataset.fontSize = settings.fontSize;
    });
}

// ========================================
// 統合適用関数
// ========================================

/**
 * すべてのUI設定を一括適用
 */
export function applyAllUISettings() {
    // 共通設定
    applyFontSettings();
    applyFontSizeSettings();
    applyDensitySettings();

    // セグメント別設定
    applySidebarSettings();
    applyMainColumnSettings();
    applyModalSettings();
    applyDashboardSettings();
}

/**
 * 特定のセグメントのみに設定を適用
 */
export function applyUISettingsToSegment(segment) {
    const settings = getCurrentUISettings();

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

/**
 * UI設定変更イベントを発火
 */
function notifyUISettingsChange() {
    window.dispatchEvent(new CustomEvent(APP_EVENTS.UI_SETTINGS_CHANGED, {
        detail: getCurrentUISettings()
    }));
}

/**
 * UI設定変更時のイベントリスナーを登録
 */
export function onUISettingsChange(callback) {
    window.addEventListener(APP_EVENTS.UI_SETTINGS_CHANGED, callback);
    // 初回実行
    callback();
}

// ========================================
// レガシー互換性（既存コードとの互換性維持）
// ========================================

// モーダル用の互換関数
export function applyUISettingsToModal(modalElement) {
    if (!modalElement) return;
    // モーダルはbodyのクラスとCSS変数を継承するため、特別な処理は不要
    // 必要に応じてモーダル固有の処理を追加
}
