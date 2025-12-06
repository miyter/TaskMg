// @ts-nocheck
// タスクモーダル用のHTML構造を生成する

import { formatDateForInput } from './modal-helpers.js';
import { getInitialDueDateFromRecurrence } from '../../utils/date.js';
// ★追加: 時間帯データを取得するためにインポート
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

    // ★追加: 時間帯の選択肢生成
    const timeBlocks = getTimeBlocks();
    const selectedTimeBlockId = task.timeBlockId || '';
    const timeBlockOptions = timeBlocks.map(tb => 
        `<option value="${tb.id}" ${tb.id === selectedTimeBlockId ? 'selected' : ''}>
            ${tb.name} (${tb.start}-${tb.end})
        </option>`
    ).join('');

    // ★追加: 所要時間の選択肢生成
    const selectedDuration = task.duration || '';
    const durations = [15, 30, 45, 60, 75, 90, 120, 180];
    const durationOptions = durations.map(d => 
        `<option value="${d}" ${d == selectedDuration ? 'selected' : ''}>
            ${d} min
        </option>`
    ).join('');

    return `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in p-4">
            <div class="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh]" role="dialog" aria-modal="true">
                
                <!-- ヘッダー -->
                <div class="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
                    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100">タスク詳細</h3>
                    <button id="close-modal-btn" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <!-- ボディ -->
                <div class="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
                    <!-- タイトル -->
                    <div>
                        <input type="text" id="modal-task-title" value="${task.title}" placeholder="タスクのタイトル"
                            class="w-full text-lg font-bold bg-transparent border-b-2 border-transparent hover:border-gray-200 focus:border-blue-500 outline-none text-gray-800 dark:text-gray-100 transition-colors placeholder-gray-400 dark:placeholder-gray-600 pb-1">
                    </div>

                    <!-- メタ情報 -->
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
                        
                        <!-- ★追加: 時間帯 -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">時間帯</label>
                            <select id="modal-task-timeblock" 
                                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 text-sm appearance-none cursor-pointer">
                                <option value="">未定</option>
                                ${timeBlockOptions}
                            </select>
                        </div>

                        <!-- ★追加: 所要時間 -->
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
                    <div id="recurrence-days-container" class="${recurrenceType !== 'weekly' ? 'hidden' : ''} pt-2 border-t border-gray-100 dark:border-gray-700">
                        <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">繰り返す曜日</label>
                        <div id="recurrence-days-checkboxes" class="flex flex-wrap gap-x-4 gap-y-2">
                            ${daysCheckboxes}
                        </div>
                    </div>

                    <!-- ラベル -->
                    <div>
                        <div class="flex justify-between items-end mb-2">
                            <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">タグ (ラベル)</label>
                            <div class="relative">
                                <select id="modal-add-label-select" class="text-xs bg-gray-100 dark:bg-gray-700 border-none rounded px-2 py-1 text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition focus:ring-0 appearance-none">
                                    <option value="" selected disabled>+ 追加</option>
                                    <!-- ラベル選択肢がここに注入されます -->
                                </select>
                            </div>
                        </div>
                        <div id="modal-task-labels" class="flex flex-wrap gap-2 min-h-[28px]"></div>
                    </div>

                    <!-- メモ -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">メモ</label>
                        <textarea id="modal-task-desc" rows="5" placeholder="詳細を入力..."
                            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700 dark:text-gray-300 text-sm transition-all resize-none leading-relaxed">${task.description || ''}</textarea>
                    </div>
                </div>

                <!-- フッター -->
                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
                    <button id="delete-task-modal-btn" class="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center transition px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
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