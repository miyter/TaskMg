/**
 * 設定モーダルのUIコンポーネント (エントリポイント)
 */
import { UI_STYLES } from '../core/ui-style-constants.js';
import { createAccordionSection } from './views/components.js';
import { getAppearanceContent, BACKGROUND_PATTERNS } from './views/appearance.js';
import { getTypographyContent, getFontSizeContent, FONT_SIZES } from './views/typography.js';
import { getDataContent } from './views/data.js';
import { getAccountContent } from './views/account.js';

// エクスポート: 定数はここから再エクスポート
export { BACKGROUND_PATTERNS } from './views/components.js';
export { FONT_SIZES } from './views/typography.js';

export function getSettingsModalHTML(userInitial, userEmail, isCompact) {
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const currentFontSize = localStorage.getItem('fontSize') || FONT_SIZES.MEDIUM;
    const currentBg = localStorage.getItem('background') || BACKGROUND_PATTERNS.NONE;
    const currentDensity = localStorage.getItem('sidebar_density'); // isCompactはappearance内部で処理

    // 各セクションのコンテンツ生成
    const appearanceContent = getAppearanceContent(currentTheme, currentBg, currentDensity, isCompact);
    const typographyContent = getTypographyContent();
    const fontSizeContent = getFontSizeContent(currentFontSize);
    const dataContent = getDataContent();
    const accountContent = getAccountContent(userInitial, userEmail);

    // --- Accordion Assembly (2 Column) ---
    const html = `
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl ${UI_STYLES.MODAL.WIDTH.DEFAULT} overflow-hidden flex flex-col max-h-[90vh] h-full sm:h-auto animate-fade-in-up">
            <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 z-10 sticky top-0">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Settings</h3>
                <button id="close-settings-modal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>

            <div class="overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-gray-800">
                <div class="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <!-- Left Column -->
                    <div class="space-y-0">
                        ${createAccordionSection('appearance', 'Appearance', '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>', appearanceContent, true)}
                        ${createAccordionSection('data', 'Data Management', '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>', dataContent)}
                    </div>

                    <!-- Right Column -->
                    <div class="space-y-0">
                        ${createAccordionSection('typography', 'Typography', '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>', typographyContent)}
                        ${createAccordionSection('fontsize', 'Font Size', '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>', fontSizeContent)}
                        ${createAccordionSection('account', 'Account', '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>', accountContent)}
                    </div>
                </div>
            </div>
        </div>
    `;
    return html;
}
