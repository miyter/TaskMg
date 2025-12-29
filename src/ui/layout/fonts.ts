/**
 * フォント設定の管理と適用
 * TypeScript化: 2025-12-29
 */

interface FontOption {
    value: string;
    label: string;
}

// フォントの選択肢定義
export const FONT_OPTIONS: { EN: FontOption[]; JP: FontOption[] } = {
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
} as const;

const DEFAULTS = {
    EN: 'Inter',
    JP: 'M PLUS 2'
} as const;

/**
 * 保存されたフォント設定を適用する
 */
export function applyFonts(): void {
    const fontEn = localStorage.getItem(STORAGE_KEYS.FONT_EN) || DEFAULTS.EN;
    const fontJp = localStorage.getItem(STORAGE_KEYS.FONT_JP) || DEFAULTS.JP;

    const root = document.documentElement;
    root.style.setProperty('--font-en', `"${fontEn}"`);
    root.style.setProperty('--font-jp', `"${fontJp}"`);
}

/**
 * フォント設定を保存して適用する
 */
export function setFont(type: 'EN' | 'JP', fontName: string): void {
    const key = type === 'EN' ? STORAGE_KEYS.FONT_EN : STORAGE_KEYS.FONT_JP;
    localStorage.setItem(key, fontName);
    applyFonts();
}

/**
 * 現在の設定を取得する
 */
export function getCurrentFonts(): { en: string; jp: string } {
    return {
        en: localStorage.getItem(STORAGE_KEYS.FONT_EN) || DEFAULTS.EN,
        jp: localStorage.getItem(STORAGE_KEYS.FONT_JP) || DEFAULTS.JP
    };
}

/**
 * 文字サイズ設定を適用する
 */
export function applyFontSize(): void {
    const size = localStorage.getItem('fontSize') || 'md'; // default md
    const sizeClasses = ['font-app-sm', 'font-app-md', 'font-app-lg'];
    document.body.classList.remove(...sizeClasses);
    document.body.classList.add(`font-app-${size}`);
}
