// @ts-nocheck
// @miyter:20251221
// テーマ管理（ライト/ダーク）と背景設定の適用

/**
 * アプリのテーマと文字サイズ、背景設定を初期化・適用する
 */
export function initTheme() {
    // 1. テーマ (システム設定またはLocalStorage)
    const isDark = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);

    // 2. 文字サイズ
    const fontSize = localStorage.getItem('fontSize') || 'medium';
    document.body.classList.remove('font-large', 'font-medium', 'font-small');
    document.body.classList.add(`font-${fontSize}`);

    // 3. 背景
    applyBackground();
}

/**
 * テーマの切り替えを実行
 */
export function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    applyBackground();
}

/**
 * 背景設定をメインコンテンツに適用する
 */
export function applyBackground(forceType = null) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const bgType = forceType || localStorage.getItem('background') || 'none';
    const isDark = document.documentElement.classList.contains('dark');

    // リセット（デフォルトはCSSで定義されていることを前提）
    mainContent.style.backgroundImage = '';
    
    // 背景適用の条件チェック（ダークモード時のみ適用など）
    if (!isDark || bgType === 'none') return;

    // 特定のパターン（テクスチャなど）の適用
    if (bgType === 'haikei') {
        Object.assign(mainContent.style, {
            backgroundImage: "url('/images/haikei_black_1.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat'
        });
    }
}