// --- UIコンポーネント生成 (新規作成) ---
// 役割: HTMLファイルから大きな静的コンテンツ（モーダル等）を分離して注入する

export function renderModals() {
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = `
        <!-- 編集モーダル -->
        <div id="edit-task-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50 backdrop-blur-sm transition-opacity">
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 relative transform transition-transform scale-95 hover:scale-100 duration-200">
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

        <!-- 設定モーダル -->
        <div id="settings-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50 backdrop-blur-sm transition-opacity">
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 relative transform transition-transform scale-95 hover:scale-100 duration-200">
                <button id="close-settings-btn" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"><i class="fas fa-times fa-lg"></i></button>
                <h3 class="text-xl font-bold mb-6 text-gray-800 border-b pb-3 flex items-center"><i class="fas fa-tools mr-2 text-gray-600"></i> 設定 & データ管理</h3>
                <div class="space-y-8">
                    <div>
                        <h4 class="text-sm font-bold text-gray-700 mb-3 flex items-center"><span class="bg-blue-100 text-blue-600 p-1.5 rounded-md mr-2"><i class="fas fa-lock fa-sm"></i></span> アカウント設定</h4>
                        <div class="flex gap-2"><input type="password" id="new-password-input" placeholder="新しいパスワード" class="flex-1 p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"><button id="update-password-btn" class="bg-gray-800 text-white px-4 py-2.5 rounded-lg text-sm hover:bg-gray-900 font-medium shadow-sm transition-colors whitespace-nowrap">変更</button></div>
                        <p class="text-xs text-gray-500 mt-2 ml-1"><i class="fas fa-info-circle mr-1"></i> セキュリティ保護のため、変更には最近の再ログインが必要です。</p>
                    </div>
                    <div>
                        <h4 class="text-sm font-bold text-gray-700 mb-3 flex items-center"><span class="bg-green-100 text-green-600 p-1.5 rounded-md mr-2"><i class="fas fa-database fa-sm"></i></span> データ管理</h4>
                        <p class="text-sm text-gray-600 mb-4 ml-1 leading-relaxed">現在の全てのタスク、プロジェクト、タグのデータをJSON形式で一括ダウンロードします。バックアップとしてご利用ください。</p>
                        <button id="export-data-btn" class="w-full bg-green-600 text-white px-4 py-3 rounded-lg text-sm font-bold hover:bg-green-700 flex items-center justify-center shadow-md transition-all transform active:scale-95"><i class="fas fa-file-export mr-2"></i> バックアップデータを作成 (JSON)</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modalContainer);
}