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
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] relative animate-fade-in-up">
            <div class="px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white tracking-tight">時間帯設定</h3>
                <button id="close-tb-modal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition duration-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            
            <div class="p-8 overflow-y-auto flex-1 space-y-6 custom-scrollbar relative" id="tb-scroll-container">
                <div id="tb-list" class="space-y-4"></div>
                
                <button id="add-tb-btn" class="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group">
                </button>

                <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span class="w-2.5 h-2.5 rounded-full bg-gray-400 mr-3 shadow-sm"></span>
                    <span class="font-bold mr-2 text-gray-700 dark:text-gray-300">未定</span>
                    <span class="text-xs opacity-80">デフォルトのゾーン</span>
                </div>
            </div>

            <div class="px-8 py-5 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end">
                <button id="close-tb-footer" class="px-8 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition-all active:scale-95 shadow-lg shadow-gray-200 dark:shadow-none">完了</button>
            </div>

            <!-- Global Color Picker Popover (Hidden by default) -->
            <div id="tb-color-picker" class="hidden absolute z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 p-4 w-64 animate-fade-in-up">
                <div class="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">プリセット</div>
                <div class="grid grid-cols-5 gap-3 mb-5" id="tb-color-presets">
                    <!-- Presets injected by JS -->
                </div>
                <div class="flex justify-between items-end mb-3">
                    <div class="text-xs font-bold text-gray-400 uppercase tracking-wider">カスタム</div>
                    <button id="tb-custom-color-edit-btn" class="text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors">編集</button>
                    <input type="color" id="tb-custom-color-input" class="invisible w-0 h-0 absolute">
                </div>
                <div class="grid grid-cols-5 gap-3" id="tb-color-customs">
                    <!-- Custom slots injected by JS -->
                </div>
            </div>
        </div>
    `;
}

// Custom Select Builder
function buildCustomSelect(options, value, type) {
    const listHtml = options.map(opt =>
        `<div class="tb-select-option px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer text-sm transition-colors ${opt === value ? 'bg-blue-50 dark:bg-blue-900/30 font-bold text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}" data-value="${opt}">${opt}</div>`
    ).join('');

    return `
        <div class="relative tb-custom-select group min-w-[64px]" data-type="${type}" data-value="${value}">
            <button type="button" class="tb-select-trigger w-full py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-center shadow-sm hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition-all flex items-center justify-center font-mono font-medium text-gray-700 dark:text-gray-200">
                <span class="value-display">${value}</span>
            </button>
            <div class="hidden tb-select-options absolute top-full left-0 mt-2 w-full min-w-[70px] max-h-56 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-xl z-20 custom-scrollbar animate-fade-in-down origin-top-left">
                ${listHtml}
            </div>
        </div>
    `;
}

export function buildRowHTML(data) {
    const [sH, sM] = data.start.split(':');
    const [eH, eM] = data.end.split(':');

    return `
        <div class="flex-shrink-0 relative pl-2">
            <button type="button" class="tb-color-trigger w-6 h-6 rounded-full shadow-sm hover:scale-110 active:scale-95 transition-transform focus:outline-none ring-2 ring-transparent focus:ring-blue-400 ring-offset-2 dark:ring-offset-gray-900" 
                style="background-color: ${data.color}" data-color="${data.color}" title="色を変更"></button>
        </div>
        
        <div class="flex-1 flex items-center gap-4 px-2">
            <div class="flex items-center gap-2">
                ${buildCustomSelect(HOUR_OPTIONS, sH, 'start-h')}
                <span class="text-gray-300 dark:text-gray-600 font-light select-none">:</span>
                ${buildCustomSelect(MINUTE_OPTIONS, sM, 'start-m')}
            </div>
            
            <div class="w-4 h-0.5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            
            <div class="flex items-center gap-2">
                ${buildCustomSelect(HOUR_OPTIONS, eH, 'end-h')}
                <span class="text-gray-300 dark:text-gray-600 font-light select-none">:</span>
                ${buildCustomSelect(MINUTE_OPTIONS, eM, 'end-m')}
            </div>
        </div>

        <div class="flex items-center pr-2">
            <button class="delete-btn p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200" title="削除">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
        </div>
    `;
}