// 共通コンポーネント（モーダル等）のレンダリングと制御

/**
 * アプリケーションで使用するモーダルHTMLをDOMに注入する
 */
export function renderModals() {
    const existingEdit = document.getElementById('task-edit-modal');
    if (existingEdit) existingEdit.remove();
    
    const existingMsg = document.getElementById('message-modal');
    if (existingMsg) existingMsg.remove();

    const html = `
    <!-- タスク編集モーダル -->
    <div id="task-edit-modal" class="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 hidden flex items-center justify-center p-4 transition-opacity">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg transform transition-all flex flex-col max-h-[90vh]">
            <div class="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white"><i class="fas fa-edit mr-2 text-blue-500"></i>タスクの編集</h3>
                <button id="close-edit-modal-btn" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <i class="fas fa-times fa-lg"></i>
                </button>
            </div>
            
            <div class="p-6 overflow-y-auto custom-scrollbar space-y-4">
                <div>
                    <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">タイトル</label>
                    <input type="text" id="edit-task-title" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors" placeholder="タスクのタイトル">
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">期限</label>
                        <input type="date" id="edit-task-due" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:[color-scheme:dark]">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">繰り返し</label>
                        <select id="edit-task-recurrence" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                            <option value="none">なし</option>
                            <option value="daily">毎日</option>
                            <option value="weekly">毎週</option>
                            <option value="monthly">毎月</option>
                        </select>
                    </div>
                </div>

                <!-- ★追加: ラベル編集エリア -->
                <div>
                    <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">タグ</label>
                    <div class="flex flex-wrap items-center gap-2 mb-2" id="edit-task-labels">
                        <!-- ここにラベルバッジが動的に挿入されます -->
                    </div>
                    <select id="edit-add-label-select" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                        <option value="">＋ タグを追加...</option>
                    </select>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">詳細メモ</label>
                    <textarea id="edit-task-desc" rows="4" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors" placeholder="詳細を入力..."></textarea>
                </div>
            </div>

            <div class="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-xl flex justify-between items-center">
                 <button id="delete-task-btn-modal" class="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-2 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition">
                    <i class="fas fa-trash-alt mr-1"></i> 削除
                </button>
                <div class="flex space-x-3">
                    <button id="cancel-edit-btn" class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition">キャンセル</button>
                    <button id="save-task-btn" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition transform active:scale-95">保存する</button>
                </div>
            </div>
        </div>
    </div>

    <!-- 汎用メッセージモーダル -->
    <div id="message-modal" class="fixed inset-0 bg-gray-900 bg-opacity-50 z-[60] hidden flex items-center justify-center p-4 transition-opacity">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-6 transform transition-all scale-100">
            <h3 id="msg-modal-title" class="text-lg font-bold text-gray-800 dark:text-white mb-2">確認</h3>
            <p id="msg-modal-text" class="text-gray-600 dark:text-gray-300 mb-6 text-sm"></p>
            <div class="flex justify-end space-x-2">
                <button id="msg-modal-cancel" class="px-4 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition hidden">キャンセル</button>
                <button id="msg-modal-ok" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition">OK</button>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
}

export function showMessageModal(text, onConfirm = null) {
    const modal = document.getElementById('message-modal');
    const msgText = document.getElementById('msg-modal-text');
    const okBtn = document.getElementById('msg-modal-ok');
    const cancelBtn = document.getElementById('msg-modal-cancel');
    
    if (!modal) return;

    msgText.textContent = text;
    
    const newOk = okBtn.cloneNode(true);
    okBtn.parentNode.replaceChild(newOk, okBtn);
    
    const newCancel = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);

    if (onConfirm) {
        newCancel.classList.remove('hidden');
        newOk.onclick = () => {
            modal.classList.add('hidden');
            onConfirm();
        };
        newCancel.onclick = () => {
            modal.classList.add('hidden');
        };
    } else {
        newCancel.classList.add('hidden');
        newOk.onclick = () => {
            modal.classList.add('hidden');
        };
    }

    modal.classList.remove('hidden');
}