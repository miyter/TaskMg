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
// ★追加: アプリロジックをインポート
import { initializeApp } from './app.js';

// アプリ初期化
document.addEventListener('DOMContentLoaded', () => {
    // テーマの初期化
    initTheme();

    // テーマ切り替えボタンのイベントリスナー
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // 共通モーダルをDOMに挿入
    renderModals();
    
    initAuthUI();
    
    // 認証リスナーの開始
    initAuthListener(
        // ログイン時
        (user) => {
            updateAuthUI(user);
            // ★変更: app.js の初期化ロジックを呼び出し
            initializeApp(user.uid);
        },
        // ログアウト時
        () => {
            updateAuthUI(null);
            // 画面クリア
            renderTaskList([], null);
        }
    );
});