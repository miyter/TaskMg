// @miyter:20251125
// Vite導入後、アプリケーションのエントリーポイントとして機能。

// --- CSSインポート ---
import "../index.css"; 

// --- モジュールインポート ---
import { initAuthListener } from '@/core/auth.js';
import { initAuthUI, updateAuthUI } from './auth.js';
import { renderTaskList } from './task-view.js'; 
import { renderModals } from './components.js';
import { initTheme, toggleTheme } from './theme.js';
import { initializeApp } from './app.js';
import { initTaskModal } from './task-modal.js';
import { renderLayout } from './layout.js';

// アプリ初期化
document.addEventListener('DOMContentLoaded', () => {
    // 1. レイアウトの描画 (div#appの中にHTMLを生成)
    const appContainer = document.getElementById('app');
    
    // ★修正: 要素が見つからない場合はエラーログを出して終了（null参照エラー回避）
    if (!appContainer) {
        console.error("Fatal Error: #app element not found in DOM.");
        return;
    }
    
    renderLayout(appContainer);

    // 2. テーマの初期化
    initTheme();

    // 3. テーマ切り替えボタンのイベントリスナー（レイアウト生成後に取得）
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // 4. 共通モーダルの初期化
    renderModals();
    initTaskModal(); 
    
    // 5. 認証初期化
    initAuthUI();
    
    initAuthListener(
        (user) => {
            updateAuthUI(user);
            initializeApp(user.uid);
        },
        () => {
            updateAuthUI(null);
            renderTaskList([], null);
        }
    );
});