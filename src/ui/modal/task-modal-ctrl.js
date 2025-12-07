// @ts-nocheck
// タスク編集モーダル内のイベントハンドリングとロジック

import { updateTask, deleteTask } from '../../store/store.js';
import { showMessageModal } from '../components.js';
import { getInitialDueDateFromRecurrence } from '../../utils/date.js';
// ★修正: ラベル関連のインポートを削除 (機能が不要になったため、インポート行自体を削除)
import { simpleMarkdownToHtml } from '../../utils/markdown.js';


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

    // Markdown入力/プレビューの制御
    setupMarkdownControls();
}

/**
 * Markdown入力/プレビューの制御を設定
 */
function setupMarkdownControls() {
    const textarea = document.getElementById('modal-task-desc');
    const previewDiv = document.getElementById('modal-task-desc-preview');
    const toggleButton = document.getElementById('toggle-memo-view');

    if (!textarea || !previewDiv || !toggleButton) return;

    let isEditing = true;

    const renderPreview = () => {
        const markdown = textarea.value;
        // ★修正: utilsからインポートした関数を使用
        previewDiv.innerHTML = simpleMarkdownToHtml(markdown);
    };
    
    const toggleView = () => {
        isEditing = !isEditing;

        if (isEditing) {
            // 編集モード
            textarea.classList.remove('hidden');
            previewDiv.classList.add('hidden');
            toggleButton.textContent = 'プレビュー';
        } else {
            // プレビューモード
            renderPreview();
            textarea.classList.add('hidden');
            previewDiv.classList.remove('hidden');
            toggleButton.textContent = '編集';
        }
    };
    
    // プレビュー/編集切り替えボタンのイベント
    toggleButton.addEventListener('click', toggleView);
    
    // 入力中のリアルタイムプレビュー（プレビューモードにいない場合）
    // NOTE: inputイベントで毎回レンダリングすると重くなる可能性があるため、
    // ここでは編集モード中はシンプルに保ち、トグル時のみレンダリングする。
    // しかし、初期レンダリングのため、一旦 input も残しておく。
    textarea.addEventListener('input', renderPreview);
    
    // 初期状態で一度プレビューをレンダリングしておく
    // 編集モード（デフォルト）で開くが、プレビューHTMLを初期化しておく
    renderPreview();
    textarea.classList.remove('hidden');
    previewDiv.classList.add('hidden');
    toggleButton.textContent = 'プレビュー';
}


/**
 * タスク保存処理
 */
async function handleSaveTask(currentTask, onClose) {
// ... (中略: タスクのタイトル、説明、日付、繰り返し、時間帯、所要時間を取得)
    const newTitle = document.getElementById('modal-task-title').value.trim();
    // ★修正: プレビューモードであっても、保存するのはtextareaの値
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

    // ★削除: ラベルIDの更新を削除 (ラベル機能自体がなくなったため)
    // if (currentTask.labelIds) updates.labelIds = currentTask.labelIds;


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