// @ts-nocheck
// テーマと表示設定の初期化

export function initTheme() {
    // 1. テーマ設定の復元
    // ローカルストレージまたはシステム設定を確認
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    updateThemeIcon();

    // 2. 文字サイズ設定の復元 (★新規追加)
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    // 既存クラスをクリアしてから追加
    document.body.classList.remove('font-large', 'font-medium', 'font-small');
    document.body.classList.add(`font-${savedFontSize}`);
}

export function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
    } else {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
    }
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.getElementById('theme-toggle-icon');
    
    // ★修正: アイコンが見つからない場合は何もしない（エラー回避）
    if (!icon) return;

    if (document.documentElement.classList.contains('dark')) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}