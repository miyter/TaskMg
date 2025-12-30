/**
 * 設定画面の制御
 */
import { auth } from '../core/firebase';
import { SIDEBAR_CONFIG } from './features/sidebar/sidebar-constants';
import { isSidebarCompact } from './features/sidebar/sidebar-utils';
import { applyFonts, applyFontSize } from './layout/fonts';
import { setupSettingsEvents } from './settings/handlers';
import { getSettingsModalHTML } from './settings/view';

let isInitialized = false;

// ...
/**
 * 既存の設定モーダルを削除
 */
function closeSettingsModal(): void {
    document.getElementById(SIDEBAR_CONFIG.MODAL_IDS.SETTINGS)?.remove();
}

/**
 * 設定画面の初期化
 */
export function initSettings(): void {
    if (isInitialized) return;

    // フォント適用の初期化
    applyFonts();
    applyFontSize();

    const handleSettingsClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('#nav-settings')) {
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
export function showSettingsModal(): void {
    closeSettingsModal();

    const isCompact = isSidebarCompact();
    const user = auth.currentUser;
    const email = user?.email || '匿名ユーザー';
    const initial = (email[0] || '?').toUpperCase();

    const overlay = document.createElement('div');
    overlay.id = SIDEBAR_CONFIG.MODAL_IDS.SETTINGS;
    overlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in';

    overlay.innerHTML = getSettingsModalHTML(initial, email, isCompact);
    document.body.appendChild(overlay);

    setupSettingsEvents(overlay, closeSettingsModal);
}
