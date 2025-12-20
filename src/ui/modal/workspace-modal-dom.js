// @ts-nocheck
// @miyter:20251221
// ワークスペース作成・編集モーダルのHTML生成

/**
 * ワークスペースモーダルのテンプレート
 */
export function buildWorkspaceModalHTML(workspaceData = null) {
    const isEdit = !!workspaceData;
    const config = {
        title: isEdit ? 'ワークスペース名' : '新しいワークスペース名',
        btnText: isEdit ? '保存' : '作成',
        description: isEdit 
            ? 'ワークスペースの名前を変更します。' 
            : '新しいワークスペースを作成します。<br>ワークスペースごとにプロジェクトやタスクを管理できます。'
    };

    return `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
            <div class="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col" role="dialog">
                
                <!-- ヘッダー（タイトル入力欄） -->
                <div class="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <input type="text" id="modal-workspace-name" 
                        value="${workspaceData?.name || ''}" 
                        placeholder="${config.title}"
                        class="w-full text-lg font-bold bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400">
                </div>

                <!-- ボディ -->
                <div class="px-6 py-8 flex-1 overflow-y-auto">
                    <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        ${config.description}
                    </p>
                </div>

                <!-- フッター -->
                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end items-center border-t border-gray-100 dark:border-gray-700 gap-3">
                    <button id="cancel-modal-btn" class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 transition">キャンセル</button>
                    <button id="save-workspace-btn" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md transition-all transform active:scale-95">
                        ${config.btnText}
                    </button>
                </div>
            </div>
        </div>
    `;
}