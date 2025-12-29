export function renderWizard(container) {
    if (!container) return;
    container.innerHTML = `
        <div class="max-w-4xl mx-auto py-8">
            <h2 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">目標設計ウィザード</h2>
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div class="p-8">
                    <div class="flex items-center justify-between mb-8">
                        <div class="flex items-center space-x-4">
                            <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">1</div>
                            <div class="text-sm font-medium text-gray-500">Vision</div>
                            <div class="w-8 h-1 bg-gray-200 dark:bg-gray-700"></div>
                            <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 flex items-center justify-center font-bold">2</div>
                             <div class="text-sm font-medium text-gray-500">Strategy</div>
                             <div class="w-8 h-1 bg-gray-200 dark:bg-gray-700"></div>
                             <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 flex items-center justify-center font-bold">3</div>
                             <div class="text-sm font-medium text-gray-500">Action</div>
                        </div>
                    </div>
                
                    <div class="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">目標設定プロセスを開始</h3>
                        <p class="mt-1 text-sm text-gray-500">Backwards Designアプローチで、ゴールから逆算してタスクを生成します。</p>
                        <div class="mt-6">
                            <button type="button" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                開始する
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
