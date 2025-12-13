// @ts-nocheck
// テーマ管理と背景設定

/**
 * アプリのテーマと背景設定を初期化・適用する
 */
export function initTheme() {
    // 1. テーマの復元
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    // 2. 文字サイズの復元
    const fontSize = localStorage.getItem('fontSize') || 'medium';
    document.body.classList.remove('font-large', 'font-medium', 'font-small');
    document.body.classList.add(`font-${fontSize}`);

    // 3. 背景の適用 → 遅延実行 (Grokレビュー対応)
    // レンダリングタイミングをずらすことで確実に適用させる
    requestAnimationFrame(() => {
        applyBackground();
    });
}

/**
 * テーマ切り替え（必要に応じて外部から呼び出し可能）
 */
export function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
    // テーマ変更に合わせて背景も再評価（ライトモードなら背景画像オフなど）
    applyBackground();
}

/**
 * 背景設定を適用する
 * @param {string|null} forceType - 強制的に適用する背景タイプ (プレビュー用など)
 */
export function applyBackground(forceType = null) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    // 設定値の取得 (引数優先 -> localStorage -> デフォルト'none')
    const bgType = forceType || localStorage.getItem('background') || 'none';
    const isDark = document.documentElement.classList.contains('dark');

    // コンテンツラッパー（オーバーレイ適用対象）
    const contentWrapper = mainContent.querySelector('.max-w-4xl');

    // --- リセット処理 ---
    mainContent.style.backgroundImage = '';
    mainContent.style.backgroundSize = '';
    mainContent.style.backgroundPosition = '';
    mainContent.style.backgroundAttachment = '';
    mainContent.style.backgroundRepeat = '';
    
    // オーバーレイ用クラスを一旦削除
    if (contentWrapper) {
        contentWrapper.classList.remove(
            'bg-white/90', 'dark:bg-gray-900/90', 
            'backdrop-blur-sm', 'p-4', 'sm:p-6', 'rounded-xl', 'shadow-sm'
        );
    }

    // --- 適用処理 ---
    
    // ライトモード時は背景画像を適用しない（要件により）
    // また、設定が 'none' の場合も何もしない（無地＝デフォルトCSS依存）
    if (!isDark || bgType === 'none') {
        return;
    }

    // テクスチャ背景 (haikei)
    if (bgType === 'haikei') {
        mainContent.style.backgroundImage = "url('/images/haikei_black_1.jpg')";
        mainContent.style.backgroundSize = 'cover';
        mainContent.style.backgroundPosition = 'center';
        mainContent.style.backgroundAttachment = 'fixed';
        mainContent.style.backgroundRepeat = 'no-repeat';

        // 可読性確保のためのオーバーレイ追加
        if (contentWrapper) {
            contentWrapper.classList.add(
                'bg-white/90', 'dark:bg-gray-900/90', 
                'backdrop-blur-sm', 'p-4', 'sm:p-6', 'rounded-xl', 'shadow-sm'
            );
        }
    }
}