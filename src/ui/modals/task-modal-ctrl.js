/**
 * タスク編集モーダルのメインコントローラー
 */
import { updateTask, deleteTask } from '../../store/store.js';
import { showMessageModal } from '../components.js';
import { setupMarkdownControls } from './task-modal-markdown.js';
import { setupRecurrenceControls } from './task-modal-recurrence.js';

let modalElements = {};

/**
 * モーダル内の要素をキャッシュ
 */
function cacheElements(container) {
    modalElements = {
        title: container.querySelector('#modal-task-title'),
        desc: container.querySelector('#modal-task-desc'),
        date: container.querySelector('#modal-task-date'),
        recurrence: container.querySelector('#modal-task-recurrence'),
        timeblock: container.querySelector('#modal-task-timeblock'),
        duration: container.querySelector('#modal-task-duration'),
        saveBtn: container.querySelector('#save-task-modal-btn'),
        deleteBtn: container.querySelector('#delete-task-modal-btn'),
        closeBtn: container.querySelector('#close-modal-btn'),
        cancelBtn: container.querySelector('#cancel-modal-btn'),
        overlay: container.querySelector('div.fixed')
    };
}

/**
 * モーダル内のイベントリスナーを設定
 */
export function setupTaskModalEvents(container, currentTask, onClose) {
    cacheElements(container);

    const { closeBtn, cancelBtn, overlay, saveBtn, deleteBtn } = modalElements;

    // 1. 基本的な閉じる操作
    [closeBtn, cancelBtn].forEach(btn => btn?.addEventListener('click', onClose));
    overlay?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) onClose();
    });

    // 2. データ操作
    saveBtn?.addEventListener('click', async () => {
        await handleSaveTask(currentTask, onClose);
    });

    deleteBtn?.addEventListener('click', () => {
        showMessageModal({
            message: '本当に削除するか？',
            type: 'confirm',
            onConfirm: async () => {
                try {
                    await deleteTask(currentTask.id);
                    onClose();
                } catch (e) {
                    showMessageModal({ message: "削除に失敗した", type: 'error' });
                }
            }
        });
    });

    // 日付入力のクリック体験向上 (カレンダーを明示的に開く)
    const dateInput = modalElements.date;
    if (dateInput) {
        dateInput.addEventListener('click', (e) => {
            if (typeof dateInput.showPicker === 'function') {
                try {
                    dateInput.showPicker();
                } catch (err) {
                    // preventDefaultなどが影響する場合の対策（通常は不要）
                    console.debug('showPicker failed or already open', err);
                }
            }
        });
    }

    // 3. UIサブモジュールの初期化
    setupRecurrenceControls();
    setupMarkdownControls();
}

/**
 * データの収集と保存処理
 */
async function handleSaveTask(currentTask, onClose) {
    const title = modalElements.title?.value?.trim();
    if (!title) {
        showMessageModal({ message: "タイトルを入力してくれ", type: 'error' });
        return;
    }

    // 日付バリデーション
    const dateStr = modalElements.date?.value;
    const dueDate = dateStr ? new Date(dateStr) : null;
    if (dateStr && isNaN(dueDate.getTime())) {
        showMessageModal({ message: "無効な日付だ", type: 'error' });
        return;
    }

    // 繰り返しデータの取得
    const recurrenceType = modalElements.recurrence?.value;
    let recurrence = null;
    if (recurrenceType !== 'none') {
        recurrence = { type: recurrenceType };
        if (recurrenceType === 'weekly') {
            const days = Array.from(document.querySelectorAll('#recurrence-days-checkboxes input:checked'))
                .map(cb => parseInt(cb.dataset.dayIndex ?? '', 10))
                .filter(n => !isNaN(n))
                .sort((a, b) => a - b);

            if (days.length === 0) {
                showMessageModal({ message: "曜日を選択してくれ", type: 'error' });
                return;
            }
            recurrence.days = days;
        }
    }

    // 所要時間の取得（NaNチェック）
    const durVal = parseInt(modalElements.duration?.value, 10);
    const duration = isNaN(durVal) ? null : durVal;

    const updates = {
        title,
        description: modalElements.desc?.value?.trim() || '',
        dueDate,
        recurrence,
        timeBlockId: modalElements.timeblock?.value || null,
        duration
    };

    try {
        await updateTask(currentTask.id, updates);
        onClose();
    } catch (e) {
        console.error("Failed to update task:", e);
        showMessageModal({ message: "保存に失敗した", type: 'error' });
    }
}