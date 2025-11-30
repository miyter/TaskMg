// @ts-nocheck
// @miyter:20251129

import { updateTask, deleteTask } from '../store/store.js';
import { showMessageModal } from './components.js';
// ★修正: task-modal-labels.js のパスを modal/ に変更
import { renderModalLabels, setupLabelSelectOptions } from './modal/task-modal-labels.js';

// ★修正: 分割したモジュールをインポート
import { buildModalHTML } from './modal/modal-dom-generator.js';
// ★追加: 日付ヘルパーをインポート
import { getInitialDueDateFromRecurrence } from '../utils/date.js';

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
    
    // ★修正: buildModalHTML を使ってHTMLを生成
    modalContainer.innerHTML = buildModalHTML(task);

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
                    // ★Firestoreを直接更新
                    await updateTask(currentTask.id, { labelIds: newLabelIds });
                    currentTask.labelIds = newLabelIds;
                    refreshLabelsDisplay();
                    showMessageModal("タグを追加しました");
                }
                e.target.value = '';
            }
        };
    }
    
    // 繰り返しタイプの変更イベントと曜日コンテナの制御
    const recurrenceSelect = document.getElementById('modal-task-recurrence');
    const daysContainer = document.getElementById('recurrence-days-container');
    const dueDateInput = document.getElementById('modal-task-date'); // ★期限日入力フィールドを取得

    if (recurrenceSelect && daysContainer && dueDateInput) {
        // ★修正: 繰り返しタイプの変更時、期限日を自動設定するロジックを追加
        const handleRecurrenceChange = (e) => {
            const newRecurrenceType = e.target.value;
            const isWeekly = newRecurrenceType === 'weekly';

            if (isWeekly) {
                daysContainer.classList.remove('hidden');
            } else {
                daysContainer.classList.add('hidden');
            }
            
            // ★繰り返しが設定された場合、期限日を自動で設定
            if (newRecurrenceType !== 'none') {
                // 繰り返し設定オブジェクトを作成 (daysはまだ未設定だが、typeは分かる)
                const tempRecurrence = { type: newRecurrenceType };

                // 曜日設定の初期化/イベント設定
                if (isWeekly) {
                    // 週間設定の場合は、曜日チェックボックスのイベントを設定
                    setupWeeklyDaysEvents(dueDateInput, daysContainer);
                    // 選択された曜日に基づき、初期日付を設定（初期状態で何もチェックされていなければ今日）
                    const checkedDays = Array.from(daysContainer.querySelectorAll('input[type="checkbox"]:checked'))
                        .map(cb => parseInt(cb.dataset.dayIndex, 10));
                    tempRecurrence.days = checkedDays;
                }
                
                // 新しい期限日を計算し、フィールドに反映
                const newDate = getInitialDueDateFromRecurrence(tempRecurrence);
                dueDateInput.value = newDate.toISOString().substring(0, 10); // YYYY-MM-DD形式
            } else {
                // noneに戻した場合、日付をクリアするかどうかはユーザーの判断に委ねるため、ここでは変更しない
            }
        };

        recurrenceSelect.addEventListener('change', handleRecurrenceChange);

        // ★初期表示がweeklyの場合、曜日チェックボックスのイベントを設定
        if (recurrenceSelect.value === 'weekly') {
            daysContainer.classList.remove('hidden');
            setupWeeklyDaysEvents(dueDateInput, daysContainer);
        }
    }
}

// ★追加: 毎週繰り返しの曜日チェックボックスイベント設定
function setupWeeklyDaysEvents(dueDateInput, daysContainer) {
    // チェックボックス全てにイベントを設定
    const checkboxes = daysContainer.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
        // イベントリスナーを一度だけ追加するために、既存のものを削除（DOM生成の都合上）
        cb.removeEventListener('change', updateDueDateOnDayChange);
        cb.addEventListener('change', updateDueDateOnDayChange);
    });

    function updateDueDateOnDayChange() {
        // 現在チェックされている曜日を取得
        const checkedDays = Array.from(daysContainer.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => parseInt(cb.dataset.dayIndex, 10));

        if (checkedDays.length > 0) {
            // 新しい繰り返し設定を作成
            const tempRecurrence = { type: 'weekly', days: checkedDays };
            
            // 新しい期限日を計算し、フィールドに反映
            const newDate = getInitialDueDateFromRecurrence(tempRecurrence);
            dueDateInput.value = newDate.toISOString().substring(0, 10); // YYYY-MM-DD形式
        }
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
            // ★修正: 日付入力フィールドが空の場合（""）はnullにする。
            dueDate: newDateVal ? new Date(newDateVal) : null,
            recurrence: recurrenceData // 更新された繰り返しデータ
        };

        await updateTask(currentTask.id, updates);
        closeTaskModal();
    });

    // 削除
    document.getElementById('delete-task-modal-btn')?.addEventListener('click', () => {
        showMessageModal('本当に削除しますか？', async () => {
            await deleteTask(currentTask.id);
            closeTaskModal();
        });
    });
}

function refreshLabelsDisplay() {
    const container = document.getElementById('modal-task-labels');
    if (!container || !currentTask) return;
    
    const labelIds = currentTask.labelIds || [];
    
    if (typeof renderModalLabels === 'function') {
        renderModalLabels(container, labelIds, async (labelIdToRemove, labelName) => {
            if (!currentTask) return;
            const newLabelIds = (currentTask.labelIds || []).filter(id => id !== labelIdToRemove);
            await updateTask(currentTask.id, { labelIds: newLabelIds });
            currentTask.labelIds = newLabelIds;
            refreshLabelsDisplay();
            showMessageModal(`タグ「${labelName}」を外しました`);
        });
    }
}