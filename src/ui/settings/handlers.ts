/**
 * 設定モーダルのイベントハンドラ統括
 */
import { setupLogoutHandler, setupPasswordHandler } from './modules/account-handlers';
import { setupAppearanceHandlers } from './modules/appearance-handlers';
import { setupAccordionHandlers } from './modules/common-handlers';
import { setupExportHandler, setupImportHandler } from './modules/data-handlers';
import { setupLanguageHandler } from './modules/language-handlers';
import { setupDensityHandler, setupFontHandlers, setupTimezoneHandler, setupVisibleTaskCountHandler } from './modules/ui-handlers';

export function setupSettingsEvents(modalOverlay: HTMLElement, closeModal: () => void): void {
    // 閉じる処理の統合
    const closers = ['close-settings-modal', 'close-settings-footer'];
    closers.forEach(id => document.getElementById(id)?.addEventListener('click', closeModal));

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // モジュールごとのセットアップ実行
    setupAppearanceHandlers();
    setupDensityHandler();
    setupVisibleTaskCountHandler();
    setupFontHandlers();
    setupTimezoneHandler();

    setupLanguageHandler();

    setupExportHandler();
    setupImportHandler();

    setupPasswordHandler();
    setupLogoutHandler(closeModal);

    // アコーディオン制御（最後に実行）
    setupAccordionHandlers();
}
