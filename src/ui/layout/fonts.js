/**
 * フォント設定の管理と適用
 */

// フォントの選択肢定義
export const FONT_OPTIONS = {
    EN: [
        { value: 'Inter', label: 'Inter' },
        { value: 'Roboto', label: 'Roboto' },
        { value: 'Segoe UI', label: 'Segoe UI' },
        { value: '-apple-system, BlinkMacSystemFont, "San Francisco", "Helvetica Neue", sans-serif', label: 'San Francisco' },
        { value: '"Google Sans", "Open Sans"', label: 'Google Sans' }
    ],
    JP: [
        { value: '"Hiragino Kaku Gothic ProN", "Hiragino Sans"', label: 'ヒラギノ角ゴ' },
        { value: '"Noto Sans JP"', label: 'Noto Sans JP' },
        { value: '"LINE Seed JP"', label: 'LINE Seed JP' },
        { value: '"M PLUS 2"', label: 'M PLUS 2' },
        { value: '"BIZ UDPGothic"', label: 'BIZ UDPゴシック' }
    ]
};

const STORAGE_KEYS = {
    FONT_EN: 'font_family_en',
    FONT_JP: 'font_family_jp'
};

const DEFAULTS = {
    EN: 'Inter',
    JP: 'M PLUS 2'
};

/**
 * 保存されたフォント設定を適用する
 */
export function applyFonts() {
    const fontEn = localStorage.getItem(STORAGE_KEYS.FONT_EN) || DEFAULTS.EN;
    const fontJp = localStorage.getItem(STORAGE_KEYS.FONT_JP) || DEFAULTS.JP;

    const root = document.documentElement;
    root.style.setProperty('--font-en', `"${fontEn}"`);
    root.style.setProperty('--font-jp', `"${fontJp}"`);
}

/**
 * フォント設定を保存して適用する
 * @param {string} type - 'EN' or 'JP'
 * @param {string} fontName 
 */
export function setFont(type, fontName) {
    const key = type === 'EN' ? STORAGE_KEYS.FONT_EN : STORAGE_KEYS.FONT_JP;
    localStorage.setItem(key, fontName);
    applyFonts();
}

/**
 * 現在の設定を取得する
 */
export function getCurrentFonts() {
    return {
        en: localStorage.getItem(STORAGE_KEYS.FONT_EN) || DEFAULTS.EN,
        jp: localStorage.getItem(STORAGE_KEYS.FONT_JP) || DEFAULTS.JP
    };
}

/**
 * 文字サイズ設定を適用する
 */
export function applyFontSize() {
    const size = localStorage.getItem('fontSize') || 'md'; // default md
    const sizeClasses = ['font-app-sm', 'font-app-md', 'font-app-lg'];
    document.body.classList.remove(...sizeClasses);
    document.body.classList.add(`font-app-${size}`);
}
