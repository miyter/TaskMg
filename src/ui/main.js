// @miyter:20251221
// Webアプリケーションの物理的な開始点

import '../index.css';
import { initializeApp } from './app.js';

/**
 * ブラウザ環境固有のセットアップ（ファビコン等）
 */
function setupBrowserEnvironment() {
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.type = 'image/png';
    link.href = '/images/favicon-96x96.png';
}

// DOMの読み込み完了を待機してアプリを起動
document.addEventListener('DOMContentLoaded', () => {
    // 1. ブラウザ環境の調整
    setupBrowserEnvironment();

    // 2. アプリケーションロジックの開始
    initializeApp();
});