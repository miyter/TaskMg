/**
 * デザインシステム - タイポグラフィとスペーシングの統一管理
 * 
 * 設計思想:
 * - コンパクトでスタイリッシュ
 * - モダンデザイン
 * - スクロールしない（700px以内）
 * - 目線の位置を固定
 * - 文字サイズの統一（見出しレベルとテキストで分類）
 * - 設定変更時は一括適用
 */

// ========================================
// タイポグラフィ階層
// ========================================

/**
 * 見出しレベル（Heading Levels）
 * サービス全体で統一された見出しサイズ
 */
export const TYPOGRAPHY = {
    // 見出しレベル
    HEADING: {
        H1: 'text-xl font-bold',           // 最大見出し（ページタイトル）
        H2: 'text-lg font-bold',           // セクション見出し
        H3: 'text-base font-bold',         // サブセクション見出し
        H4: 'text-sm font-bold',           // 小見出し
    },

    // テキストレベル
    TEXT: {
        LARGE: 'text-base',                // 大きめのテキスト
        NORMAL: 'text-sm',                 // 通常テキスト（デフォルト）
        SMALL: 'text-xs',                  // 小さめのテキスト
        TINY: 'text-[10px]',               // 極小テキスト（ラベル等）
    },

    // 特殊用途
    SPECIAL: {
        MONO: 'font-mono tabular-nums',    // 数字表示
        LABEL: 'text-xs font-bold uppercase tracking-wider', // ラベル
        CAPTION: 'text-xs text-gray-500 dark:text-gray-400', // キャプション
    }
};

/**
 * スペーシング（Spacing）
 * コンパクトなレイアウトのための統一スペーシング
 */
export const SPACING = {
    // 垂直方向のスペーシング
    VERTICAL: {
        SECTION: 'mb-6',      // セクション間
        BLOCK: 'mb-4',        // ブロック間
        ITEM: 'mb-2',         // アイテム間
        TIGHT: 'mb-1',        // 密接なアイテム間
    },

    // 水平方向のスペーシング
    HORIZONTAL: {
        SECTION: 'gap-6',     // セクション間
        BLOCK: 'gap-4',       // ブロック間
        ITEM: 'gap-2',        // アイテム間
        TIGHT: 'gap-1',       // 密接なアイテム間
    },

    // パディング
    PADDING: {
        LARGE: 'p-6',         // 大きなコンテナ
        MEDIUM: 'p-4',        // 中サイズコンテナ
        SMALL: 'p-3',         // 小さなコンテナ
        COMPACT: 'p-2',       // コンパクトなコンテナ
        MINIMAL: 'p-1',       // 最小パディング
    }
};

/**
 * レイアウト制約
 * スクロールしないデザインのための高さ制限
 */
export const LAYOUT = {
    // 画面全体の制約
    MAX_HEIGHT: '700px',
    MAX_HEIGHT_CLASS: 'max-h-[700px]',

    // ヘッダー・フッター
    HEADER_HEIGHT: 'h-12',
    FOOTER_HEIGHT: 'h-12',

    // コンテンツエリア
    CONTENT_HEIGHT: 'h-[676px]', // 700px - 12px(header) - 12px(footer)

    // コンテナ幅
    CONTAINER: {
        NARROW: 'max-w-3xl',   // 狭いコンテナ
        NORMAL: 'max-w-4xl',   // 通常コンテナ
        WIDE: 'max-w-5xl',     // 広いコンテナ
        FULL: 'max-w-6xl',     // 最大幅
    }
};

/**
 * アイコンサイズ
 * 統一されたアイコンサイズ
 */
export const ICON_SIZE = {
    TINY: 'w-3 h-3',
    SMALL: 'w-4 h-4',
    NORMAL: 'w-5 h-5',
    MEDIUM: 'w-6 h-6',
    LARGE: 'w-8 h-8',
};

// ========================================
// 設定による動的変更
// ========================================

/**
 * フォントサイズ設定のマッピング
 * ユーザーが設定を変更した際に、各レベルのサイズを一括変更
 */
export const FONT_SIZE_PRESETS = {
    // 極小設定
    xs: {
        H1: 'text-lg',
        H2: 'text-base',
        H3: 'text-sm',
        H4: 'text-xs',
        LARGE: 'text-sm',
        NORMAL: 'text-xs',
        SMALL: 'text-[10px]',
    },

    // 小設定
    sm: {
        H1: 'text-xl',
        H2: 'text-lg',
        H3: 'text-base',
        H4: 'text-sm',
        LARGE: 'text-base',
        NORMAL: 'text-sm',
        SMALL: 'text-xs',
    },

    // 通常設定（デフォルト）
    md: {
        H1: 'text-2xl',
        H2: 'text-xl',
        H3: 'text-lg',
        H4: 'text-base',
        LARGE: 'text-lg',
        NORMAL: 'text-base',
        SMALL: 'text-sm',
    },

    // 大設定
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

/**
 * 現在のフォントサイズ設定を取得
 */
export function getCurrentFontSizePreset() {
    const fontSize = localStorage.getItem('fontSize') || 'sm'; // デフォルトは'sm'（コンパクト）
    return FONT_SIZE_PRESETS[fontSize] || FONT_SIZE_PRESETS.sm;
}

/**
 * フォントサイズ設定を適用
 */
export function applyFontSizePreset(preset) {
    localStorage.setItem('fontSize', preset);

    // CSSカスタムプロパティとして設定
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

    // UI更新イベントを発火
    window.dispatchEvent(new CustomEvent('font-size-changed', { detail: { preset } }));
}

// ========================================
// ユーティリティ関数
// ========================================

/**
 * 見出しクラスを取得
 */
export function getHeadingClass(level) {
    return TYPOGRAPHY.HEADING[level] || TYPOGRAPHY.HEADING.H3;
}

/**
 * テキストクラスを取得
 */
export function getTextClass(size = 'NORMAL') {
    return TYPOGRAPHY.TEXT[size] || TYPOGRAPHY.TEXT.NORMAL;
}

/**
 * スペーシングクラスを取得
 */
export function getSpacingClass(type, direction = 'VERTICAL') {
    return SPACING[direction][type] || SPACING.VERTICAL.ITEM;
}

// ========================================
// 初期化
// ========================================

/**
 * デザインシステムを初期化
 */
export function initDesignSystem() {
    const currentPreset = localStorage.getItem('fontSize') || 'sm';
    applyFontSizePreset(currentPreset);
}
