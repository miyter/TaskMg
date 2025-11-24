// @miyter:20251125
// --- 共通UIコンポーネント (タスク編集モーダル, メッセージモーダル) ---
// 役割: JavaScriptを使ってDOMにモーダルを挿入し、必要な関数をエクスポートする

/**
 * 共通のモーダルHTML構造をDOMに挿入する。
 * タスク編集モーダル以外に、メッセージ確認用モーダルをここで定義する。
 */
export function renderModals() {
    // 既存のモーダルコンテナがあれば削除
    if (document.getElementById('modal-container')) {
        document.getElementById('modal-container').remove();
    }
    
    // モーダル全体を格納するコンテナ
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    
    // タスク編集モーダルとメッセージモーダルのHTML構造を定義
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
        
        <!-- メッセージモーダル (auth.js, store.jsなどで使用) -->
        <div id="message-modal" class="fixed inset-0 bg-gray-900 bg-opacity-75 hidden flex items-center justify-center z-50 backdrop-blur-sm transition-opacity">
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6 relative">
                <h4 id="message-modal-title" class="text-lg font-bold mb-3 flex items-center"></h4>
                <p id="message-modal-body" class="text-gray-700 mb-6"></p>
                <div class="flex justify-end">
                    <button id="message-modal-close-btn" class="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition text-sm font-medium">閉じる</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modalContainer);
    
    // イベントリスナー設定
    document.getElementById('message-modal-close-btn')?.addEventListener('click', () => {
        document.getElementById('message-modal')?.classList.add('hidden');
    });
}

/**
 * 汎用的なメッセージモーダルを表示する。
 * @param {string} title - モーダルのタイトル
 * @param {string} body - モーダルの本文
 * @param {'success' | 'error' | 'info'} type - メッセージのタイプ
 */
export function showMessageModal(title, body, type = 'info') {
    const modal = document.getElementById('message-modal');
    const titleEl = document.getElementById('message-modal-title');
    const bodyEl = document.getElementById('message-modal-body');
    
    if (!modal || !titleEl || !bodyEl) {
        console.error(`Modal element missing. Title: ${title}, Body: ${body}`);
        return;
    }
    
    // スタイルをリセット
    titleEl.className = 'text-lg font-bold mb-3 flex items-center';
    
    // タイプに応じたアイコンと色を設定
    let iconClass = '';
    let iconColor = '';
    
    switch (type) {
        case 'success':
            iconClass = 'fas fa-check-circle';
            iconColor = 'text-green-500';
            break;
        case 'error':
            iconClass = 'fas fa-exclamation-triangle';
            iconColor = 'text-red-500';
            break;
        case 'info':
        default:
            iconClass = 'fas fa-info-circle';
            iconColor = 'text-blue-500';
            break;
    }
    
    titleEl.innerHTML = `<i class="${iconClass} ${iconColor} mr-2"></i> ${title}`;
    bodyEl.textContent = body;
    modal.classList.remove('hidden');
}


// 編集モーダル用の要素をエクスポート (task-view.jsが要素にアクセスできるようにする)
// 注: これらの要素は renderModals() が実行された後に document.getElementById で取得可能です。
export const editModalElements = {
    // 参照のみエクスポートし、取得はタスクビュー側で行うため、ここでは省略
};

// 空のエクスポートも維持
export default {};