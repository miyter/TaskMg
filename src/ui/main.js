import '../index.css';
import { initializeApp } from './app.js';
import { ASSETS, DOM_IDS } from './layout/ui-view-constants.js';

/**
 * モジュールスコープで初期化状態を管理
 */
let isBootstrapped = false;

/**
 * 起動失敗時のフォールバックUI表示
 */
function showCriticalError(error) {
    const overlay = document.createElement('div');
    overlay.id = DOM_IDS.CRITICAL_ERROR_OVERLAY;
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.9); color: white; display: flex;
        flex-direction: column; align-items: center; justify-content: center;
        z-index: 9999; font-family: sans-serif; text-align: center; padding: 20px;
    `;
    overlay.innerHTML = `
        <h1 style="color: #ff4d4d; margin-bottom: 10px;">Critical Initialization Error</h1>
        <p style="margin-bottom: 20px;">アプリケーションの起動に失敗した。リロードを試してくれ。</p>
        <code id="error-code-box" style="background: #333; padding: 10px; border-radius: 4px; font-size: 12px; display: block; max-width: 80%; overflow-x: auto; margin-bottom: 20px;"></code>
        <button id="error-reload-btn" style="padding: 10px 20px; cursor: pointer; background: #444; border: 1px solid #666; color: white; border-radius: 4px; transition: background 0.2s;">再読み込み</button>
    `;

    // 安全にエラーメッセージを挿入
    const codeBox = overlay.querySelector('#error-code-box');
    if (codeBox) codeBox.textContent = error.message;

    // インライン属性を廃止し、リスナーを登録
    const reloadBtn = overlay.querySelector('#error-reload-btn');
    if (reloadBtn) {
        reloadBtn.addEventListener('click', () => location.reload());
        reloadBtn.addEventListener('mouseover', () => { reloadBtn.style.background = '#555'; });
        reloadBtn.addEventListener('mouseout', () => { reloadBtn.style.background = '#444'; });
    }

    document.body.appendChild(overlay);
}

/**
 * ブラウザ環境のヘッド要素を最適化
 */
function setupHeadElements() {
    // 既存のアイコンをクリーンアップ
    document.querySelectorAll("link[rel*='icon']").forEach(el => el.remove());

    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = ASSETS.FAVICON;
    document.head.appendChild(link);
}

/**
 * アプリケーションの非同期起動
 */
async function startApplication() {
    if (isBootstrapped) return;
    isBootstrapped = true;

    try {
        setupHeadElements();
        // initializeAppの非同期完了を待機
        await initializeApp();
    } catch (error) {
        console.error('[Main] Critical Initialization Error:', error);
        showCriticalError(error);
    }
}

// エントリーポイントの実行制御
(() => {
    if (document.readyState === 'loading') {
        const handler = () => {
            document.removeEventListener('DOMContentLoaded', handler);
            startApplication();
        };
        document.addEventListener('DOMContentLoaded', handler);
    } else {
        startApplication();
    }
})();