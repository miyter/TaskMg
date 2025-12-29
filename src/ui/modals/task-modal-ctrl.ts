/**
 * タスク編集モーダルのメインコントローラー
 * TypeScript化: 2025-12-29
 */
import { Timestamp } from 'firebase/firestore';
import { Recurrence, Task } from '../../store/schema';
import { deleteTask, updateTask } from '../../store/store';
import { showMessageModal } from '../components';
import { setupMarkdownControls } from './task-modal-markdown';
import { setupRecurrenceControls } from './task-modal-recurrence';

interface ModalElements {
    title: HTMLInputElement | null;
    desc: HTMLTextAreaElement | null;
    date: HTMLInputElement | null;
    recurrence: HTMLSelectElement | null;
    timeblock: HTMLSelectElement | null;
    duration: HTMLSelectElement | null;
    saveBtn: HTMLButtonElement | null;
    deleteBtn: HTMLButtonElement | null;
    closeBtn: HTMLButtonElement | null;
    cancelBtn: HTMLButtonElement | null;
    overlay: HTMLDivElement | null;
    [key: string]: HTMLElement | null; // インデックスシグネチャ
}

let modalElements: ModalElements = {
    title: null,
    desc: null,
    date: null,
    recurrence: null,
    timeblock: null,
    duration: null,
    saveBtn: null,
    deleteBtn: null,
    closeBtn: null,
    cancelBtn: null,
    overlay: null
};

/**
 * モーダル内の要素をキャッシュ
 */
function cacheElements(container: HTMLElement) {
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
export function setupTaskModalEvents(container: HTMLElement, currentTask: Task, onClose: () => void) {
    cacheElements(container);

    const { closeBtn, cancelBtn, overlay, saveBtn, deleteBtn } = modalElements;

    // 1. 基本的な閉じる操作
    [closeBtn, cancelBtn].forEach(btn => btn?.addEventListener('click', onClose));
    overlay?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) onClose();
    });

    // スケジュール設定の開閉状態を保存
    const scheduleDetails = container.querySelector('#modal-task-schedule-details') as HTMLDetailsElement;
    if (scheduleDetails) {
        scheduleDetails.addEventListener('toggle', () => {
            localStorage.setItem('task_modal_schedule_open', String(scheduleDetails.open));
        });
    }

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
                    await deleteTask(currentTask.id!);
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
async function handleSaveTask(currentTask: Task, onClose: () => void) {
    const title = modalElements.title?.value?.trim();
    if (!title) {
        showMessageModal({ message: "タイトルを入力してくれ", type: 'error' });
        return;
    }

    // 日付バリデーション
    const dateStr = modalElements.date?.value;
    const dueDate = dateStr ? new Date(dateStr) : null;
    if (dateStr && dueDate && isNaN(dueDate.getTime())) {
        showMessageModal({ message: "無効な日付だ", type: 'error' });
        return;
    }
    // Firebase用のTimestampに変換が必要な場合は呼び出し元かstoreで処理されるべきだが、
    // Dateオブジェクトのまま渡すルールになっていると仮定

    // 繰り返しデータの取得
    const recurrenceType = modalElements.recurrence?.value;
    let recurrence: Recurrence = null;

    // 'none' も型定義に含まれるようになったが、保存時には null にするのが適切か、あるいは { type: 'none' } にするか。
    // 従来のロジックでは 'none' の場合は null (または undefined) としていたようなのでそれに従う。
    if (recurrenceType && recurrenceType !== 'none') {
        // 部分的に構築
        const tempRecurrence: any = { type: recurrenceType };

        if (recurrenceType === 'weekly') {
            const days = Array.from(document.querySelectorAll('#recurrence-days-checkboxes input:checked'))
                // @ts-ignore
                .map(cb => parseInt(cb.dataset.dayIndex ?? '', 10))
                .filter(n => !isNaN(n))
                .sort((a, b) => a - b);

            if (days.length === 0) {
                showMessageModal({ message: "曜日を選択してくれ", type: 'error' });
                return;
            }
            tempRecurrence.days = days;
        }
        recurrence = tempRecurrence as Recurrence;
    }

    // 所要時間の取得（NaNチェック）
    const durVal = parseInt(modalElements.duration?.value || '', 10);
    const duration = isNaN(durVal) ? undefined : durVal; // schemaはoptional(number | undefined)なのでnullは不可

    const updates = {
        title,
        description: modalElements.desc?.value?.trim() || '',
        dueDate: dueDate ? Timestamp.fromDate(dueDate) : null, // Timestamp変換
        recurrence,
        timeBlockId: modalElements.timeblock?.value || null,
        duration,
        updatedAt: Timestamp.now()
    };

    try {
        await updateTask(currentTask.id!, updates);
        onClose();
    } catch (e) {
        console.error("Failed to update task:", e);
        showMessageModal({ message: "保存に失敗した", type: 'error' });
    }
}
