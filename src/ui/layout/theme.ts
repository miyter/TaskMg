/**
 * 更新日: 2025-12-21
 * 内容: 背景設定のライトモード対応、未使用引数の削除（Grok指摘対応）
 * TypeScript化: 2025-12-29
 */

/**
 * アプリのテーマと文字サイズ、背景設定を初期化・適用する
 */
export function initTheme(): void {
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
export function toggleTheme(): void {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    applyBackground();
}

/**
 * 背景設定をメインコンテンツに適用する
 */
export function applyBackground(): void {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const bgType = localStorage.getItem('background') || 'none';

    // リセット
    mainContent.style.backgroundImage = '';

    if (bgType === 'none') return;

    // 背景パターンの適用 (ライト/ダーク両対応)
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
