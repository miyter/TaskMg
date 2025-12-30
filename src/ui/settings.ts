import { openSettingsModal } from '../store/ui/modal-store';
import { applyFonts, applyFontSize } from './layout/fonts';

let isInitialized = false;

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
            openSettingsModal();
        }
    };

    document.addEventListener('click', handleSettingsClick);
    isInitialized = true;
}

/**
 * 設定モーダルの表示実行
 */
export function showSettingsModal(): void {
    openSettingsModal();
}
