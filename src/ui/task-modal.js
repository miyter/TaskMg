// @ts-nocheck
// @miyter:20251129

import { updateTask, deleteTask } from '../store/store.js';
import { showMessageModal } from './components.js';
// ★修正: task-modal-labels.js のパスを modal/ に変更
import { renderModalLabels, setupLabelSelectOptions } from './modal/task-modal-labels.js';

// ★修正: 分割したモジュールをインポート
import { buildModalHTML } from './modal/modal-dom-generator.js';

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
                    await updateTask(currentTask.id, { labelIds: newLabelIds });
                    currentTask.labelIds = newLabelIds;
                    refreshLabelsDisplay();
                    showMessageModal("タグを追加しました");
                }
                e.target.value = '';
            }
        };
    }
    
    // 繰り返しタイプの変更イベント
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