export function getDataContent() {
    return `
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
}
