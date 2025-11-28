// タスク編集モーダルの制御ロジック (リファクタリング版)
// 機能: タスク編集、保存、削除

import { updateTask, deleteTask } from '@/store/store.js';
import { showMessageModal } from './components.js';
import { renderModalLabels, setupLabelSelectOptions } from './task-modal-labels.js';

let currentEditingTask = null;

/**
 * タスク編集モーダルを開く
 */
export function openTaskModal(task) {
    currentEditingTask = task;
    
    const modal = document.getElementById('task-edit-modal');
    const titleInput = document.getElementById('edit-task-title');
    const descInput = document.getElementById('edit-task-desc');
    const dueInput = document.getElementById('edit-task-due');
    const recurSelect = document.getElementById('edit-task-recurrence');
    const addLabelSelect = document.getElementById('edit-add-label-select');
    
    if (!modal) return;

    // 値をセット
    titleInput.value = task.title || '';
    descInput.value = task.description || '';
    
    // 日付セット
    if (task.dueDate) {
        try {
            const d = new Date(task.dueDate);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            dueInput.value = `${yyyy}-${mm}-${dd}`;
        } catch(e) { dueInput.value = ''; }
    } else {
        dueInput.value = '';
    }

    recurSelect.value = (task.recurrence && task.recurrence.type) ? task.recurrence.type : 'none';

    // ラベル表示の更新（別モジュールに委譲）
    refreshLabelsDisplay();

    // ラベル選択肢の再構築（別モジュールに委譲）
    setupLabelSelectOptions(addLabelSelect);

    modal.classList.remove('hidden');
}

/**
 * モーダル内のラベル表示をリフレッシュするヘルパー
 */
function refreshLabelsDisplay() {
    const container = document.getElementById('edit-task-labels');
    const labelIds = currentEditingTask ? (currentEditingTask.labelIds || []) : [];
    
    renderModalLabels(container, labelIds, async (labelIdToRemove, labelName) => {
        // 削除コールバック
        if (!currentEditingTask) return;
        
        const newLabelIds = labelIds.filter(id => id !== labelIdToRemove);
        
        // Firestore更新
        await updateTask(currentEditingTask.ownerId, currentEditingTask.id, { labelIds: newLabelIds });
        
        // 状態更新と再描画
        currentEditingTask.labelIds = newLabelIds;
        refreshLabelsDisplay();
        
        showMessageModal(`タグ「${labelName}」を外しました`);
    });
}

/**
 * モーダルを閉じる
 */
export function closeTaskModal() {
    const modal = document.getElementById('task-edit-modal');
    if (modal) modal.classList.add('hidden');
    currentEditingTask = null;
}

/**
 * モーダルのイベント初期化（外部から一度だけ呼ぶ）
 */
export function initTaskModal() {
    const saveBtn = document.getElementById('save-task-btn');
    const closeBtn = document.getElementById('close-edit-modal-btn');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    const deleteBtn = document.getElementById('delete-task-btn-modal');
    const addLabelSelect = document.getElementById('edit-add-label-select');
    
    // 保存ボタン
    if (saveBtn) {
        const newSave = saveBtn.cloneNode(true);
        saveBtn.parentNode.replaceChild(newSave, saveBtn);
        
        newSave.addEventListener('click', async () => {
            if (!currentEditingTask) return;
            
            const title = document.getElementById('edit-task-title').value;
            const description = document.getElementById('edit-task-desc').value;
            const dueDateVal = document.getElementById('edit-task-due').value;
            const recurrenceType = document.getElementById('edit-task-recurrence').value;
            
            if (!title.trim()) {
                showMessageModal('タイトルを入力してください');
                return;
            }

            const updates = {
                title: title.trim(),
                description: description.trim(),
                dueDate: dueDateVal ? new Date(dueDateVal).toISOString() : null,
                recurrence: recurrenceType !== 'none' ? { type: recurrenceType } : null
            };
            
            const userId = currentEditingTask.ownerId; 
            if (userId) {
                await updateTask(userId, currentEditingTask.id, updates);
                closeTaskModal();
                showMessageModal("タスクを更新しました");
            }
        });
    }

    // 削除ボタン
    if (deleteBtn) {
        const newDelete = deleteBtn.cloneNode(true);
        deleteBtn.parentNode.replaceChild(newDelete, deleteBtn);
        newDelete.onclick = async () => {
            if (!currentEditingTask) return;
             showMessageModal("本当にこのタスクを削除しますか？", async () => {
                await deleteTask(currentEditingTask.ownerId, currentEditingTask.id);
                closeTaskModal();
                showMessageModal("タスクを削除しました");
             });
        };
    }

    // ラベル追加プルダウン
    if (addLabelSelect) {
        addLabelSelect.onchange = async (e) => {
             const labelId = e.target.value;
             if (labelId && currentEditingTask) {
                 const currentLabels = currentEditingTask.labelIds || [];
                 if (!currentLabels.includes(labelId)) {
                     const newLabelIds = [...currentLabels, labelId];
                     
                     await updateTask(currentEditingTask.ownerId, currentEditingTask.id, { labelIds: newLabelIds });
                     
                     currentEditingTask.labelIds = newLabelIds;
                     refreshLabelsDisplay(); // 再描画
                     showMessageModal("タグを追加しました");
                 }
                 e.target.value = '';
             }
         };
    }

    if(closeBtn) closeBtn.onclick = closeTaskModal;
    if(cancelBtn) cancelBtn.onclick = closeTaskModal;
}