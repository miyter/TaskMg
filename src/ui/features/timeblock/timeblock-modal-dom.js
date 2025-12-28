/**
 * モーダルおよび行要素のHTML構造生成
 * @update 2025-12-28 Custom Selects & Global Color Picker support for Premium Design
 */

// 時間選択肢のキャッシュ
const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTE_OPTIONS = ['00', '15', '30', '45'];

const generateOptions = (options, selected) =>
    options.map(val => `<option value="${val}" ${val === selected ? 'selected' : ''}>${val}</option>`).join('');

export function buildModalSkeletonHTML() {
    return `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] relative">
            <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white">時間帯設定</h3>
                <button id="close-tb-modal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            <div class="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar relative" id="tb-scroll-container">
                <div id="tb-list" class="divide-y divide-gray-100 dark:divide-gray-700 space-y-2"></div>
                <button id="add-tb-btn" class="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"></button>
                <div class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span class="w-3 h-3 rounded-full bg-gray-400 mr-3"></span>
                    <span class="font-bold mr-2 text-gray-700 dark:text-gray-300">未定</span>
                    <span class="text-xs">デフォルトのゾーンです（削除不可）</span>
                </div>
            </div>
            <div class="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-900/50 flex justify-end">
                <button id="close-tb-footer" class="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-all active:scale-95 shadow-md">完了（保存）</button>
            </div>

            <!-- Global Color Picker Popover (Hidden by default) -->
            <div id="tb-color-picker" class="hidden absolute z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 w-64 animate-fade-in-up">
                <div class="text-xs font-bold text-gray-500 mb-2 uppercase">基本カラー</div>
                <div class="grid grid-cols-5 gap-2 mb-4" id="tb-color-presets">
                    <!-- Presets injected by JS -->
                </div>
                <div class="flex justify-between items-center mb-2">
                    <div class="text-xs font-bold text-gray-500 uppercase">カスタム</div>
                    <button id="tb-custom-color-edit-btn" class="text-xs text-blue-500 hover:underline">色を変更</button>
                    <input type="color" id="tb-custom-color-input" class="invisible w-0 h-0 absolute">
                </div>
                <div class="grid grid-cols-5 gap-2" id="tb-color-customs">
                    <!-- Custom slots injected by JS -->
                </div>
            </div>
        </div>
    `;
}

// Custom Select Builder
function buildCustomSelect(options, value, type) {
    const listHtml = options.map(opt =>
        `<div class="tb-select-option px-3 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/50 cursor-pointer text-sm ${opt === value ? 'bg-blue-50/50 font-bold' : ''}" data-value="${opt}">${opt}</div>`
    ).join('');

    return `
        <div class="relative tb-custom-select group" data-type="${type}" data-value="${value}">
            <button type="button" class="tb-select-trigger w-12 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-center shadow-sm hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all flex items-center justify-between px-2">
                <span class="value-display w-full text-center">${value}</span>
            </button>
            <div class="hidden tb-select-options absolute top-full left-0 mt-1 w-full min-w-[60px] max-h-48 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20 custom-scrollbar">
                ${listHtml}
            </div>
        </div>
    `;
}

export function buildRowHTML(data) {
    const [sH, sM] = data.start.split(':');
    const [eH, eM] = data.end.split(':');

    return `
        <div class="flex-shrink-0 relative">
            <button type="button" class="tb-color-trigger w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm hover:scale-110 transition-transform focus:outline-none ring-2 ring-transparent focus:ring-blue-400" 
                style="background-color: ${data.color}" data-color="${data.color}" title="色を変更"></button>
        </div>
        <div class="flex-1 flex items-center gap-2">
            <div class="flex items-center gap-1 bg-gray-50 dark:bg-gray-800/50 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                ${buildCustomSelect(HOUR_OPTIONS, sH, 'start-h')}
                <span class="text-gray-400 font-bold">:</span>
                ${buildCustomSelect(MINUTE_OPTIONS, sM, 'start-m')}
            </div>
            <span class="text-gray-300 font-bold">~</span>
            <div class="flex items-center gap-1 bg-gray-50 dark:bg-gray-800/50 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                ${buildCustomSelect(HOUR_OPTIONS, eH, 'end-h')}
                <span class="text-gray-400 font-bold">:</span>
                ${buildCustomSelect(MINUTE_OPTIONS, eM, 'end-m')}
            </div>
        </div>
        <div class="flex items-center gap-1">
            <button class="delete-btn p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="削除">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
        </div>
    `;
}