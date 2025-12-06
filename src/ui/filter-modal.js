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
    modalOverlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4';

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

    // ★修正: UIデザインをモダンに変更 (ヘッダー/フッターの一体化、余白調整)
    modalOverlay.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all ring-1 ring-black/5">
            <!-- ヘッダー -->
            <div class="px-6 py-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-700/50">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white">
                    ${isEdit ? 'フィルターを編集' : 'フィルターを追加'}
                </h3>
                <button id="close-filter-modal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            
            <div class="p-6 space-y-5">
                <!-- フィルター名 -->
                <div>
                    <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">フィルター名</label>
                    <input type="text" id="filter-name" value="${name}" class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white dark:bg-gray-750 text-gray-800 dark:text-gray-100 text-sm transition-shadow" placeholder="例: 今日の重要タスク">
                </div>

                <!-- クエリ -->
                <div>
                    <div class="flex justify-between items-center mb-1.5">
                        <label class="block text-xs font-bold text-gray-700 dark:text-gray-300">検索クエリ</label>
                        <a href="#" class="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium" title="ヘルプ">文法を見る</a>
                    </div>
                    <textarea id="filter-query" rows="3" class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white dark:bg-gray-750 text-gray-800 dark:text-gray-100 text-sm font-mono leading-relaxed transition-shadow" placeholder="例: 今日 & @重要">${query}</textarea>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5 ml-1">例: (今日 | 明日) & #仕事</p>
                </div>

                <!-- カラー選択 -->
                <div>
                    <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">カラー</label>
                    <div class="flex flex-wrap gap-3" id="color-selector">
                        ${colors.map(c => `
                            <button type="button" 
                                class="w-6 h-6 rounded-full focus:outline-none ring-2 ring-offset-2 dark:ring-offset-gray-800 transition-all hover:scale-110 color-btn ${color === c.id ? 'ring-blue-500 scale-110' : 'ring-transparent hover:ring-gray-300 dark:hover:ring-gray-600'}"
                                style="background-color: ${c.bg};"
                                data-color="${c.id}">
                            </button>
                        `).join('')}
                    </div>
                    <input type="hidden" id="selected-color" value="${color}">
                </div>

                <!-- オプション -->
                <div class="flex items-center pt-2">
                    <label class="inline-flex items-center cursor-pointer group">
                        <div class="relative flex items-center">
                            <input type="checkbox" id="filter-favorite" class="peer h-4 w-4 cursor-pointer text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500/50 dark:focus:ring-offset-gray-800 transition-colors" ${isFavorite ? 'checked' : ''}>
                        </div>
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">お気に入りに追加</span>
                    </label>
                </div>
            </div>

            <!-- フッター -->
            <div class="px-6 py-4 flex justify-end space-x-3 bg-gray-50/50 dark:bg-gray-800/50">
                <button id="cancel-filter-btn" class="px-5 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-200/50 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-bold transition-colors focus:outline-none">
                    キャンセル
                </button>
                <button id="save-filter-btn" class="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 focus:outline-none shadow-sm hover:shadow transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
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
        modalOverlay.classList.add('opacity-0', 'scale-95'); // アニメーション用クラス
        setTimeout(() => modalOverlay.remove(), 200);
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // カラー選択ロジック
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => {
                b.classList.remove('ring-blue-500', 'scale-110');
                b.classList.add('ring-transparent');
            });
            btn.classList.remove('ring-transparent');
            btn.classList.add('ring-blue-500', 'scale-110');
            colorInput.value = btn.dataset.color;
        });
    });

    // 入力検証
    const validateInput = () => {
        const isValid = nameInput.value.trim().length > 0 && queryInput.value.trim().length > 0;
        saveBtn.disabled = !isValid;
    };
    nameInput.addEventListener('input', validateInput);
    queryInput.addEventListener('input', validateInput);
    validateInput(); 

    // 保存処理
    saveBtn.addEventListener('click', async () => {
        const newFilter = {
            id: filter ? filter.id : crypto.randomUUID(),
            name: nameInput.value.trim(),
            query: queryInput.value.trim(),
            color: colorInput.value,
            isFavorite: document.getElementById('filter-favorite').checked,
            createdAt: filter ? filter.createdAt : new Date().toISOString()
        };

        try {
            console.log('Saving filter:', newFilter);
            // store.saveFilter(newFilter); // TODO: Store実装
            
            closeModal();
            showMessageModal(`フィルター「${newFilter.name}」を${isEdit ? '更新' : '作成'}しました (保存処理は未実装)`);
        } catch (error) {
            console.error('Filter save error:', error);
            showMessageModal('保存に失敗しました', 'error');
        }
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    
    setTimeout(() => nameInput.focus(), 50);
}