// @ts-nocheck
// タスク編集モーダル内のイベントハンドリングとロジック

import { updateTask, deleteTask } from '../../store/store.js';
import { showMessageModal } from '../components.js';
import { getInitialDueDateFromRecurrence } from '../../utils/date.js';
import { renderModalLabels, setupLabelSelectOptions } from './task-modal-labels.js';

/**
 * モーダル内のイベントリスナーを設定する
 * @param {HTMLElement} container - モーダルのコンテナ要素
 * @param {Object} currentTask - 編集中のタスクオブジェクト
 * @param {Function} onClose - モーダルを閉じるためのコールバック関数
 */
export function setupTaskModalEvents(container, currentTask, onClose) {
    // 閉じる・キャンセルボタン
    container.querySelector('#close-modal-btn')?.addEventListener('click', onClose);
    container.querySelector('#cancel-modal-btn')?.addEventListener('click', onClose);
    
    // 背景クリックで閉じる
    container.querySelector('div.fixed')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) onClose();
    });

    // 保存ボタン
    container.querySelector('#save-task-modal-btn')?.addEventListener('click', async () => {
        await handleSaveTask(currentTask, onClose);
    });

    // 削除ボタン
    container.querySelector('#delete-task-modal-btn')?.addEventListener('click', () => {
        showMessageModal('本当に削除しますか？', async () => {
            await deleteTask(currentTask.id);
            onClose();
        });
    });

    // 繰り返し・日付制御のセットアップ
    setupRecurrenceControls();

    // ラベル機能のセットアップ
    setupLabelControls(currentTask);
}

/**
 * タスク保存処理
 */
async function handleSaveTask(currentTask, onClose) {
    const newTitle = document.getElementById('modal-task-title').value.trim();
    const newDesc = document.getElementById('modal-task-desc').value.trim();
    const newDateVal = document.getElementById('modal-task-date').value;
    const newRecurrenceType = document.getElementById('modal-task-recurrence').value;
    
    // 時間帯と所要時間
    const newTimeBlockId = document.getElementById('modal-task-timeblock').value;
    const newDuration = document.getElementById('modal-task-duration').value;

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
        recurrence: recurrenceData,
        timeBlockId: newTimeBlockId || null,
        duration: newDuration ? parseInt(newDuration, 10) : null
    };

    await updateTask(currentTask.id, updates);
    onClose();
}

/**
 * 繰り返し設定のUI制御（週次選択時の曜日表示など）
 */
function setupRecurrenceControls() {
    const recurrenceSelect = document.getElementById('modal-task-recurrence');
    const daysContainer = document.getElementById('recurrence-days-container');
    const dueDateInput = document.getElementById('modal-task-date');

    if (!recurrenceSelect || !daysContainer || !dueDateInput) return;

    const handleRecurrenceChange = (e) => {
        const newRecurrenceType = e.target.value;
        const isWeekly = newRecurrenceType === 'weekly';

        if (isWeekly) {
            daysContainer.classList.remove('hidden');
        } else {
            daysContainer.classList.add('hidden');
        }
        
        if (newRecurrenceType !== 'none') {
            const tempRecurrence = { type: newRecurrenceType };

            if (isWeekly) {
                setupWeeklyDaysEvents(dueDateInput, daysContainer);
                // 現在チェックされている曜日を取得して初期日付計算に反映
                const checkedDays = Array.from(daysContainer.querySelectorAll('input[type="checkbox"]:checked'))
                    .map(cb => parseInt(cb.dataset.dayIndex, 10));
                tempRecurrence.days = checkedDays;
            }
            
            const newDate = getInitialDueDateFromRecurrence(tempRecurrence);
            dueDateInput.value = newDate.toISOString().substring(0, 10);
        }
    };

    recurrenceSelect.addEventListener('change', handleRecurrenceChange);

    // 初期状態のセットアップ
    if (recurrenceSelect.value === 'weekly') {
        daysContainer.classList.remove('hidden');
        setupWeeklyDaysEvents(dueDateInput, daysContainer);
    }
}

/**
 * 曜日チェックボックスのイベント設定
 */
function setupWeeklyDaysEvents(dueDateInput, daysContainer) {
    const checkboxes = daysContainer.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
        // 重複登録を防ぐため一旦削除
        cb.removeEventListener('change', updateDueDateOnDayChange);
        cb.addEventListener('change', updateDueDateOnDayChange);
    });

    function updateDueDateOnDayChange() {
        const checkedDays = Array.from(daysContainer.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => parseInt(cb.dataset.dayIndex, 10));

        if (checkedDays.length > 0) {
            const tempRecurrence = { type: 'weekly', days: checkedDays };
            const newDate = getInitialDueDateFromRecurrence(tempRecurrence);
            dueDateInput.value = newDate.toISOString().substring(0, 10);
        }
    }
}

/**
 * ラベル操作のセットアップ
 */
function setupLabelControls(currentTask) {
    refreshLabelsDisplay(currentTask);
    
    const addLabelSelect = document.getElementById('modal-add-label-select');
    if (addLabelSelect && typeof setupLabelSelectOptions === 'function') {
        setupLabelSelectOptions(addLabelSelect);
        
        addLabelSelect.onchange = async (e) => {
            const labelId = e.target.value;
            if (labelId && currentTask) { 
                const currentLabels = currentTask.labelIds || [];
                if (!currentLabels.includes(labelId)) {
                    const newLabelIds = [...currentLabels, labelId];
                    await updateTask(currentTask.id, { labelIds: newLabelIds });
                    
                    // タスクオブジェクトを更新して再描画
                    currentTask.labelIds = newLabelIds;
                    refreshLabelsDisplay(currentTask);
                    showMessageModal("タグを追加しました");
                }
                e.target.value = '';
            }
        };
    }
}

/**
 * ラベル表示のリフレッシュ
 */
function refreshLabelsDisplay(currentTask) {
    const container = document.getElementById('modal-task-labels');
    if (!container || !currentTask) return;
    
    const labelIds = currentTask.labelIds || [];
    
    if (typeof renderModalLabels === 'function') {
        renderModalLabels(container, labelIds, async (labelIdToRemove, labelName) => {
            if (!currentTask) return;
            const newLabelIds = (currentTask.labelIds || []).filter(id => id !== labelIdToRemove);
            await updateTask(currentTask.id, { labelIds: newLabelIds });
            currentTask.labelIds = newLabelIds;
            refreshLabelsDisplay(currentTask);
            showMessageModal(`タグ「${labelName}」を外しました`);
        });
    }
}