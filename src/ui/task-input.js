import { addTask } from '../store/store.js';

let isInputExpanded = false; // 入力フォームの開閉状態を管理

/**
 * インライン入力フォームを描画する
 * @param {HTMLElement} container - 親要素
 * @param {string|null} projectId - 現在のプロジェクトID
 * @param {string|null} labelId - 現在のラベルID
 */
export function renderInlineInput(container, projectId, labelId) {
    if (!isInputExpanded) {
        // 閉じた状態: トリガーボタン
        container.innerHTML = `
            <div id="show-input-btn" class="flex items-center text-gray-500 hover:text-red-500 dark:hover:text-red-400 cursor-pointer py-2 px-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800/50 transition group select-none">
                <div class="w-6 h-6 mr-2 rounded-full text-red-500 flex items-center justify-center transition-transform group-hover:scale-110">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                </div>
                <div class="text-sm group-hover:text-red-600 dark:group-hover:text-red-400 font-medium">タスクを追加</div>
            </div>
        `;
        container.querySelector('#show-input-btn').addEventListener('click', () => {
            isInputExpanded = true;
            renderInlineInput(container, projectId, labelId);
        });
    } else {
        // 展開状態: 入力フォーム
        container.innerHTML = `
            <div class="border border-gray-300 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-850 shadow-lg animate-fade-in-down">
                <input type="text" id="inline-title-input" placeholder="タスク名 (例: 明日14時に会議 #仕事)" 
                       class="w-full text-sm font-semibold bg-transparent border-none outline-none placeholder-gray-400 text-gray-800 dark:text-gray-100 mb-2">
                
                <textarea id="inline-desc-input" placeholder="詳細メモ" rows="2"
                       class="w-full text-xs bg-transparent border-none outline-none placeholder-gray-400 text-gray-600 dark:text-gray-400 mb-3 resize-none"></textarea>
                
                <div class="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
                    <div class="flex space-x-2">
                        <!-- 期限日ボタン（将来拡張用） -->
                        <button class="flex items-center px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded border border-gray-200 dark:border-gray-700 transition">
                            <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            期限日
                        </button>
                    </div>
                    <div class="flex space-x-2">
                        <button id="cancel-input-btn" class="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition">キャンセル</button>
                        <button id="submit-task-btn" class="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded shadow transition disabled:opacity-50 disabled:cursor-not-allowed">
                            タスクを追加
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const titleInput = container.querySelector('#inline-title-input');
        const descInput = container.querySelector('#inline-desc-input');
        const submitBtn = container.querySelector('#submit-task-btn');
        
        // 自動フォーカス
        titleInput.focus();

        // Enterキー送信
        titleInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.isComposing) {
                e.preventDefault();
                if (titleInput.value.trim()) submitAction();
            }
        });

        // キャンセル
        container.querySelector('#cancel-input-btn').addEventListener('click', () => {
            isInputExpanded = false;
            renderInlineInput(container, projectId, labelId);
        });

        // 送信処理
        const submitAction = async () => {
            const title = titleInput.value.trim();
            const desc = descInput.value.trim();
            if (!title) return;

            submitBtn.disabled = true;
            submitBtn.textContent = '追加中...';

            try {
                // store.js の addTask を呼び出し
                await addTask(title, desc, null, projectId, labelId);
                
                // フォームをリセット（連続入力のため閉じない）
                titleInput.value = '';
                descInput.value = '';
                titleInput.focus();
                
                // フィードバック
                submitBtn.textContent = '追加しました';
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'タスクを追加';
                }, 1000);
                
            } catch (e) {
                console.error(e);
                alert('追加に失敗しました');
                submitBtn.disabled = false;
            }
        };
        submitBtn.addEventListener('click', submitAction);
    }
}