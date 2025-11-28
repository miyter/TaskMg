// タスク編集モーダルの制御ロジック
// 機能: タスク編集、ラベル付け替え、削除

import { updateTask, deleteTask } from '@/store/store.js';
import { getLabelDetails } from './sidebar.js'; 
import { showMessageModal } from './components.js';

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

    // ラベル表示の更新
    updateModalLabels(task.id, task.labelIds);

    // ラベル選択肢の再構築
    if (addLabelSelect) {
        const labelList = document.getElementById('label-list');
        // sidebar.jsが描画したDOMからラベル情報を取得
        const allLabels = Array.from(labelList ? labelList.querySelectorAll('li') : []).map(li => ({
            id: li.dataset.id,
            name: li.textContent.trim(),
            color: li.querySelector('span')?.style.backgroundColor 
        }));
        
        addLabelSelect.innerHTML = '<option value="">＋ タグを追加...</option>';
        allLabels.forEach(l => {
            const opt = document.createElement('option');
            opt.value = l.id;
            opt.textContent = l.name;
            addLabelSelect.appendChild(opt);
        });
        addLabelSelect.value = '';
    }

    modal.classList.remove('hidden');
    // イベント設定は initTaskModal で行うため、ここでは呼ばない
}

/**
 * モーダル内のラベル表示を更新
 */
function updateModalLabels(taskId, labelIds = []) {
    const container = document.getElementById('edit-task-labels');
    if (!container) return;
    container.innerHTML = '';
    
    labelIds.forEach(lid => {
        const label = getLabelDetails(lid);
        if (!label) return;

        const badge = document.createElement('span');
        badge.className = "text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200";
        
        badge.innerHTML = `
            <span class="w-2 h-2 rounded-full" style="background-color: ${label.color}"></span>
            ${label.name}
            <button class="text-gray-400 hover:text-red-500 ml-1 remove-tag-modal transition-colors rounded-full p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600" data-lid="${lid}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        badge.querySelector('.remove-tag-modal').onclick = async (e) => {
            e.stopPropagation();
            if(!currentEditingTask) return;
            const newLabelIds = (currentEditingTask.labelIds || []).filter(id => id !== lid);
            await updateTask(currentEditingTask.ownerId, taskId, { labelIds: newLabelIds });
            currentEditingTask.labelIds = newLabelIds;
            updateModalLabels(taskId, newLabelIds);
            showMessageModal(`タグ「${label.name}」を外しました`);
        };
        container.appendChild(badge);
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
 * ★追加: モーダルのイベント初期化（外部から一度だけ呼ぶ）
 */
export function initTaskModal() {
    const saveBtn = document.getElementById('save-task-btn');
    const closeBtn = document.getElementById('close-edit-modal-btn');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    const deleteBtn = document.getElementById('delete-task-btn-modal');
    const addLabelSelect = document.getElementById('edit-add-label-select');
    
    if (saveBtn) {
        // クローン置換で重複リスナー防止
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

    if (addLabelSelect) {
        addLabelSelect.onchange = async (e) => {
             const labelId = e.target.value;
             if (labelId && currentEditingTask) {
                 const currentLabels = currentEditingTask.labelIds || [];
                 if (!currentLabels.includes(labelId)) {
                     const newLabelIds = [...currentLabels, labelId];
                     await updateTask(currentEditingTask.ownerId, currentEditingTask.id, { labelIds: newLabelIds });
                     currentEditingTask.labelIds = newLabelIds;
                     updateModalLabels(currentEditingTask.id, newLabelIds);
                     showMessageModal("タグを追加しました");
                 }
                 e.target.value = '';
             }
         };
    }

    if(closeBtn) closeBtn.onclick = closeTaskModal;
    if(cancelBtn) cancelBtn.onclick = closeTaskModal;
}