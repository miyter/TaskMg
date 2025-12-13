// @ts-nocheck
/**
 * プロジェクト作成・編集モーダルのHTML生成
 */
export function buildProjectModalHTML(project = null) {
    const isEditing = !!project;
    const titleValue = project ? project.name : '';
    const placeholder = isEditing ? "プロジェクト名" : "新しいプロジェクト名";

    // 編集時のみ削除ボタンを表示
    const deleteBtnHTML = isEditing ? `
        <button id="delete-project-btn" class="text-gray-400 hover:text-red-500 text-sm font-medium flex items-center transition px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 group">
            <svg class="w-4 h-4 mr-1.5 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            削除
        </button>
    ` : '<div></div>'; // レイアウト崩れ防止の空div

    return `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div class="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden transform transition-all scale-100 flex flex-col" role="dialog" aria-modal="true">
                
                <!-- ヘッダー（タスクモーダルと統一：入力欄を配置、×ボタンは削除） -->
                <div class="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
                    <input type="text" id="modal-project-name" value="${titleValue}" placeholder="${placeholder}"
                        class="w-full text-lg font-bold bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600">
                </div>

                <!-- ボディ -->
                <div class="px-6 py-8 flex-1 overflow-y-auto">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        ${isEditing ? 'プロジェクト名を変更します。' : '新しいプロジェクトを作成します。'}
                    </p>
                </div>

                <!-- フッター -->
                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
                    ${deleteBtnHTML}
                    <div class="flex space-x-3">
                        <button id="cancel-modal-btn" class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition">キャンセル</button>
                        <button id="save-project-btn" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5">保存</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}