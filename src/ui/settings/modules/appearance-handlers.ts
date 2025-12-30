import { applyBackground } from '../../layout/theme';
import { setupRadioGroupHandler } from './common-handlers';

export function setupAppearanceHandlers(): void {
    // テーマ設定
    setupRadioGroupHandler('app-theme', 'theme', (val) => {
        document.documentElement.classList.toggle('dark', val === 'dark');
        applyBackground();
    });

    // 背景パターン
    setupRadioGroupHandler('bg-pattern', 'background', () => applyBackground());
}
