/**
 * 更新日: 2025-12-21
 * 内容: 初期化エラーハンドリング、ファビコン処理の完全リセット、リスナー二重登録防止
 */
import '../index.css';
import { initializeApp } from './app.js';

let isBootstrapped = false;

/**
 * ブラウザ環境固有のセットアップ
 */
function setupHeadElements() {
    // 既存のアイコンを全削除して一元化
    document.querySelectorAll("link[rel*='icon']").forEach(el => el.remove());

    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = '/images/favicon-96x96.png';
    document.head.appendChild(link);
}

function startApplication() {
    if (isBootstrapped) return;
    isBootstrapped = true;

    try {
        setupHeadElements();
        initializeApp();
    } catch (error) {
        console.error('[Main] Critical Initialization Error:', error);
        // 必要ならユーザー向けの緊急エラーUIをここに
    }
}

// DOM読み込み待機
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApplication);
} else {
    startApplication();
}