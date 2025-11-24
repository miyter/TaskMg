// 更新日: 2025-11-25
// 役割: タスク追加フォームの制御、およびリスト/モーダルモジュールの連携

import { addTask } from '../store/store.js';
import { initTaskModal } from './task-modal.js';
import { renderTaskList } from './task-list.js';

// =========================================================
// UI要素の参照 (入力フォーム)
// =========================================================
const taskTitleInput = document.getElementById('task-title-input');
const taskDueDateInput = document.getElementById('task-due-date-input');
const taskDescInput = document.getElementById('task-desc-input');
const recurrenceSelect = document.getElementById('task-recurrence-select');
const addTaskBtn = document.getElementById('add-task-btn');


// =========================================================
// 公開メソッド
// =========================================================

export { renderTaskList }; // リスト描画は外部に公開

export function initTaskView(onAdd) {
    // 1. モーダルロジックの初期化 (編集、保存、削除ボタンのリスナー設定)
    initTaskModal();
    
    if (!addTaskBtn) return;

    // イベント二重登録防止のためクローンで置き換え (リセット処理)
    const newBtn = addTaskBtn.cloneNode(true);
    addTaskBtn.parentNode.replaceChild(newBtn, addTaskBtn);
    
    newBtn.addEventListener('click', () => {
        const title = taskTitleInput.value.trim();
        if (!title) return;

        // onAdd を呼び出し、main.js へ処理を委譲
        onAdd({
            title,
            dueDate: taskDueDateInput.value ? new Date(taskDueDateInput.value) : null,
            description: taskDescInput.value,
            recurrence: recurrenceSelect.value
        });

        // 入力リセットは main.js から呼び出される showToast に含めるべきだが、
        // 簡易化のためここで直接リセット
        taskTitleInput.value = '';
        taskDescInput.value = '';
        taskDueDateInput.value = '';
        recurrenceSelect.value = 'none';
    });
}