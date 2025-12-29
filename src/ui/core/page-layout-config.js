/**
 * ページレイアウト設定の一元管理
 * スクロールしないページの高さ制限を統一
 */

// ページタイプの定義
export const PAGE_TYPES = {
    // スクロールしないページ（700px固定）
    NO_SCROLL: 'no-scroll',
    // スクロールするページ（制限なし）
    SCROLLABLE: 'scrollable'
};

// ページ別の設定
export const PAGE_CONFIGS = {
    // スクロールしないページ（700px制限）
    'wizard': {
        type: PAGE_TYPES.NO_SCROLL,
        maxHeight: '700px',
        container: 'max-w-6xl mx-auto px-4 h-full max-h-[700px] flex flex-col'
    },
    'dashboard': {
        type: PAGE_TYPES.NO_SCROLL,
        maxHeight: '700px',
        container: 'max-w-6xl mx-auto px-4 h-full max-h-[700px] flex flex-col'
    },
    'search': {
        type: PAGE_TYPES.NO_SCROLL,
        maxHeight: '700px',
        container: 'max-w-6xl mx-auto px-4 h-full max-h-[700px] flex flex-col'
    },

    // スクロールするページ（制限なし）
    'target-dashboard': {
        type: PAGE_TYPES.SCROLLABLE,
        maxHeight: 'none',
        container: 'h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden'
    },
    'wiki': {
        type: PAGE_TYPES.SCROLLABLE,
        maxHeight: 'none',
        container: 'h-full overflow-y-auto custom-scrollbar'
    }
};

// レイアウトクラスの取得
export function getPageContainerClass(pageName) {
    const config = PAGE_CONFIGS[pageName];
    return config ? config.container : PAGE_CONFIGS.dashboard.container;
}

// ページタイプの取得
export function getPageType(pageName) {
    const config = PAGE_CONFIGS[pageName];
    return config ? config.type : PAGE_TYPES.NO_SCROLL;
}

// 最大高さの取得
export function getPageMaxHeight(pageName) {
    const config = PAGE_CONFIGS[pageName];
    return config ? config.maxHeight : '700px';
}

// スクロールしないページかどうかを判定
export function isNoScrollPage(pageName) {
    return getPageType(pageName) === PAGE_TYPES.NO_SCROLL;
}

// 共通のスペーシング設定
export const SPACING = {
    // スクロールしないページ用（コンパクト）
    NO_SCROLL: {
        headerMb: 'mb-4',
        sectionMb: 'mb-6',
        contentPadding: 'p-8',
        buttonPadding: 'px-6 py-3',
        iconSize: 'w-4 h-4',
        textSm: 'text-xs',
        textBase: 'text-sm'
    },
    // スクロールするページ用（通常）
    SCROLLABLE: {
        headerMb: 'mb-8',
        sectionMb: 'mb-10',
        contentPadding: 'p-12',
        buttonPadding: 'px-8 py-4',
        iconSize: 'w-5 h-5',
        textSm: 'text-sm',
        textBase: 'text-base'
    }
};

// ページ用のスペーシング設定を取得
export function getPageSpacing(pageName) {
    const type = getPageType(pageName);
    return type === PAGE_TYPES.NO_SCROLL ? SPACING.NO_SCROLL : SPACING.SCROLLABLE;
}
