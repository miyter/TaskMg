// テーマ管理ロジック

/**
 * 初期テーマを適用する
 * localStorageの設定、なければシステム設定を確認
 */
export function initTheme() {
    // ローカルストレージに設定があるか、もしくはシステムのダークモード設定を確認
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    updateThemeIcon();
}

/**
 * テーマを切り替える（トグル）
 */
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

/**
 * アイコンの表示を更新する
 */
function updateThemeIcon() {
    const icon = document.getElementById('theme-toggle-icon');
    if (!icon) return;

    if (document.documentElement.classList.contains('dark')) {
        // ダークモード時は「月」を表示
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        // ライトモード時は「太陽」を表示
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}