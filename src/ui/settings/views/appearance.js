import { createRadioOption, createSelectOption } from './components';

export const BACKGROUND_PATTERNS = {
    NONE: 'none',
    TEXTURE: 'haikei'
};

export const TIMEZONE_OPTIONS = [
    { value: 'Asia/Tokyo', label: '日本 (JST/UTC+9)' },
    { value: 'America/Los_Angeles', label: 'アメリカ・太平洋 (PST/UTC-8)' },
    { value: 'America/New_York', label: 'アメリカ・東部 (EST/UTC-5)' },
    { value: 'Asia/Shanghai', label: '中国・台湾 (CST/UTC+8)' },
    { value: 'Europe/London', label: 'イギリス (GMT/UTC+0)' }
];

export function getAppearanceContent(currentTheme, currentBg, currentDensity, isCompact) {
    const densityValue = currentDensity || (isCompact ? 'compact' : 'normal');

    return `
        <div class="space-y-6">
            <div>
                <div class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">テーマ</div>
                <div class="grid grid-cols-2 gap-3">
                    ${createRadioOption('app-theme', 'light', 'ライト', currentTheme === 'light', '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>')}
                    ${createRadioOption('app-theme', 'dark', 'ダーク', currentTheme === 'dark', '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>')}
                </div>
            </div>
            <div>
                <div class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">背景パターン (ダークモード)</div>
                <div class="grid grid-cols-2 gap-3">
                    ${createRadioOption('bg-pattern', BACKGROUND_PATTERNS.NONE, '無地', currentBg === BACKGROUND_PATTERNS.NONE)}
                    ${createRadioOption('bg-pattern', BACKGROUND_PATTERNS.TEXTURE, 'テクスチャ', currentBg === BACKGROUND_PATTERNS.TEXTURE)}
                </div>
            </div>
            <div>
                 <label for="timezone-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">タイムゾーン</label>
                 <div class="relative">
                     ${(() => {
            const currentTimeZone = localStorage.getItem('timezone') || 'Asia/Tokyo';
            return `
                        <select id="timezone-select" name="timezone-select" class="w-full pl-3 pr-8 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-shadow">
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
                <div class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">サイドバーとUI密度</div>
                <div class="grid grid-cols-2 gap-3">
                    ${createRadioOption('sidebar-density', 'compact', 'Compact', densityValue === 'compact')}
                    ${createRadioOption('sidebar-density', 'normal', 'Standard', densityValue === 'normal')}
                    ${createRadioOption('sidebar-density', 'comfortable', 'Comfortable', densityValue === 'comfortable')}
                    ${createRadioOption('sidebar-density', 'spacious', 'Spacious', densityValue === 'spacious')}
                </div>
            </div>
            <div>
                 <label for="visible-task-count" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">タスク一覧の表示数</label>
                 <div class="relative">
                     ${(() => {
            const currentVisibleTasks = localStorage.getItem('visible_task_count') || '10';
            return `
                     <select id="visible-task-count" name="visible-task-count" class="w-full pl-3 pr-8 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-shadow">
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
}
