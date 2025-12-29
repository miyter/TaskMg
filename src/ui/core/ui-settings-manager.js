/**
 * UI設定の一元管理モジュール
 * フォント、フォントサイズ、UI密度の設定を管理し、全モーダルに適用する
 */

import { SIDEBAR_CONFIG } from '../features/sidebar/sidebar-constants.js';

// ストレージキー定数
const STORAGE_KEYS = {
    FONT_EN: 'font_family_en',
    FONT_JP: 'font_family_jp',
    FONT_SIZE: 'fontSize',
    DENSITY: SIDEBAR_CONFIG.STORAGE_KEYS.DENSITY
};

// デフォルト値
const DEFAULTS = {
    FONT_EN: 'Inter',
    FONT_JP: 'M PLUS 2',
    FONT_SIZE: 'md',
    DENSITY: 'normal'
};

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
 * フォント設定を適用（CSS変数を更新）
 */
export function applyFontSettings() {
    const settings = getCurrentUISettings();
    const root = document.documentElement;

    root.style.setProperty('--font-en', `"${settings.fontEn}"`);
    root.style.setProperty('--font-jp', `"${settings.fontJp}"`);
}

/**
 * フォントサイズ設定を適用（bodyにクラスを追加）
 */
export function applyFontSizeSettings() {
    const settings = getCurrentUISettings();
    const sizeClasses = ['font-app-sm', 'font-app-base', 'font-app-md', 'font-app-lg', 'font-app-xl'];

    document.body.classList.remove(...sizeClasses);
    document.body.classList.add(`font-app-${settings.fontSize}`);
}

/**
 * UI密度設定を適用（bodyにクラスを追加、CSS変数を更新）
 */
export function applyDensitySettings() {
    const settings = getCurrentUISettings();
    const densities = ['compact', 'normal', 'comfortable', 'spacious'];
    const classes = densities.map(d => `app-density-${d}`);

    document.body.classList.remove(...classes);
    document.body.classList.add(`app-density-${settings.density}`);
}

/**
 * すべてのUI設定を一括適用
 */
export function applyAllUISettings() {
    applyFontSettings();
    applyFontSizeSettings();
    applyDensitySettings();
}

/**
 * モーダル要素にUI設定を適用
 * @param {HTMLElement} modalElement - モーダルのルート要素
 */
export function applyUISettingsToModal(modalElement) {
    if (!modalElement) return;

    const settings = getCurrentUISettings();

    // フォント設定（継承されるため、特別な処理は不要だが明示的に設定も可能）
    // modalElement.style.fontFamily = `var(--font-en), var(--font-jp), sans-serif`;

    // フォントサイズクラス（bodyから継承）
    // 必要に応じてモーダル固有のクラスを追加

    // UI密度クラス（bodyから継承されるCSS変数を利用）
    // モーダル内で .p-modal, .gap-modal などのユーティリティクラスを使用
}

/**
 * UI設定変更時のイベントリスナーを登録
 * @param {Function} callback - 設定変更時に実行するコールバック
 */
export function onUISettingsChange(callback) {
    // カスタムイベントをリッスン
    window.addEventListener('ui-settings-changed', callback);

    // 初回実行
    callback();
}


/**
 * UI設定変更イベントを発火
 */
export function notifyUISettingsChange() {
    window.dispatchEvent(new CustomEvent('ui-settings-changed', {
        detail: getCurrentUISettings()
    }));
}

/**
 * フォント設定を保存して適用
 * @param {string} type - 'EN' or 'JP'
 * @param {string} fontName - フォント名
 */
export function setFont(type, fontName) {
    const key = type === 'EN' ? STORAGE_KEYS.FONT_EN : STORAGE_KEYS.FONT_JP;
    localStorage.setItem(key, fontName);
    applyFontSettings();
    notifyUISettingsChange();
}

/**
 * フォントサイズ設定を保存して適用
 * @param {string} size - フォントサイズ ('sm', 'base', 'md', 'lg', 'xl')
 */
export function setFontSize(size) {
    localStorage.setItem(STORAGE_KEYS.FONT_SIZE, size);
    applyFontSizeSettings();
    notifyUISettingsChange();
}

/**
 * UI密度設定を保存して適用
 * @param {string} density - 密度 ('compact', 'normal', 'comfortable', 'spacious')
 */
export function setDensity(density) {
    localStorage.setItem(STORAGE_KEYS.DENSITY, density);

    // レガシーサポート
    if (density === 'compact') {
        localStorage.setItem(SIDEBAR_CONFIG.STORAGE_KEYS.COMPACT, 'true');
    } else {
        localStorage.setItem(SIDEBAR_CONFIG.STORAGE_KEYS.COMPACT, 'false');
    }

    applyDensitySettings();
    notifyUISettingsChange();

    // サイドバー更新イベントも発火
    window.dispatchEvent(new CustomEvent('sidebar-settings-updated', {
        detail: { density }
    }));
}
