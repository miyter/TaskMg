import { UI_STYLES } from '../core/ui-style-constants';

/**
 * ワークスペースモーダルのテンプレート
 */
export function buildWorkspaceModalHTML(workspaceData = null) {
    const isEdit = !!workspaceData;
    const config = {
        title: isEdit ? 'ワークスペース名の変更' : '新規ワークスペース',
        btnText: isEdit ? '保存' : '作成',
        // 編集時もプレースホルダーを表示してUXを維持
        placeholder: 'ワークスペース名を入力...',
        description: isEdit
            ? 'ワークスペースの名前を変更します。'
            : '新しいワークスペースを作成します。プロジェクトやタスクを個別に管理できるようになります。'
    };

    return `
        <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" id="workspace-modal-overlay">
            <div class="bg-white dark:bg-gray-800 ${UI_STYLES.MODAL.WIDTH.DEFAULT} rounded-xl shadow-2xl overflow-hidden flex flex-col transform transition-all" role="dialog">
                
                <!-- ヘッダー -->
                <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">${config.title}</h2>
                    <input type="text" id="modal-workspace-name" 
                        value="${workspaceData?.name || ''}" 
                        placeholder="${config.placeholder}"
                        class="w-full text-xl font-bold bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600">
                </div>

                <!-- ボディ -->
                <div class="px-6 py-8">
                    <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        ${config.description}
                    </p>
                </div>

                <!-- フッター -->
                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end items-center border-t border-gray-100 dark:border-gray-700 gap-3">
                    <button id="cancel-modal-btn" class="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition">キャンセル</button>
                    <button id="save-workspace-btn" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg shadow-md transition-all transform active:scale-95">
                        ${config.btnText}
                    </button>
                </div>
            </div>
        </div>
    `;
}