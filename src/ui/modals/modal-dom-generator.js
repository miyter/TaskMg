// @ts-nocheck
// @miyter:20251221
// タスクモーダル用のHTML構造を生成

import { formatDateForInput } from './modal-helpers.js';
import { getInitialDueDateFromRecurrence } from '../../utils/date.js';
import { getTimeBlocks } from '../../store/timeblocks.js';

/**
 * 繰り返し設定の曜日チェックボックスHTMLを生成
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
 * セレクトボックスのオプションを生成
 */
function createSelectOptions(items, selectedId, labelFn) {
    return items.map(item => `
        <option value="${item.id || item}" ${(item.id || item) == selectedId ? 'selected' : ''}>
            ${labelFn(item)}
        </option>
    `).join('');
}

/**
 * タスク編集モーダル全体のHTMLを生成
 */
// ... imports

const STORAGE_KEY_SCHEDULE_OPEN = 'task_modal_schedule_open';

/**
 * タスク編集モーダル全体のHTMLを生成
 */
export function buildModalHTML(task) {
    let dueDate = task.dueDate;
    const recurrence = task.recurrence || { type: 'none', days: [] };

    // 繰り返し設定時の初期日付補完
    if (recurrence.type !== 'none' && !dueDate) {
        dueDate = getInitialDueDateFromRecurrence(recurrence);
    }

    const dueDateValue = dueDate ? formatDateForInput(dueDate.toDate ? dueDate.toDate() : new Date(dueDate)) : '';

    // オプション生成
    const timeBlockOptions = createSelectOptions(getTimeBlocks(), task.timeBlockId, tb => `${tb.start} - ${tb.end}`);
    const durationOptions = createSelectOptions([30, 45, 60, 75, 90], task.duration, d => `${d} min`);

    // アコーディオンの初期状態判定
    // 1. データがある場合はデフォルトで開く
    // 2. ユーザーが明示的に閉じた履歴があればそれを優先する
    const hasScheduleData = dueDateValue || recurrence.type !== 'none' || task.timeBlockId || task.duration;
    const storedState = localStorage.getItem(STORAGE_KEY_SCHEDULE_OPEN);

    // データがあるなら基本開く。ただし、明示的に 'false' が保存されていたら閉じる。
    // データがないなら基本閉じる。ただし、明示的に 'true' が保存されていたら開く。
    let isOpen = hasScheduleData;
    if (storedState !== null) {
        isOpen = storedState === 'true';
    } else if (hasScheduleData) {
        isOpen = true; // データがあればデフォルトオープン
    }

    return `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div class="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" role="dialog">
                
                <!-- ヘッダー（タイトル入力） -->
                <div class="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <input type="text" id="modal-task-title" value="${task.title}" placeholder="タスクのタイトル"
                        class="w-full text-xl font-bold bg-transparent border-none outline-none text-gray-800 dark:text-gray-100">
                    <button id="close-modal-btn" class="text-gray-400 hover:text-gray-600 transition ml-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <!-- ボディ (2カラムレイアウト) -->
                <div class="px-6 py-6 overflow-y-auto flex-1 min-h-0 bg-gray-50/30 dark:bg-gray-900/10">
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
                        
                        <!-- 左カラム (8/12): メモ -->
                        <div class="md:col-span-8 flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
                            <div class="flex justify-between items-center mb-2">
                                <label class="text-xs font-semibold text-gray-500 flex items-center gap-2 uppercase">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                    メモ (Markdown)
                                </label>
                                <div class="flex items-center gap-2">
                                    <div class="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md p-0.5">
                                        <button type="button" id="md-bold-btn" class="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded hover:bg-white dark:hover:bg-gray-600 transition-colors" title="太字 (Ctrl+B)">
                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6V4zm0 8h9a4 4 0 014 4 4 4 0 01-4 4H6v-8z"></path></svg>
                                        </button>
                                        <div class="w-px h-3 bg-gray-300 dark:bg-gray-600 mx-0.5"></div>
                                        <button type="button" id="md-list-btn" class="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded hover:bg-white dark:hover:bg-gray-600 transition-colors" title="箇条書き">
                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                                        </button>
                                        <button type="button" id="md-ordered-btn" class="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded hover:bg-white dark:hover:bg-gray-600 transition-colors" title="番号付きリスト">
                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h12M7 12h12M7 17h12M3 7v.01M3 12v.01M3 17v.01"></path></svg>
                                        </button>
                                    </div>
                                    <button id="toggle-memo-view" class="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-2 py-0.5 rounded transition-colors text-xs font-medium ml-2">プレビュー</button>
                                </div>
                            </div>
                            <div class="flex-1 relative min-h-[200px]">
                                <textarea id="modal-task-desc" placeholder="詳細を入力..."
                                    class="w-full h-full p-3 bg-gray-50 dark:bg-gray-900/50 border-0 rounded-lg outline-none text-sm transition-all resize-y leading-relaxed focus:ring-1 focus:ring-blue-500/50 text-gray-800 dark:text-gray-200 font-mono">${task.description || ''}</textarea>
                                <div id="modal-task-desc-preview" class="hidden absolute inset-0 w-full h-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm markdown-output overflow-y-auto"></div>
                            </div>
                        </div>

                        <!-- 右カラム (4/12): スケジュール設定 -->
                        <div class="md:col-span-4 space-y-4">
                            <details id="modal-task-schedule-details" class="group border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm" ${isOpen ? 'open' : ''}>
                                <summary class="flex items-center justify-between px-4 py-3 cursor-pointer list-none outline-none bg-gray-50 dark:bg-gray-700/30 rounded-t-lg group-[:not([open])]:rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50">
                                    <span class="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        スケジュール
                                    </span>
                                    <span class="transform group-open:rotate-180 transition-transform text-gray-400">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </span>
                                </summary>
                                
                                <div class="p-4 flex flex-col gap-4">
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">期限日</label>
                                        <div class="relative">
                                            <input type="date" id="modal-task-date" value="${dueDateValue}"
                                                class="w-full pl-3 pr-10 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:justify-end [&::-webkit-calendar-picker-indicator]:cursor-pointer">
                                            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">繰り返し</label>
                                        <select id="modal-task-recurrence" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm appearance-none cursor-pointer">
                                            <option value="none" ${recurrence.type === 'none' ? 'selected' : ''}>なし</option>
                                            <option value="daily" ${recurrence.type === 'daily' ? 'selected' : ''}>毎日</option>
                                            <option value="weekly" ${recurrence.type === 'weekly' ? 'selected' : ''}>毎週</option>
                                            <option value="weekdays" ${recurrence.type === 'weekdays' ? 'selected' : ''}>平日 (月〜金)</option>
                                            <option value="monthly" ${recurrence.type === 'monthly' ? 'selected' : ''}>毎月</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">時間帯</label>
                                        <select id="modal-task-timeblock" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm appearance-none cursor-pointer">
                                            <option value="">未定</option>
                                            ${timeBlockOptions}
                                        </select>
                                    </div>

                                    <div>
                                        <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">所要時間</label>
                                        <select id="modal-task-duration" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm appearance-none cursor-pointer">
                                            <option value="">指定なし</option>
                                            ${durationOptions}
                                        </select>
                                    </div>

                                    <div id="recurrence-days-container" class="${recurrence.type !== 'weekly' ? 'hidden' : ''} pt-2 border-t border-gray-100 dark:border-gray-700">
                                        <label class="block text-xs font-semibold text-gray-500 mb-2 uppercase">繰り返す曜日</label>
                                        <div id="recurrence-days-checkboxes" class="flex flex-wrap gap-4">
                                            ${createDaysCheckboxesHTML(recurrence.days)}
                                        </div>
                                    </div>
                                </div>
                            </details>
                        </div>

                    </div>
                </div>

                <!-- フッター -->
                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center border-t border-gray-100 dark:border-gray-700">
                    <button id="delete-task-modal-btn" class="text-gray-400 hover:text-red-500 text-sm font-medium flex items-center group transition">
                        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        削除
                    </button>
                    <div class="flex gap-3">
                        <button id="cancel-modal-btn" class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 transition">キャンセル</button>
                        <button id="save-task-modal-btn" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md transition transform active:scale-95">保存</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}