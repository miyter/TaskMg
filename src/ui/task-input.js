// @miyter:20251129

// ★修正: store.js ではなく、ラッパー層の index.js (store.js経由) からインポート
import { addTaskCompatibility } from '../store/store.js';
// ★追加: 時間帯データを取得
import { getTimeBlocks } from '../store/timeblocks.js';

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
        
        // ★追加: 時間帯の選択肢を生成 (表示は start - end)
        const timeBlocks = getTimeBlocks();
        const timeBlockOptions = timeBlocks.map(tb => 
            `<option value="${tb.id}">${tb.start} - ${tb.end}</option>`
        ).join('');

        // ★修正: dark:bg-gray-850 -> dark:bg-gray-800 に修正し、ボーダーや文字色をダークモード最適化
        container.innerHTML = `
            <div class="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 shadow-lg animate-fade-in-down">
                <input type="text" id="inline-title-input" placeholder="タスク名 (例: 明日14時に会議 #仕事)" 
                         class="w-full text-sm font-semibold bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-100 mb-2">
                
                <textarea id="inline-desc-input" placeholder="詳細メモ" rows="2"
                         class="w-full text-xs bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-600 dark:text-gray-300 mb-3 resize-none"></textarea>
                
                <div class="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
                    <div class="flex space-x-2">
                        <!-- 期限日ボタン（将来拡張用） -->
                        <button class="flex items-center px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 transition">
                            <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            期限日
                        </button>
                        
                        <!-- ★追加: 時間帯選択プルダウン -->
                        <div class="relative">
                            <select id="inline-timeblock-select" class="appearance-none pl-2 pr-6 py-1 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 transition bg-transparent cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500">
                                <option value="">時間帯 (未定)</option>
                                ${timeBlockOptions}
                            </select>
                           <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-500">
                                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button id="cancel-input-btn" class="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition">キャンセル</button>
                        <button id="submit-task-btn" class="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded shadow transition disabled:opacity-50 disabled:cursor-not-allowed">
                            タスクを追加
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const titleInput = container.querySelector('#inline-title-input');
        const descInput = container.querySelector('#inline-desc-input');
        const timeBlockSelect = container.querySelector('#inline-timeblock-select'); // ★追加
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
            
            // ★修正: descInputがnullまたは.valueがundefinedの場合に備え、防御的なアクセスを行う
            const desc = (descInput && typeof descInput.value === 'string') ? descInput.value.trim() : '';
            const timeBlockId = timeBlockSelect.value; // ★追加
            
            // ★ dueDateは未実装なのでnull, recurrenceはnull, labelIdは空配列を渡す
            const taskData = {
                title,
                description: desc, // descは必ず文字列（空文字列か値のある文字列）になる
                dueDate: null, 
                projectId: projectId, 
                labelIds: labelId ? [labelId] : [],
                timeBlockId: timeBlockId || null // ★追加
            };

            if (!title) return;

            submitBtn.disabled = true;
            submitBtn.textContent = '追加中...';

            try {
                // ★修正: userIdを削除し、新しいaddTaskCompatibilityラッパーを呼び出す
                await addTaskCompatibility(taskData);
                
                // フォームをリセット（連続入力のため閉じない）
                titleInput.value = '';
                descInput.value = '';
                // 選択状態もリセットしたい場合は以下を追加
                // timeBlockSelect.value = '';
                titleInput.focus();
                
                // フィードバック
                submitBtn.textContent = '追加しました';
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'タスクを追加';
                }, 1000);
                
            } catch (e) {
                console.error(e);
                // 認証エラーの場合はStoreラッパーがモーダルを表示する
                if (e.message !== 'Authentication required.') {
                    // ★修正: alertをshowMessageModalに置き換え（仕様書準拠）
                    // showMessageModal("タスクの追加に失敗しました。認証状態を確認してください。", 'error');
                    // alertは使わないが、一時的にエラーが分かりやすいようにconsole.errorに留める
                    console.error('Task addition failed unexpectedly:', e);
                }
                submitBtn.disabled = false;
            }
        };
        submitBtn.addEventListener('click', submitAction);
    }
}