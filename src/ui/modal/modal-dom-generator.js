// @ts-nocheck
// タスクモーダル用のHTML構造を生成する

import { formatDateForInput } from './modal-helpers.js';
import { getInitialDueDateFromRecurrence } from '../../utils/date.js';
// 時間帯データを取得するためにインポート
import { getTimeBlocks } from '../../store/timeblocks.js';

/**
 * 繰り返し設定の曜日チェックボックスHTMLを生成する。
 * @param {Array<number>} recurrenceDays - 選択されている曜日のインデックス (0=日, 1=月...)
 * @returns {string} チェックボックスのHTML文字列
 */
function createDaysCheckboxesHTML(recurrenceDays = []) {
    const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];
    return dayLabels.map((day, index) => `
        <label class="flex items-center space-x-1 cursor-pointer">
            <input type="checkbox" data-day-index="${index}" ${recurrenceDays.includes(index) ? 'checked' : ''} 
                    class="form-checkbox h-4 w-4 text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded">
            <span class="text-xs text-gray-700 dark:text-gray-300">${day}</span>
        </label>
    `).join('');
}

/**
 * タスク編集モーダル全体のHTMLを生成する。
 * @param {Object} task - 編集対象のタスクオブジェクト
 * @returns {string} モーダルHTML文字列
 */
export function buildModalHTML(task) {
    let dueDate = task.dueDate;
    const recurrenceType = task.recurrence?.type || 'none';
    const recurrenceDays = task.recurrence?.days || [];
    
    // 繰り返し設定があるが、dueDateがない場合、日付を自動で設定する
    if (recurrenceType !== 'none' && !dueDate) {
        const tempRecurrence = { 
            type: recurrenceType,
            days: recurrenceType === 'weekly' ? recurrenceDays : []
        };
        dueDate = getInitialDueDateFromRecurrence(tempRecurrence);
    }
    
    // DateオブジェクトまたはFirestore TimestampをYYYY-MM-DD形式に変換
    const dueDateValue = dueDate && dueDate.toDate 
        ? formatDateForInput(dueDate.toDate()) 
        : (dueDate ? formatDateForInput(new Date(dueDate)) : '');


    const daysCheckboxes = createDaysCheckboxesHTML(recurrenceDays);

    // 時間帯の選択肢生成
    const timeBlocks = getTimeBlocks();
    const selectedTimeBlockId = task.timeBlockId || '';
    const timeBlockOptions = timeBlocks.map(tb => 
        // 表示を「start-end」のみに変更
        `<option value="${tb.id}" ${tb.id === selectedTimeBlockId ? 'selected' : ''}>
            ${tb.start} - ${tb.end}
        </option>`
    ).join('');

    // 指定の5つに統一
    const selectedDuration = task.duration || '';
    const durations = [30, 45, 60, 75, 90];
    const durationOptions = durations.map(d => 
        `<option value="${d}" ${d == selectedDuration ? 'selected' : ''}>
            ${d} min
        </option>`
    ).join('');

    // アコーディオンの初期開閉状態を判定
    const hasScheduleSettings = dueDateValue || (recurrenceType !== 'none') || selectedTimeBlockId || selectedDuration;
    // 設定があれば閉じる('')、なければ開く('open')
    const detailsOpenAttr = hasScheduleSettings ? '' : 'open';

    // メモ欄の初期値
    const taskDescription = task.description || '';

    return `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in p-4">
            <div class="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh]" role="dialog" aria-modal="true">
                
                <!-- ヘッダー -->
                <!-- ★修正: ヘッダーから「タスク詳細」のタイトルを削除し、タイトル入力欄をヘッダー直下に移動させるため、ヘッダーにタスク入力欄のスタイルを適用する -->
                <div class="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
                    <!-- タスクタイトル入力欄をヘッダーのように配置 -->
                    <input type="text" id="modal-task-title" value="${task.title}" placeholder="タスクのタイトル"
                        class="w-full text-lg font-bold bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600">
                    
                    <button id="close-modal-btn" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition ml-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <!-- ボディ -->
                <!-- ★修正: Tailwindの警告を避けるため、flex-1を使用する際は明示的に'min-h-0'を追加する。 -->
                <div class="px-6 py-4 space-y-5 overflow-y-auto custom-scrollbar flex-1 flex flex-col min-h-0">
                    <!-- タイトル入力欄はヘッダーに移動したため削除 -->
                    
                    <!-- メタ情報 (アコーディオン) -->
                    <details class="group border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/30 overflow-hidden transition-all" ${detailsOpenAttr}>
                        <summary class="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors select-none list-none outline-none">
                            <span class="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                スケジュール設定
                            </span>
                            <span class="transform group-open:rotate-180 transition-transform duration-200 text-gray-400">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                            </span>
                        </summary>
                        
                        <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/30">
                            <div class="grid grid-cols-2 gap-4">
                                <!-- 期限日 -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">期限日</label>
                                    <input type="date" id="modal-task-date" value="${dueDateValue}"
                                        class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 text-sm">
                                </div>
                                <!-- 繰り返し -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">繰り返し</label>
                                    <select id="modal-task-recurrence" 
                                        class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 text-sm appearance-none cursor-pointer">
                                        <option value="none" ${recurrenceType === 'none' ? 'selected' : ''}>繰り返しなし</option>
                                        <option value="daily" ${recurrenceType === 'daily' ? 'selected' : ''}>毎日</option>
                                        <option value="weekly" ${recurrenceType === 'weekly' ? 'selected' : ''}>毎週</option>
                                        <option value="monthly" ${recurrenceType === 'monthly' ? 'selected' : ''}>毎月</option>
                                    </select>
                                </div>
                                
                                <!-- 時間帯 -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">時間帯</label>
                                    <select id="modal-task-timeblock" 
                                        class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 text-sm appearance-none cursor-pointer">
                                        <option value="">未定</option>
                                        ${timeBlockOptions}
                                    </select>
                                </div>

                                <!-- 所要時間 -->
                                <div>
                                    <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">所要時間</label>
                                    <select id="modal-task-duration" 
                                        class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 text-sm appearance-none cursor-pointer">
                                        <option value="">指定なし</option>
                                        ${durationOptions}
                                    </select>
                                </div>
                            </div>
                            
                            <!-- 曜日選択 (weekly選択時のみ表示) -->
                            <div id="recurrence-days-container" class="${recurrenceType !== 'weekly' ? 'hidden' : ''} pt-2 mt-4 border-t border-gray-100 dark:border-gray-700">
                                <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">繰り返す曜日</label>
                                <div id="recurrence-days-checkboxes" class="flex flex-wrap gap-x-4 gap-y-2">
                                    ${daysCheckboxes}
                                </div>
                            </div>
                        </div>
                    </details>

                    <!-- メモ (Markdown対応) -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 flex justify-between items-center">
                            <span>メモ (Markdown対応)</span>
                            <button id="toggle-memo-view" class="text-xs text-blue-500 hover:text-blue-400 font-normal underline">プレビュー</button>
                        </label>
                        
                        <!-- 入力エリア -->
                        <textarea id="modal-task-desc" rows="5" placeholder="詳細を入力... (箇条書きは*, ハイパーリンクは[テキスト](URL)で)"
                            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700 dark:text-gray-300 text-sm transition-all resize-none leading-relaxed">${taskDescription}</textarea>
                        
                        <!-- プレビューエリア (最初は非表示) -->
                        <div id="modal-task-desc-preview" class="hidden w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 text-sm transition-all markdown-output">
                            <!-- JSによってMarkdownがレンダリングされる -->
                        </div>
                    </div>

                    <!-- ★削除: ラベルエリアと追加セレクトボックスを完全に削除 -->
                    <!-- ラベル関連のコードを削除したため、この位置にあった空のコメントやDOM要素は完全に除去する -->
                    
                </div>

                <!-- フッター -->
                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
                    <!-- ★修正: 削除ボタンを薄い赤（グレーベースでホバー時に赤）に変更 -->
                    <button id="delete-task-modal-btn" class="text-gray-400 hover:text-red-500 text-sm font-medium flex items-center transition px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 group">
                        <svg class="w-4 h-4 mr-1.5 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        削除
                    </button>
                    <div class="flex space-x-3">
                        <button id="cancel-modal-btn" class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition">キャンセル</button>
                        <button id="save-task-modal-btn" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5">保存</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}