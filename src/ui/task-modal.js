// @ts-nocheck
// @miyter:20251129

// ★修正: store.js から updateTask, deleteTask をインポート（ラッパー関数を使用）
import { updateTask, deleteTask } from '../store/store.js';
import { showMessageModal } from './components.js';
// task-modal-labels.js がある前提 (ラベル機能用)
import { renderModalLabels, setupLabelSelectOptions } from './task-modal-labels.js';

let currentTask = null;

// =========================================================
// 公開メソッド (main.js / app.js から呼ばれる)
// =========================================================

/**
 * モーダル機能の初期化 (アプリ起動時に1回呼ばれる)
 * ESCキーでの閉じる動作などを設定
 */
export function initTaskModal() {
    // ESCキーでモーダルを閉じる
    document.addEventListener('keydown', (e) => {
        const modalContainer = document.getElementById('modal-container');
        // モーダルが表示されている場合のみ反応
        if (e.key === 'Escape' && modalContainer && modalContainer.children.length > 0) {
            closeTaskModal();
        }
    });
}

/**
 * タスク編集モーダルを開く
 * @param {Object} task - 編集対象のタスクオブジェクト
 */
export function openTaskEditModal(task) {
    currentTask = task;
    
    let modalContainer = document.getElementById('modal-container');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'modal-container';
        document.body.appendChild(modalContainer);
    }

    const dueDateValue = task.dueDate && task.dueDate.toDate 
        ? formatDateForInput(task.dueDate.toDate()) 
        : (task.dueDate ? formatDateForInput(new Date(task.dueDate)) : '');

    const recurrenceType = (task.recurrence && task.recurrence.type) ? task.recurrence.type : 'none';
    
    // 曜日選択の初期状態を取得 (日曜=0, 月曜=1, ..., 土曜=6)
    const recurrenceDays = task.recurrence?.days || [];
    const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];
    
    // 曜日選択チェックボックスのHTMLを生成
    const daysCheckboxes = dayLabels.map((day, index) => `
        <label class="flex items-center space-x-1 cursor-pointer">
            <input type="checkbox" data-day-index="${index}" ${recurrenceDays.includes(index) ? 'checked' : ''} 
                   class="form-checkbox h-4 w-4 text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded">
            <span class="text-xs text-gray-700 dark:text-gray-300">${day}</span>
        </label>
    `).join('');

    // HTML生成
    modalContainer.innerHTML = `
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
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">期限日</label>
                            <input type="date" id="modal-task-date" value="${dueDateValue}"
                                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">繰り返し</label>
                            <select id="modal-task-recurrence" 
                                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 text-sm appearance-none">
                                <option value="none" ${recurrenceType === 'none' ? 'selected' : ''}>繰り返しなし</option>
                                <option value="daily" ${recurrenceType === 'daily' ? 'selected' : ''}>毎日</option>
                                <option value="weekly" ${recurrenceType === 'weekly' ? 'selected' : ''}>毎週</option>
                                <option value="monthly" ${recurrenceType === 'monthly' ? 'selected' : ''}>毎月</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- ★追加: 曜日選択 (weekly選択時のみ表示) -->
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
                                <select id="modal-add-label-select" class="text-xs bg-gray-100 dark:bg-gray-700 border-none rounded px-2 py-1 text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition focus:ring-0">
                                    <option value="">+ 追加</option>
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

    // イベント設定 & ラベル初期化
    setupModalEvents(modalContainer);
    refreshLabelsDisplay();
    
    // ラベル選択肢
    const addLabelSelect = document.getElementById('modal-add-label-select');
    if (addLabelSelect && typeof setupLabelSelectOptions === 'function') {
        setupLabelSelectOptions(addLabelSelect);
        
        addLabelSelect.onchange = async (e) => {
            const labelId = e.target.value;
            if (labelId && currentTask) { 
                const currentLabels = currentTask.labelIds || [];
                if (!currentLabels.includes(labelId)) {
                    const newLabelIds = [...currentLabels, labelId];
                    await updateTask(currentTask.id, { labelIds: newLabelIds }); // ★修正: userIdを削除
                    currentTask.labelIds = newLabelIds;
                    refreshLabelsDisplay();
                    showMessageModal("タグを追加しました");
                }
                e.target.value = '';
            }
        };
    }
    
    // ★追加: 繰り返しタイプの変更イベント
    const recurrenceSelect = document.getElementById('modal-task-recurrence');
    const daysContainer = document.getElementById('recurrence-days-container');
    if (recurrenceSelect && daysContainer) {
        recurrenceSelect.addEventListener('change', (e) => {
            if (e.target.value === 'weekly') {
                daysContainer.classList.remove('hidden');
            } else {
                daysContainer.classList.add('hidden');
            }
        });
    }
}

/**
 * モーダルを閉じる
 */
export function closeTaskModal() {
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
        modalContainer.innerHTML = '';
    }
    currentTask = null;
}

// =========================================================
// 内部ヘルパー
// =========================================================

function setupModalEvents(container) {
    // ★修正: userIdの取得とチェックを削除
    
    document.getElementById('close-modal-btn')?.addEventListener('click', closeTaskModal);
    document.getElementById('cancel-modal-btn')?.addEventListener('click', closeTaskModal);
    
    // 背景クリック
    container.querySelector('div.fixed')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeTaskModal();
    });

    // 保存
    document.getElementById('save-task-modal-btn')?.addEventListener('click', async () => {
        const newTitle = document.getElementById('modal-task-title').value.trim();
        const newDesc = document.getElementById('modal-task-desc').value.trim();
        const newDateVal = document.getElementById('modal-task-date').value;
        const newRecurrenceType = document.getElementById('modal-task-recurrence').value;
        
        if (!newTitle) {
            showMessageModal("タイトルを入力してください", null);
            return;
        }

        let recurrenceData = null;
        if (newRecurrenceType !== 'none') {
            if (newRecurrenceType === 'weekly') {
                const checkedDays = Array.from(document.querySelectorAll('#recurrence-days-checkboxes input[type="checkbox"]:checked'))
                    .map(cb => parseInt(cb.dataset.dayIndex, 10))
                    .sort((a, b) => a - b);
                
                if (checkedDays.length === 0) {
                    showMessageModal("毎週繰り返す設定の場合、少なくとも一つ曜日を選択してください。", null);
                    return;
                }
                recurrenceData = { type: newRecurrenceType, days: checkedDays };
            } else {
                recurrenceData = { type: newRecurrenceType };
            }
        }

        const updates = {
            title: newTitle,
            description: newDesc,
            dueDate: newDateVal ? new Date(newDateVal) : null,
            recurrence: recurrenceData // 更新された繰り返しデータ
        };

        // ★修正: userIdの引数を削除
        await updateTask(currentTask.id, updates);
        closeTaskModal();
    });

    // 削除
    document.getElementById('delete-task-modal-btn')?.addEventListener('click', () => {
        showMessageModal('本当に削除しますか？', async () => {
            // ★修正: userIdの引数を削除
            await deleteTask(currentTask.id);
            closeTaskModal();
        });
    });
}

function refreshLabelsDisplay() {
    const container = document.getElementById('modal-task-labels');
    // ★修正: userIdの取得とチェックを削除
    if (!container || !currentTask) return;
    
    const labelIds = currentTask.labelIds || [];
    
    if (typeof renderModalLabels === 'function') {
        renderModalLabels(container, labelIds, async (labelIdToRemove, labelName) => {
            if (!currentTask) return;
            const newLabelIds = (currentTask.labelIds || []).filter(id => id !== labelIdToRemove);
            // ★修正: userIdの引数を削除
            await updateTask(currentTask.id, { labelIds: newLabelIds });
            currentTask.labelIds = newLabelIds;
            refreshLabelsDisplay();
            showMessageModal(`タグ「${labelName}」を外しました`);
        });
    }
}

function formatDateForInput(date) {
    if (!date) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}