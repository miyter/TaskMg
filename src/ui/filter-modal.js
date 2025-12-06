// @ts-nocheck
// フィルター作成・編集モーダル

import { showMessageModal } from './components.js';

/**
 * フィルター作成モーダルを表示する
 * @param {Object|null} filter - 編集モードの場合は既存のフィルターオブジェクト
 */
export function showFilterModal(filter = null) {
    const isEdit = !!filter;
    const modalId = 'filter-modal';
    
    // 既存のモーダルがあれば削除
    document.getElementById(modalId)?.remove();

    // モーダルコンテナ
    const modalOverlay = document.createElement('div');
    modalOverlay.id = modalId;
    modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in';

    // デフォルト値
    const name = filter ? filter.name : '';
    const query = filter ? filter.query : '';
    const color = filter ? filter.color : 'charcoal';
    const isFavorite = filter ? filter.isFavorite : false;

    // カラーパレット定義
    const colors = [
        { id: 'charcoal', bg: '#808080' },
        { id: 'red', bg: '#dc4c3e' },
        { id: 'orange', bg: '#e8953f' },
        { id: 'yellow', bg: '#ebda2a' },
        { id: 'green', bg: '#589f3b' },
        { id: 'blue', bg: '#3a7fcc' },
        { id: 'purple', bg: '#a350c9' },
        { id: 'pink', bg: '#db6c99' }
    ];

    modalOverlay.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden transform transition-all">
            <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-850">
                <h3 class="text-sm font-bold text-gray-700 dark:text-gray-200">
                    ${isEdit ? 'フィルターを編集' : 'フィルターを追加'}
                </h3>
                <button id="close-filter-modal" class="text-gray-400 hover:text-gray-500 focus:outline-none">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            
            <div class="p-4 space-y-4">
                <!-- フィルター名 -->
                <div>
                    <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">フィルター名</label>
                    <input type="text" id="filter-name" value="${name}" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm" placeholder="例: 今日の重要タスク">
                </div>

                <!-- クエリ -->
                <div>
                    <div class="flex justify-between items-center mb-1">
                        <label class="block text-xs font-bold text-gray-700 dark:text-gray-300">検索クエリ</label>
                        <a href="#" class="text-xs text-blue-500 hover:underline" title="ヘルプ">文法を見る</a>
                    </div>
                    <textarea id="filter-query" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm font-mono" placeholder="例: 今日 & @重要">${query}</textarea>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">例: (今日 | 明日) & #仕事</p>
                </div>

                <!-- カラー選択 -->
                <div>
                    <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">カラー</label>
                    <div class="flex flex-wrap gap-2" id="color-selector">
                        ${colors.map(c => `
                            <button type="button" 
                                class="w-6 h-6 rounded-full focus:outline-none ring-2 ring-offset-1 dark:ring-offset-gray-800 transition-transform hover:scale-110 color-btn ${color === c.id ? 'ring-blue-500 scale-110' : 'ring-transparent'}"
                                style="background-color: ${c.bg};"
                                data-color="${c.id}">
                            </button>
                        `).join('')}
                    </div>
                    <input type="hidden" id="selected-color" value="${color}">
                </div>

                <!-- オプション -->
                <div class="flex items-center">
                    <label class="inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="filter-favorite" class="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" ${isFavorite ? 'checked' : ''}>
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">お気に入りに追加</span>
                    </label>
                </div>
            </div>

            <div class="px-4 py-3 bg-gray-50 dark:bg-gray-850 flex justify-end space-x-2 border-t border-gray-200 dark:border-gray-700">
                <button id="cancel-filter-btn" class="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none transition-colors">
                    キャンセル
                </button>
                <button id="save-filter-btn" class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    ${isEdit ? '保存' : '追加'}
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    // イベントリスナー設定
    const closeBtn = document.getElementById('close-filter-modal');
    const cancelBtn = document.getElementById('cancel-filter-btn');
    const saveBtn = document.getElementById('save-filter-btn');
    const colorBtns = document.querySelectorAll('.color-btn');
    const colorInput = document.getElementById('selected-color');
    const nameInput = document.getElementById('filter-name');
    const queryInput = document.getElementById('filter-query');

    const closeModal = () => {
        modalOverlay.classList.add('opacity-0');
        setTimeout(() => modalOverlay.remove(), 200);
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // カラー選択ロジック
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 他の選択を解除
            colorBtns.forEach(b => {
                b.classList.remove('ring-blue-500', 'scale-110');
                b.classList.add('ring-transparent');
            });
            // 選択状態にする
            btn.classList.remove('ring-transparent');
            btn.classList.add('ring-blue-500', 'scale-110');
            colorInput.value = btn.dataset.color;
        });
    });

    // 入力検証（簡易）
    const validateInput = () => {
        const isValid = nameInput.value.trim().length > 0 && queryInput.value.trim().length > 0;
        saveBtn.disabled = !isValid;
    };
    nameInput.addEventListener('input', validateInput);
    queryInput.addEventListener('input', validateInput);
    validateInput(); // 初期チェック

    // 保存処理
    saveBtn.addEventListener('click', async () => {
        const newFilter = {
            id: filter ? filter.id : crypto.randomUUID(), // 新規ならID生成
            name: nameInput.value.trim(),
            query: queryInput.value.trim(),
            color: colorInput.value,
            isFavorite: document.getElementById('filter-favorite').checked,
            createdAt: filter ? filter.createdAt : new Date().toISOString()
        };

        try {
            // ★TODO: ここでStoreのフィルター保存処理を呼び出す
            // 現在はコンソール出力とメッセージ表示のみ
            console.log('Saving filter:', newFilter);
            
            // ダミーの保存完了メッセージ
            // store.saveFilter(newFilter); 
            
            closeModal();
            showMessageModal(`フィルター「${newFilter.name}」を${isEdit ? '更新' : '作成'}しました (保存処理は未実装)`);
            
            // サイドバー再描画のトリガーが必要ならここでイベント発火などを行う
            
        } catch (error) {
            console.error('Filter save error:', error);
            showMessageModal('保存に失敗しました', 'error');
        }
    });

    // モーダル外クリックで閉じる
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    
    // フォーカス
    setTimeout(() => nameInput.focus(), 50);
}