// @ts-nocheck
// @miyter:20251221
// タスク編集モーダルのメインコントローラー

import { updateTask, deleteTask } from '../../store/store.js';
import { showMessageModal } from '../components.js';
import { setupMarkdownControls } from './task-modal-markdown.js';
import { setupRecurrenceControls } from './task-modal-recurrence.js';

/**
 * モーダル内のイベントリスナーを設定
 */
export function setupTaskModalEvents(container, currentTask, onClose) {
    // 1. 基本的な閉じる操作
    container.querySelector('#close-modal-btn')?.addEventListener('click', onClose);
    container.querySelector('#cancel-modal-btn')?.addEventListener('click', onClose);
    container.querySelector('div.fixed')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) onClose();
    });

    // 2. データ操作（保存・削除）
    container.querySelector('#save-task-modal-btn')?.addEventListener('click', async () => {
        await handleSaveTask(currentTask, onClose);
    });

    container.querySelector('#delete-task-modal-btn')?.addEventListener('click', () => {
        showMessageModal('本当に削除しますか？', async () => {
            await deleteTask(currentTask.id);
            onClose();
        });
    });

    // 3. UIサブモジュールの初期化
    setupRecurrenceControls();
    setupMarkdownControls();
}

/**
 * データの収集と保存処理
 */
async function handleSaveTask(currentTask, onClose) {
    const getVal = (id) => document.getElementById(id)?.value;

    const title = getVal('modal-task-title')?.trim();
    if (!title) {
        showMessageModal("タイトルを入力してください");
        return;
    }

    // 繰り返しデータの取得
    const recurrenceType = getVal('modal-task-recurrence');
    let recurrence = null;
    if (recurrenceType !== 'none') {
        recurrence = { type: recurrenceType };
        if (recurrenceType === 'weekly') {
            const days = Array.from(document.querySelectorAll('#recurrence-days-checkboxes input:checked'))
                .map(cb => parseInt(cb.dataset.dayIndex, 10))
                .sort((a, b) => a - b);
            
            if (days.length === 0) {
                showMessageModal("曜日を選択してください");
                return;
            }
            recurrence.days = days;
        }
    }

    const updates = {
        title,
        description: getVal('modal-task-desc')?.trim() || '',
        dueDate: getVal('modal-task-date') ? new Date(getVal('modal-task-date')) : null,
        recurrence,
        timeBlockId: getVal('modal-task-timeblock') || null,
        duration: getVal('modal-task-duration') ? parseInt(getVal('modal-task-duration'), 10) : null
    };

    try {
        await updateTask(currentTask.id, updates);
        onClose();
    } catch (e) {
        console.error("Failed to update task:", e);
    }
}