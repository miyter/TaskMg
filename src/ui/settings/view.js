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
    BASE: 'base', // Added base size
    MEDIUM: 'md',
    LARGE: 'lg',
    XL: 'xl'      // Added xl size
};

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

// ... imports ...

export function getSettingsModalHTML(userInitial, userEmail, isCompact) {
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const currentFontSize = localStorage.getItem('fontSize') || FONT_SIZES.MEDIUM;
    const currentBg = localStorage.getItem('background') || BACKGROUND_PATTERNS.NONE;
    const safeInitial = userInitial || '?';

    // 2-column layout sections
    const leftColumn = `
        <section class="mb-8">
            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Appearance</h4>
            
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
                     <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">サイドバー密度</label>
                    <div class="grid grid-cols-2 gap-3">
                        ${createRadioOption('sidebar-density', 'normal', '通常', !isCompact)}
                        ${createRadioOption('sidebar-density', 'compact', 'コンパクト', isCompact)}
                    </div>
                </div>
            </div>
        </section>

        <section>
            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Typography</h4>
             ${getFontSettingsHTML()}
        </section>
    `;

    const rightColumn = `
        <section class="mb-8">
            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Font Size</h4>
            <div class="space-y-2">
                 <!-- 5-step font size control -->
                 <div class="flex flex-col gap-2">
                    ${createRadioOption('font-size', FONT_SIZES.XL, '特大 (XL)', currentFontSize === FONT_SIZES.XL)}
                    ${createRadioOption('font-size', FONT_SIZES.LARGE, '大 (Large)', currentFontSize === FONT_SIZES.LARGE)}
                    ${createRadioOption('font-size', FONT_SIZES.MEDIUM, '標準 (Medium)', currentFontSize === FONT_SIZES.MEDIUM)}
                    ${createRadioOption('font-size', FONT_SIZES.BASE, 'やや小 (Base)', currentFontSize === FONT_SIZES.BASE)}
                    ${createRadioOption('font-size', FONT_SIZES.SMALL, '小 (Small)', currentFontSize === FONT_SIZES.SMALL)}
                 </div>
            </div>
        </section>

         <section class="mb-8">
            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Account</h4>
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
        </section>

        <section>
            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Data Management</h4>
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
        </section>
    `;

    return `
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh] h-full sm:h-auto animate-fade-in-up">
            <div class="px-8 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 z-10">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Settings</h3>
                <button id="close-settings-modal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>

            <div class="p-8 overflow-y-auto custom-scrollbar flex-1 bg-gray-50/50 dark:bg-gray-900/20">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div>${leftColumn}</div>
                     <div>${rightColumn}</div>
                </div>
            </div>
        </div>
    `;
}