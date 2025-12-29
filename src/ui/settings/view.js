/**
 * 設定モーダルのUIコンポーネント
 */

// 背景パターンの定数管理
export const BACKGROUND_PATTERNS = {
    NONE: 'none',
    TEXTURE: 'haikei'
};

// フォントサイズの定数管理 (Tailwindの定義と同期)
export const FONT_SIZES = {
    SMALL: 'sm',
    BASE: 'base',
    MEDIUM: 'md',
    LARGE: 'lg',
    XL: 'xl'
};

// タイムゾーン設定の定数
export const TIMEZONE_OPTIONS = [
    { value: 'Asia/Tokyo', label: '日本 (JST/UTC+9)' },
    { value: 'America/Los_Angeles', label: 'アメリカ・太平洋 (PST/UTC-8)' },
    { value: 'America/New_York', label: 'アメリカ・東部 (EST/UTC-5)' },
    { value: 'Asia/Shanghai', label: '中国・台湾 (CST/UTC+8)' },
    { value: 'Europe/London', label: 'イギリス (GMT/UTC+0)' }
];

import { FONT_OPTIONS, getCurrentFonts } from '../layout/fonts.js';

function createSelectOption(label, options, selectedValue, name) {
    const optionsHtml = options.map(opt =>
        `<option value="${opt.value}" ${opt.value === selectedValue ? 'selected' : ''}>${opt.label}</option>`
    ).join('');

    return `
        <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">${label}</label>
            <div class="relative">
                <select name="${name}" class="w-full pl-3 pr-8 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-shadow">
                    ${optionsHtml}
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
        </div>
    `;
}

function getFontSettingsHTML() {
    const current = getCurrentFonts();
    return `
        <div class="space-y-4">
            ${createSelectOption('英数字フォント', FONT_OPTIONS.EN, current.en, 'font-en-select')}
            ${createSelectOption('日本語フォント', FONT_OPTIONS.JP, current.jp, 'font-jp-select')}
        </div>
    `;
}


function createRadioOption(name, value, label, isChecked, icon = '') {
    return `
        <label class="flex items-center justify-center gap-2 cursor-pointer p-3 border ${isChecked ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300'} rounded-lg transition-all duration-200">
            <input type="radio" name="${name}" value="${value}" class="hidden" ${isChecked ? 'checked' : ''}>
            ${icon}
            <span class="text-sm font-medium">${label}</span>
        </label>
    `;
}

function createAccordionSection(id, title, icon, content, isOpen = false) {
    return `
        <div class="settings-accordion border-b border-gray-100 dark:border-gray-700 last:border-0" data-section="${id}">
            <button class="accordion-header w-full flex items-center justify-between py-4 px-2 focus:outline-none group hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg transition-colors">
                <div class="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">
                    ${icon}
                    ${title}
                </div>
                <svg class="accordion-icon w-5 h-5 text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div class="accordion-content overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}" style="${isOpen ? '' : 'max-height: 0px;'}">
                <div class="pt-2 pb-6 px-2">
                    ${content}
                </div>
            </div>
        </div>
    `;
}


// ... imports ...



export function getSettingsModalHTML(userInitial, userEmail, isCompact) {
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const currentFontSize = localStorage.getItem('fontSize') || FONT_SIZES.MEDIUM;
    const currentBg = localStorage.getItem('background') || BACKGROUND_PATTERNS.NONE;
    const safeInitial = userInitial || '?';
    const currentDensity = localStorage.getItem('sidebar_density') || (isCompact ? 'compact' : 'normal');

    // --- Content Constructions ---

    // タイムゾーン設定の定数 (Moved to top level)

    const appearanceContent = `
        <div class="space-y-6">
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">テーマ</label>
                <div class="grid grid-cols-2 gap-3">
                    ${createRadioOption('app-theme', 'light', 'ライト', currentTheme === 'light', '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>')}
                    ${createRadioOption('app-theme', 'dark', 'ダーク', currentTheme === 'dark', '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>')}
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">背景パターン (ダークモード)</label>
                <div class="grid grid-cols-2 gap-3">
                    ${createRadioOption('bg-pattern', BACKGROUND_PATTERNS.NONE, '無地', currentBg === BACKGROUND_PATTERNS.NONE)}
                    ${createRadioOption('bg-pattern', BACKGROUND_PATTERNS.TEXTURE, 'テクスチャ', currentBg === BACKGROUND_PATTERNS.TEXTURE)}
                </div>
            </div>
            <div>
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">タイムゾーン</label>
                 <div class="relative">
                     ${(() => {
            const currentTimeZone = localStorage.getItem('timezone') || 'Asia/Tokyo';
            return `
                        <select name="timezone-select" class="w-full pl-3 pr-8 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-shadow">
                            ${TIMEZONE_OPTIONS.map(opt => `<option value="${opt.value}" ${opt.value === currentTimeZone ? 'selected' : ''}>${opt.label}</option>`).join('')}
                        </select>
                        `;
        })()}
                    <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">サイドバーとUI密度</label>
                <div class="grid grid-cols-2 gap-3">
                    ${createRadioOption('sidebar-density', 'compact', 'Compact', currentDensity === 'compact')}
                    ${createRadioOption('sidebar-density', 'normal', 'Standard', currentDensity === 'normal')}
                    ${createRadioOption('sidebar-density', 'comfortable', 'Comfortable', currentDensity === 'comfortable')}
                    ${createRadioOption('sidebar-density', 'spacious', 'Spacious', currentDensity === 'spacious')}
                </div>
            </div>
            <div>
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">タスク一覧の表示数</label>
                 <div class="relative">
                     ${(() => {
            const currentVisibleTasks = localStorage.getItem('visible_task_count') || '10';
            return `
                     <select name="visible-task-count" class="w-full pl-3 pr-8 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-shadow">
                        ${[7, 8, 9, 10, 11, 12].map(num => `<option value="${num}" ${String(num) === currentVisibleTasks ? 'selected' : ''}>${num}件</option>`).join('')}
                     </select>
                        `;
        })()}
                     <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                         <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                     </div>
                 </div>
            </div>
        </div>
    `;

    const typographyContent = getFontSettingsHTML();

    const fontSizeContent = `
        <div class="grid grid-cols-5 gap-2">
            ${createRadioOption('font-size', FONT_SIZES.SMALL, 'Small', currentFontSize === FONT_SIZES.SMALL)}
            ${createRadioOption('font-size', FONT_SIZES.BASE, 'Base', currentFontSize === FONT_SIZES.BASE)}
            ${createRadioOption('font-size', FONT_SIZES.MEDIUM, 'Medium', currentFontSize === FONT_SIZES.MEDIUM)}
            ${createRadioOption('font-size', FONT_SIZES.LARGE, 'Large', currentFontSize === FONT_SIZES.LARGE)}
            ${createRadioOption('font-size', FONT_SIZES.XL, 'XL', currentFontSize === FONT_SIZES.XL)}
        </div>
    `;

    const accountContent = `
         <div class="flex items-center gap-3 mb-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                ${safeInitial}
            </div>
            <div>
                <div class="text-sm font-bold text-gray-900 dark:text-white">ログイン中</div>
                <div class="text-xs text-gray-500 font-mono">${userEmail || ''}</div>
            </div>
        </div>
        <div class="space-y-3">
            <div class="flex gap-2">
                <input type="password" id="new-password-input-new" placeholder="新しいパスワード" class="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-shadow">
                <button id="update-password-btn-new" class="px-4 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap">変更</button>
            </div>
            <button id="logout-btn-settings" class="w-full py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium rounded-lg transition-colors text-left flex items-center gap-2 px-2">
                 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                ログアウト
            </button>
        </div>
    `;

    const dataContent = `
        <div class="space-y-3">
            <button id="export-data-btn-new" class="w-full text-left px-4 py-3 bg-white dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all border border-gray-200 dark:border-gray-600 group shadow-sm hover:shadow-md">
                <div class="flex justify-between items-center">
                    <span class="text-sm font-bold text-gray-700 dark:text-gray-200">バックアップを作成</span>
                    <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                </div>
                <div class="text-xs text-gray-500 mt-1">現在の全データをJSON形式でダウンロード</div>
            </button>
            
            <button id="import-data-btn-new" class="w-full text-left px-4 py-3 bg-white dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all border border-gray-200 dark:border-gray-600 group shadow-sm hover:shadow-md">
                 <div class="flex justify-between items-center">
                    <span class="text-sm font-bold text-gray-700 dark:text-gray-200">データを復元</span>
                     <svg class="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                </div>
                <div class="text-xs text-gray-500 mt-1">バックアップファイルからデータを読み込み</div>
            </button>
            <input type="file" id="import-file-input" accept=".json" class="hidden" />
        </div>
    `;

    // --- Accordion Assembly (2 Column) ---
    const html = `
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh] h-full sm:h-auto animate-fade-in-up">
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
