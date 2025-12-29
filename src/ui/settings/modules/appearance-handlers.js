import { setupRadioGroupHandler } from './common-handlers.js';
import { applyBackground } from '../../layout/theme.js';

export function setupAppearanceHandlers() {
    // テーマ設定
    setupRadioGroupHandler('app-theme', 'theme', (val) => {
        document.documentElement.classList.toggle('dark', val === 'dark');
        applyBackground();
    });

    // 背景パターン
    setupRadioGroupHandler('bg-pattern', 'background', () => applyBackground());
}
