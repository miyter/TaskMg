// --- 共通UIコンポーネント (タスク編集/設定モーダル) ---

export function renderModals() {
    // 既存のモーダルコンテナがあれば削除
    if (document.getElementById('modal-container')) {
        document.getElementById('modal-container').remove();
    }
    
    // モーダル全体を格納するコンテナ
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    
    // モーダルHTML構造をインラインで定義
    modalContainer.innerHTML = `
        <!-- タスク編集モーダル (task-view.jsで使用) -->
        <div id="edit-task-modal" class="fixed inset-0 bg-gray-900 bg-opacity-75 hidden flex items-center justify-center z-50 backdrop-blur-sm transition-opacity">
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 relative transform transition-all">
                <button id="close-modal-btn" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"><i class="fas fa-times fa-lg"></i></button>
                <h3 class="text-xl font-bold mb-6 text-gray-800 border-b pb-3 flex items-center"><i class="fas fa-edit mr-2 text-blue-500"></i> タスクの編集</h3>
                <div class="space-y-5">
                    <div><label class="block text-sm font-semibold text-gray-700 mb-1.5">タイトル <span class="text-red-500">*</span></label><input type="text" id="edit-task-title" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm"></div>
                    <div><label class="block text-sm font-semibold text-gray-700 mb-1.5">期限日</label><input type="date" id="edit-task-date" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm text-gray-700"></div>
                    <div><label class="block text-sm font-semibold text-gray-700 mb-1.5">詳細メモ</label><textarea id="edit-task-desc" rows="4" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm resize-none" placeholder="タスクの詳細や補足事項を入力..."></textarea></div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1.5">タグ (ラベル)</label>
                        <div id="edit-task-labels" class="flex flex-wrap gap-2 mb-2 min-h-[30px] p-1"></div>
                        <div class="relative">
                            <select id="edit-add-label-select" class="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm appearance-none cursor-pointer hover:border-gray-400"><option value="">＋ タグを追加...</option></select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"><i class="fas fa-chevron-down text-xs"></i></div>
                        </div>
                    </div>
                </div>
                <div class="mt-8 flex justify-end space-x-3 border-t pt-4">
                    <button id="delete-task-btn-modal" class="text-red-500 hover:bg-red-50 hover:text-red-600 px-4 py-2 rounded-lg transition text-sm font-medium mr-auto flex items-center"><i class="fas fa-trash-alt mr-2"></i> 削除</button>
                    <button id="cancel-edit-btn" class="text-gray-600 hover:bg-gray-100 hover:text-gray-800 px-5 py-2.5 rounded-lg transition text-sm font-medium">キャンセル</button>
                    <button id="save-task-btn" class="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2.5 rounded-lg transition text-sm font-bold shadow-md transform active:scale-95 flex items-center"><i class="fas fa-save mr-2"></i> 保存</button>
                </div>
            </div>
        </div>

        <!-- 設定モーダル (settings.jsで使用) -->
        <!-- index.htmlにも既に記述済みのため、ここでは編集モーダルのみをcomponentsに定義するアプローチを採用します -->
        
    `;
    document.body.appendChild(modalContainer);
}

// 編集モーダル用の要素をエクスポート
export const editModalElements = {
    modal: document.getElementById('edit-task-modal'),
    closeBtn: document.getElementById('close-modal-btn'),
    cancelBtn: document.getElementById('cancel-edit-btn'),
    saveBtn: document.getElementById('save-task-btn'),
    deleteBtn: document.getElementById('delete-task-btn-modal'),
    title: document.getElementById('edit-task-title'),
    date: document.getElementById('edit-task-date'),
    desc: document.getElementById('edit-task-desc'),
    labelsContainer: document.getElementById('edit-task-labels'),
    addLabelSelect: document.getElementById('edit-add-label-select')
};

// 空のエクスポートも維持
export default {};