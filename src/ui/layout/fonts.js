/**
 * フォント設定の管理と適用
 */

// フォントの選択肢定義
export const FONT_OPTIONS = {
    EN: [
        { value: 'Inter', label: 'Inter (Standard)' },
        { value: 'Roboto Mono', label: 'Roboto Mono (Monospace)' },
        { value: 'Lora', label: 'Lora (Serif)' },
        { value: 'Oswald', label: 'Oswald (Condensed)' }
    ],
    JP: [
        { value: 'M PLUS 2', label: 'M PLUS 2 (Standard)' },
        { value: 'Noto Sans JP', label: 'Noto Sans JP' },
        { value: 'Yu Mincho', label: 'Yu Mincho (Serif)' },
        { value: 'BIZ UDPGothic', label: 'BIZ UDPGothic' }
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
