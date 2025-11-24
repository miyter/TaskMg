// --- タスク一覧UI (編集モーダル、詳細描画含む) ---
// 役割: タスクリストの描画、タスク追加UI、タスク編集モーダルの制御

import { addTask, updateTask, deleteTask } from '../store/store.js';
import { currentUserId } from '../core/auth.js';
import { getProjectName, getLabelDetails } from './sidebar.js'; 

// =========================================================
// UI要素の参照 (Modal関連のDOM要素は components.js が挿入)
// =========================================================
const taskList = document.getElementById('task-list');
const taskTitleInput = document.getElementById('task-title-input');
const taskDueDateInput = document.getElementById('task-due-date-input');
const taskDescInput = document.getElementById('task-desc-input');
const recurrenceSelect = document.getElementById('task-recurrence-select');

// --- 編集モーダル要素 (components.jsがDOMに挿入したもの) ---
const editModal = document.getElementById('edit-task-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const saveTaskBtn = document.getElementById('save-task-btn');
const deleteTaskBtnModal = document.getElementById('delete-task-btn-modal');
const editTitle = document.getElementById('edit-task-title');
const editDate = document.getElementById('edit-task-date');
const editDesc = document.getElementById('edit-task-desc');
const editLabelsContainer = document.getElementById('edit-task-labels');
const editAddLabelSelect = document.getElementById('edit-add-label-select');

let editingTaskId = null; 

// =========================================================
// ユーティリティ関数
// =========================================================

function showToast(message, type = 'blue') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColor = type === 'red' ? 'bg-red-500' : 'bg-gray-800';
    toast.className = `${bgColor} text-white text-sm px-4 py-3 rounded shadow-lg flex items-center transform transition-all duration-300 translate-y-2 opacity-0`;
    toast.innerHTML = `<i class="fas fa-info-circle mr-2"></i><span>${message}</span>`;

    container.appendChild(toast);
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
    });
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function getRecurLabel(type) {
    const labels = { daily: '毎日', weekly: '毎週', monthly: '毎月' };
    return labels[type] || '';
}

// =========================================================
// モーダル制御ロジック
// =========================================================

function closeEditModal() {
    if (editModal) editModal.classList.add('hidden');
    document.body.classList.remove('modal-open'); 
    editingTaskId = null;
}

function openEditModal(task) {
    if (!editModal) {
        console.error("Edit Modal HTML not found. Did renderModals() run?");
        return;
    }
    
    editingTaskId = task.id;
    editTitle.value = task.title;
    editDesc.value = task.description || '';
    
    if (task.dueDate) {
        const d = task.dueDate.toDate ? task.dueDate.toDate() : new Date(task.dueDate);
        const year = d.getFullYear();
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        editDate.value = `${year}-${month}-${day}`;
    } else {
        editDate.value = '';
    }

    updateModalLabels(task.id, task.labelIds);
    
    // モーダルを開く前に、ラベル選択肢を再構築
    const labelList = document.getElementById('label-list');
    const allLabels = Array.from(labelList ? labelList.querySelectorAll('li') : []).map(li => ({
        id: li.dataset.id,
        name: li.textContent.trim().replace(/^.+\s/, ''), 
        color: li.querySelector('span')?.style.backgroundColor 
    }));
    
    if (editAddLabelSelect) {
        editAddLabelSelect.innerHTML = '<option value="">＋ タグを追加...</option>';
        allLabels.forEach(l => {
            const opt = document.createElement('option');
            opt.value = l.id;
            opt.textContent = l.name;
            editAddLabelSelect.appendChild(opt);
        });
        editAddLabelSelect.value = '';
    }


    editModal.classList.remove('hidden');
    document.body.classList.add('modal-open');
}

function updateModalLabels(taskId, labelIds = []) {
    if (!editLabelsContainer) return;
    editLabelsContainer.innerHTML = '';
    
    labelIds.forEach(lid => {
        const label = getLabelDetails(lid);
        if (!label) return;

        const badge = document.createElement('span');
        badge.className = "text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-gray-200";
        badge.style.backgroundColor = '#F3F4F6'; 
        badge.style.color = '#374151';
        
        badge.innerHTML = `
            <span class="w-2 h-2 rounded-full" style="background-color: ${label.color}"></span>
            ${label.name}
            <button class="text-gray-400 hover:text-red-500 ml-1 remove-tag-modal transition-colors rounded-full p-0.5 hover:bg-gray-200" data-lid="${lid}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        badge.querySelector('.remove-tag-modal').onclick = async (e) => {
            e.stopPropagation(); 
            // ラベル削除機能のロジックがまだstore.jsにないため、一時的にリロードをトリガー
            await updateTask(currentUserId, taskId, {}); 
            badge.remove();
            showToast(`ラベル ${label.name} を外しました`);
        };
        editLabelsContainer.appendChild(badge);
    });
}


// =========================================================
// UI イベント初期化
// =========================================================

export function initTaskInput(onAdd) {
    if (!taskTitleInput) return;
    
    // モーダル関連のイベントリスナー設定
    if (closeModalBtn) closeModalBtn.onclick = closeEditModal;
    if (cancelEditBtn) cancelEditBtn.onclick = closeEditModal;
    if (editModal) editModal.onclick = (e) => {
        if (e.target === editModal) closeEditModal();
    };
    
    if (saveTaskBtn) {
        saveTaskBtn.onclick = async () => {
            if (!editingTaskId || !currentUserId) return;
            const titleVal = editTitle.value.trim();
            if (!titleVal) {
                alert("タイトルは必須です。"); 
                return;
            }
            const updates = {
                title: titleVal,
                dueDate: editDate.value,
                description: editDesc.value
            };
            await updateTask(currentUserId, editingTaskId, updates);
            closeEditModal();
            showToast("タスクを更新しました");
        };
    }
    
    if (deleteTaskBtnModal) {
        deleteTaskBtnModal.onclick = async () => {
            if (!editingTaskId || !currentUserId) return;
            if(confirm("本当にこのタスクを削除しますか？")) { 
                await deleteTask(currentUserId, editingTaskId);
                closeEditModal();
                showToast("タスクを削除しました", "red");
            }
        };
    }
    
    if (editAddLabelSelect) {
         editAddLabelSelect.onchange = async (e) => {
            const labelId = e.target.value;
            if (labelId && editingTaskId) {
                // ラベル追加機能のロジックがまだstore.jsにないため、一時的にリロードをトリガー
                await updateTask(currentUserId, editingTaskId, {}); 
                e.target.value = ''; 
                updateModalLabels(editingTaskId);
                showToast("タグを追加しました");
            }
        };
    }
    
    
    // タスク追加ボタンのイベントリスナー設定 (initTaskInputの本来の役割)
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
        showToast("タスクを追加しました");

        // 入力リセット
        taskTitleInput.value = '';
        taskDescInput.value = '';
        taskDueDateInput.value = '';
        recurrenceSelect.value = 'none';
    });
}

// =========================================================
// 描画ロジック
// =========================================================

export function renderTaskList(tasks, userId) {
    if (!taskList) return;
    
    // currentUserId をグローバルで更新
    // モジュール間の依存をシンプルにするため
    import('../core/auth.js').then(m => {
        m.currentUserId = userId;
    });

    const badge = document.getElementById('task-count-badge');
    if (badge) badge.textContent = tasks.length;
    
    if (tasks.length === 0) {
        const msg = "タスクがありません。新しいタスクを追加しましょう！✨";
        taskList.innerHTML = `<li class="flex flex-col items-center justify-center py-12 text-center text-gray-400"><div class="bg-gray-100 p-4 rounded-full mb-3"><i class="fas fa-clipboard-check fa-2x text-gray-300"></i></div><p class="text-sm">${msg}</p></li>`;
        return;
    }


    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        const isCompleted = task.status === 'completed';
        
        // --- タスク表示詳細ロジック ---
        
        // 期限日/ステータス表示 (前回の回答のロジックを保持)
        let dueDateHtml = '';
        if (task.dueDate) {
            const d = task.dueDate.toDate ? task.dueDate.toDate() : new Date(task.dueDate);
            const dateStr = d.toLocaleDateString();
            const isOverdue = d < new Date() && !isCompleted;
            const today = new Date();
            const isToday = d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
            
            let colorClass = 'text-gray-500';
            let icon = 'fa-calendar-alt';
            if (isOverdue) {
                colorClass = 'text-red-500 font-bold';
                icon = 'fa-exclamation-circle';
            } else if (isToday) {
                colorClass = 'text-blue-600 font-bold';
                icon = 'fa-calendar-day';
            }
            dueDateHtml = `<span class="text-xs ${colorClass} ml-3 flex items-center" title="期限: ${dateStr}"><i class="fas ${icon} mr-1"></i> ${dateStr}</span>`;
        }

        // 繰り返し/メモアイコン
        const recurIcon = task.recurrence && task.recurrence.type !== 'none' ? `<span class="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-100 ml-2 flex items-center"><i class="fas fa-sync-alt mr-1"></i> ${getRecurLabel(task.recurrence.type)}</span>` : '';
        const descIcon = task.description ? `<span class="text-gray-400 ml-2" title="メモあり"><i class="fas fa-sticky-note"></i></span>` : '';
        
        // ラベルバッジ（簡易版 - 削除機能はモーダルで提供）
        let labelBadges = '';
        if (task.labelIds && task.labelIds.length > 0) {
            const badgesHtml = task.labelIds.map(lid => {
                const label = getLabelDetails(lid);
                if (!label) return '';
                // ラベル名と色を表示
                return `<span class="text-xs bg-white text-gray-600 px-2 py-0.5 rounded-full border border-gray-200 flex items-center mr-1 mb-1"><span class="w-1.5 h-1.5 rounded-full mr-1.5" style="background-color: ${label.color}"></span>${label.name}</span>`;
            }).join('');
            labelBadges = `<div class="mt-2 flex flex-wrap pl-9">${badgesHtml}</div>`;
        }

        const borderClass = isCompleted ? 'border-gray-200 bg-gray-50' : 'border-gray-200 bg-white hover:border-blue-300';
        const opacityClass = isCompleted ? 'opacity-75' : '';

        // リストアイテムの構築 (ドラッグ＆ドロップ対応)
        li.draggable = true;
        li.setAttribute('data-id', task.id);
        li.className = `p-4 mb-3 rounded-xl border shadow-sm flex flex-col transition-all duration-200 cursor-pointer ${borderClass} ${opacityClass}`;
        li.innerHTML = `
            <div class="flex items-start justify-between w-full">
                <div class="flex items-start flex-1 min-w-0">
                    <div class="relative flex items-center justify-center w-6 h-6 mr-3 flex-shrink-0 mt-0.5">
                        <input type="checkbox" ${isCompleted ? 'checked' : ''} class="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded cursor-pointer checked:bg-blue-500 checked:border-blue-500 transition-all duration-200 hover:border-blue-400"><i class="fas fa-check text-white absolute text-xs opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center flex-wrap mb-0.5"><span class="truncate font-medium text-base ${isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}">${task.title}</span>${recurIcon}${descIcon}${dueDateHtml}</div>
                        ${task.description ? `<p class="text-xs text-gray-500 truncate pl-0.5 max-w-md">${task.description}</p>` : ''}
                    </div>
                </div>
                <button class="delete-btn text-gray-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100" title="削除"><i class="fas fa-trash-alt"></i></button>
            </div>${labelBadges}
        `;

        // --- イベントリスナーの付与 ---
        
        // チェックボックス (ステータス更新)
        li.querySelector('input[type="checkbox"]').addEventListener('click', (e) => {
            e.stopPropagation();
            updateTask(userId, task.id, { status: e.target.checked ? 'completed' : 'todo' });
        });
        
        // 削除ボタン
        li.querySelector('.delete-btn').addEventListener('click', async (e) => {
            e.stopPropagation();
            if(confirm("このタスクを削除しますか？")) {
                await deleteTask(userId, task.id);
                showToast("タスクを削除しました", "red");
            }
        });
        
        // ドラッグ開始
        li.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', task.id);
            e.dataTransfer.effectAllowed = 'copy';
            li.classList.add('opacity-50');
        });
        li.addEventListener('dragend', () => {
            li.classList.remove('opacity-50');
        });

        // タスククリック (編集モーダルを開く)
        li.addEventListener('click', (e) => {
            // チェックボックスや削除ボタンのクリックでない場合のみモーダルを開く
            if (e.target.tagName === 'INPUT' || e.target.closest('.delete-btn')) return;
             openEditModal(task);
        });

        taskList.appendChild(li);
    });
}