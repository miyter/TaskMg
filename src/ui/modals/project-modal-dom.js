/**
 * プロジェクト作成・編集モーダルのHTML構造生成
 */

import { UI_STYLES } from '../core/ui-style-constants';

export function buildProjectModalHTML(project = null) {
    const isEdit = !!project;
    const config = {
        title: project?.name || '',
        placeholder: isEdit ? "プロジェクト名" : "新しいプロジェクト名",
        description: isEdit ? 'プロジェクト名を変更するぞ。' : '新しいプロジェクトを作成する。',
        btnText: isEdit ? '保存' : '作成'
    };

    const deleteBtn = isEdit ? `
        <button id="delete-project-btn" class="text-gray-400 hover:text-red-500 text-sm font-medium flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            削除
        </button>
    ` : '<span></span>';

    return `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div class="bg-white dark:bg-gray-800 ${UI_STYLES.MODAL.WIDTH.DEFAULT} rounded-xl shadow-2xl overflow-hidden flex flex-col" role="dialog">
                
                <!-- ヘッダー（タイトル入力） -->
                <div class="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <input type="text" id="modal-project-name" value="${config.title}" placeholder="${config.placeholder}"
                        class="w-full text-lg font-bold bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400">
                </div>

                <!-- ボディ -->
                <div class="px-6 py-10 flex-1">
                    <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed text-center">
                        ${config.description}
                    </p>
                </div>

                <!-- フッター -->
                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center border-t border-gray-100 dark:border-gray-700 gap-3">
                    ${deleteBtn}
                    <div class="flex gap-3">
                        <button id="cancel-modal-btn" class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 transition">キャンセル</button>
                        <button id="save-project-btn" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md transition-all transform active:scale-95">
                            ${config.btnText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}