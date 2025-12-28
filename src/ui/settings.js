/**
 * 設定画面の制御
 */
import { auth } from '../core/firebase.js';
import { getSettingsModalHTML } from './settings/view.js';
import { setupSettingsEvents } from './settings/handlers.js';
import { SIDEBAR_CONFIG } from './features/sidebar/sidebar-constants.js';
import { isSidebarCompact } from './features/sidebar/sidebar-utils.js';
import { applyFonts, applyFontSize } from './layout/fonts.js';

let isInitialized = false;

// ...

/**
 * 設定画面の初期化
 */
export function initSettings() {
    if (isInitialized) return;

    // フォント適用の初期化
    applyFonts();
    applyFontSize();

    const handleSettingsClick = (e) => {
        if (e.target.closest('#nav-settings')) {
            e.preventDefault();
            showSettingsModal();
        }
    };

    document.addEventListener('click', handleSettingsClick);
    isInitialized = true;
}

/**
 * 設定モーダルの表示実行
 */
export function showSettingsModal() {
    closeSettingsModal();

    const isCompact = isSidebarCompact();
    const user = auth.currentUser;
    const email = user?.email || '匿名ユーザー';
    const initial = (email[0] || '?').toUpperCase();

    const overlay = document.createElement('div');
    overlay.id = SIDEBAR_CONFIG.MODAL_IDS.SETTINGS;
    overlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in';

    overlay.innerHTML = getSettingsModalHTML(initial, email, isCompact);
    document.body.appendChild(overlay);

    setupSettingsEvents(overlay, closeSettingsModal);
}