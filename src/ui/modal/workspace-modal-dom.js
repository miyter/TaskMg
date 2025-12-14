// @ts-nocheck
/**
 * ワークスペース作成モーダルのHTML生成
 */
export function buildWorkspaceModalHTML() {
    return `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div class="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden transform transition-all scale-100 flex flex-col" role="dialog" aria-modal="true">
                
                <!-- ヘッダー -->
                <div class="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
                    <input type="text" id="modal-workspace-name" placeholder="新しいワークスペース名"
                        class="w-full text-lg font-bold bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600">
                </div>

                <!-- ボディ -->
                <div class="px-6 py-8 flex-1 overflow-y-auto">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        新しいワークスペースを作成します。<br>
                        ワークスペースごとにプロジェクトやタスクを管理できます。
                    </p>
                </div>

                <!-- フッター -->
                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end items-center border-t border-gray-100 dark:border-gray-700 flex-shrink-0 space-x-3">
                    <button id="cancel-modal-btn" class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition">キャンセル</button>
                    <button id="save-workspace-btn" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5">作成</button>
                </div>
            </div>
        </div>
    `;
}