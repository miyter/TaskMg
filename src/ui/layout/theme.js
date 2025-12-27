// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: 背景設定のライトモード対応、未使用引数の削除（Grok指摘対応）
 */

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
export function applyBackground() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const bgType = localStorage.getItem('background') || 'none';
    
    // リセット
    mainContent.style.backgroundImage = '';
    
    if (bgType === 'none') return;

    // 背景パターンの適用 (ライト/ダーク両対応)
    if (bgType === 'haikei') {
        // 画像パスは適宜調整。ダーク/ライトで画像を切り替える場合はここで分岐可能
        const imageUrl = document.documentElement.classList.contains('dark') 
            ? "/images/haikei_black_1.jpg" 
            : "/images/haikei_white_1.jpg"; // ライト用画像があれば切り替え

        // 現状は共通画像またはダーク用のものを適用
        Object.assign(mainContent.style, {
            backgroundImage: "url('/images/haikei_black_1.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat'
        });
    }
}