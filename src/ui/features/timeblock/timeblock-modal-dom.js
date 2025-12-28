/**
 * モーダルおよび行要素のHTML構造生成
 */

// 時間選択肢のキャッシュ
const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTE_OPTIONS = ['00', '15', '30', '45'];

const generateOptions = (options, selected) =>
    options.map(val => `<option value="${val}" ${val === selected ? 'selected' : ''}>${val}</option>`).join('');

export function buildModalSkeletonHTML() {
    return `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white">時間帯設定</h3>
                <button id="close-tb-modal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            <div class="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
                <div id="tb-list" class="divide-y divide-gray-100 dark:divide-gray-700"></div>
                <button id="add-tb-btn" class="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"></button>
                <div class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span class="w-3 h-3 rounded-full bg-gray-400 mr-3"></span>
                    <span class="font-bold mr-2 text-gray-700 dark:text-gray-300">未定</span>
                    <span class="text-xs">デフォルトのゾーンです（削除不可）</span>
                </div>
            </div>
            <div class="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-900/50 flex justify-end">
                <button id="close-tb-footer" class="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-all active:scale-95">完了</button>
            </div>
        </div>
    `;
}

export function buildRowHTML(data) {
    const [sH, sM] = data.start.split(':');
    const [eH, eM] = data.end.split(':');

    return `
        <div class="flex-shrink-0 relative">
            <input type="color" class="w-8 h-8 rounded cursor-pointer border-none p-0 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none" value="${data.color}">
            <div class="absolute inset-0 pointer-events-none rounded border border-gray-200 dark:border-gray-600"></div>
        </div>
        <div class="flex-1 flex items-center gap-2">
            <div class="flex items-center gap-1 bg-white dark:bg-gray-800 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700">
                <select class="start-h bg-transparent outline-none text-sm text-gray-800 dark:text-gray-200 cursor-pointer dark:bg-gray-800">${generateOptions(HOUR_OPTIONS, sH)}</select>
                <span class="text-gray-400">:</span>
                <select class="start-m bg-transparent outline-none text-sm text-gray-800 dark:text-gray-200 cursor-pointer dark:bg-gray-800">${generateOptions(MINUTE_OPTIONS, sM)}</select>
            </div>
            <span class="text-gray-300 font-bold">~</span>
            <div class="flex items-center gap-1 bg-white dark:bg-gray-800 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700">
                <select class="end-h bg-transparent outline-none text-sm text-gray-800 dark:text-gray-200 cursor-pointer dark:bg-gray-800">${generateOptions(HOUR_OPTIONS, eH)}</select>
                <span class="text-gray-400">:</span>
                <select class="end-m bg-transparent outline-none text-sm text-gray-800 dark:text-gray-200 cursor-pointer dark:bg-gray-800">${generateOptions(MINUTE_OPTIONS, eM)}</select>
            </div>
        </div>
        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="save-btn p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="保存">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </button>
            <button class="delete-btn p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="削除">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
        </div>
    `;
}