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

    // 3. 背景の適用
    requestAnimationFrame(() => {
        applyBackground();
    });
}

/**
 * テーマ切り替え
 */
export function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
    applyBackground();
}

/**
 * 背景設定を適用する
 * @param {string|null} forceType
 */
export function applyBackground(forceType = null) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const bgType = forceType || localStorage.getItem('background') || 'none';
    const isDark = document.documentElement.classList.contains('dark');

    // --- リセット処理 ---
    mainContent.style.backgroundImage = '';
    mainContent.style.backgroundSize = '';
    mainContent.style.backgroundPosition = '';
    mainContent.style.backgroundAttachment = '';
    mainContent.style.backgroundRepeat = '';
    
    // ★重要変更: 
    // コンテンツラッパー(.max-w-4xl)へのオーバーレイクラス強制適用を廃止。
    // 各UIコンポーネント(GlassCard)が個別に背景スタイルを持つ形に移行したため、
    // ここで全体を上書きするとデザインが崩れる原因となる。
    // 背景画像の適用のみを責務とする。

    // --- 適用処理 ---
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
    }
}