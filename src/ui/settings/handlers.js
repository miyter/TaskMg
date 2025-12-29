/**
 * 設定モーダルのイベントハンドラ統括
 */
import { setupDensityHandler, setupFontHandlers, setupVisibleTaskCountHandler, setupTimezoneHandler } from './modules/ui-handlers.js';
import { setupAppearanceHandlers } from './modules/appearance-handlers.js';
import { setupExportHandler, setupImportHandler } from './modules/data-handlers.js';
import { setupPasswordHandler, setupLogoutHandler } from './modules/account-handlers.js';
import { setupAccordionHandlers } from './modules/common-handlers.js';

export function setupSettingsEvents(modalOverlay, closeModal) {
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

    setupExportHandler();
    setupImportHandler();

    setupPasswordHandler();
    setupLogoutHandler(closeModal);

    // アコーディオン制御（最後に実行）
    setupAccordionHandlers();
}