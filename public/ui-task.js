// --- タスクUI制御 (完全版：更新 2025/11/25 修正版) ---
import { addTask, toggleTaskStatus, deleteTask, setFilter, getCurrentFilter, removeLabelFromTask, updateTask, addLabelToTask } from './store.js';
import { getAllLabels, getLabelDetails } from './ui-sidebar.js'; // ラベル情報取得用

const taskList = document.getElementById('task-list');
const taskTitleInput = document.getElementById('task-title-input');
const taskDueDateInput = document.getElementById('task-due-date-input');
const taskDescInput = document.getElementById('task-desc-input');
const recurrenceSelect = document.getElementById('task-recurrence-select');
const addTaskBtn = document.getElementById('add-task-btn');
const searchInput = document.getElementById('search-input');
const showCompletedToggle = document.getElementById('show-completed-toggle');
const sortSelect = document.getElementById('sort-select');

// モーダル要素
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

let currentUserId = null;
let editingTaskId = null; // 編集中のタスクID

export function setupTaskUI(userId) {
    currentUserId = userId;
    
    const newBtn = addTaskBtn.cloneNode(true);
    addTaskBtn.parentNode.replaceChild(newBtn, addTaskBtn);
    newBtn.addEventListener('click', handleAddTask);

    searchInput.addEventListener('input', (e) => {
        setFilter({ searchQuery: e.target.value });
    });

    showCompletedToggle.addEventListener('change', (e) => {
        setFilter({ showCompleted: e.target.checked });
    });

    sortSelect.addEventListener('change', (e) => {
        setFilter({ sort: e.target.value });
    });

    // モーダルイベント
    closeModalBtn.onclick = closeEditModal;
    cancelEditBtn.onclick = closeEditModal;
    
    saveTaskBtn.onclick = async () => {
        if (!editingTaskId || !currentUserId) return;
        const updates = {
            title: editTitle.value,
            dueDate: editDate.value,
            description: editDesc.value
        };
        await updateTask(currentUserId, editingTaskId, updates);
        closeEditModal();
    };

    deleteTaskBtnModal.onclick = async () => {
        if (!editingTaskId || !currentUserId) return;
        await deleteTask(currentUserId, editingTaskId);
        closeEditModal();
    };

    // モーダル内のラベル追加プルダウン
    editAddLabelSelect.onchange = async (e) => {
        const labelId = e.target.value;
        if (labelId && editingTaskId) {
            await addLabelToTask(currentUserId, editingTaskId, labelId);
            e.target.value = ''; // リセット
            updateModalLabels(editingTaskId); // 疑似的に更新
        }
    };
}

function closeEditModal() {
    editModal.classList.add('hidden');
    editingTaskId = null;
}

// 編集モーダルを開く
function openEditModal(task) {
    editingTaskId = task.id;
    editTitle.value = task.title;
    editDesc.value = task.description || '';
    
    if (task.dueDate) {
        const d = task.dueDate.toDate ? task.dueDate.toDate() : new Date(task.dueDate);
        // YYYY-MM-DD形式に変換
        const year = d.getFullYear();
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        editDate.value = `${year}-${month}-${day}`;
    } else {
        editDate.value = '';
    }

    updateModalLabels(task.id, task.labelIds); // ラベル表示更新
    
    // プルダウンの選択肢更新
    const allLabels = getAllLabels();
    editAddLabelSelect.innerHTML = '<option value="">＋ タグを追加...</option>';
    allLabels.forEach(l => {
        const opt = document.createElement('option');
        opt.value = l.id;
        opt.textContent = l.name;
        editAddLabelSelect.appendChild(opt);
    });

    editModal.classList.remove('hidden');
}

// モーダル内のラベルバッジ表示（タスクデータから）
function updateModalLabels(taskId, labelIds = null) {
    editLabelsContainer.innerHTML = '';
    if (!labelIds) return; 

    labelIds.forEach(lid => {
        const label = getLabelDetails(lid);
        if (!label) return;

        const badge = document.createElement('span');
        badge.className = "text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded flex items-center gap-1";
        badge.innerHTML = `
            <span class="w-2 h-2 rounded-full" style="background-color: ${label.color}"></span>
            ${label.name}
            <button class="text-gray-400 hover:text-red-500 ml-1 remove-tag-modal" data-lid="${lid}">×</button>
        `;
        
        badge.querySelector('.remove-tag-modal').onclick = async (e) => {
            e.stopPropagation(); 
            await removeLabelFromTask(currentUserId, taskId, lid);
            badge.remove();
        };

        editLabelsContainer.appendChild(badge);
    });
}


async function handleAddTask() {
    if (!currentUserId) {
        alert("ログインしてください");
        return;
    }
    const title = taskTitleInput.value;
    const recurrence = recurrenceSelect.value;
    const dueDate = taskDueDateInput.value; 
    const description = taskDescInput.value; 
    const currentFilter = getCurrentFilter();
    
    const targetProjectId = (currentFilter.projectId && currentFilter.projectId !== 'all') ? currentFilter.projectId : null;
    
    await addTask(currentUserId, title, recurrence, targetProjectId, dueDate, description);
    
    taskTitleInput.value = '';
    taskDueDateInput.value = '';
    taskDescInput.value = '';
    recurrenceSelect.value = 'none';
}

export function renderTaskList(tasks, filterState) {
    taskList.innerHTML = '';
    if (tasks.length === 0) {
        taskList.innerHTML = '<li class="p-8 text-center text-gray-400 italic">タスクが見つかりません</li>';
        return;
    }

    tasks.forEach(task => {
        const li = document.createElement('li');
        const isCompleted = task.status === 'completed';
        
        li.draggable = true;
        li.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', task.id);
            e.dataTransfer.effectAllowed = 'copy';
            li.classList.add('opacity-50');
        });
        li.addEventListener('dragend', () => {
            li.classList.remove('opacity-50');
        });

        // ★タスクをクリックしたら編集モーダルを開く
        li.addEventListener('click', (e) => {
            // チェックボックスや削除ボタンを押したときは開かないようにする
            if (e.target.tagName === 'INPUT' || e.target.closest('.delete-btn') || e.target.closest('.remove-label-btn')) {
                return;
            }
            openEditModal(task);
        });

        let dueDateHtml = '';
        if (task.dueDate) {
            const d = task.dueDate.toDate ? task.dueDate.toDate() : new Date(task.dueDate);
            const dateStr = d.toLocaleDateString();
            const isOverdue = d < new Date() && !isCompleted;
            const colorClass = isOverdue ? 'text-red-500 font-bold' : 'text-gray-500';
            dueDateHtml = `<span class="text-xs ${colorClass} ml-3"><i class="fas fa-calendar-alt"></i> ${dateStr}</span>`;
        }

        const recurIcon = task.recurrence && task.recurrence.type !== 'none' 
            ? `<span class="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-100 ml-2"><i class="fas fa-sync-alt"></i> ${getRecurLabel(task.recurrence.type)}</span>` 
            : '';

        const descIcon = task.description 
            ? `<span class="text-gray-400 ml-2"><i class="fas fa-sticky-note"></i></span>` 
            : '';

        let labelBadges = '';
        if (task.labelIds && task.labelIds.length > 0) {
            // ui-sidebarからラベル詳細を取得して表示
            const badgesHtml = task.labelIds.map(lid => {
                const label = getLabelDetails(lid);
                if (!label) return '';
                return `<span class="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded cursor-pointer hover:bg-red-100 hover:text-red-500 remove-label-btn border border-gray-200" data-lid="${lid}" title="クリックで削除" style="border-left: 3px solid ${label.color}">
                    ${label.name}
                </span>`;
            }).join('');
            
            labelBadges = `<div class="mt-1 flex flex-wrap gap-1 pl-8">${badgesHtml}</div>`;
        }

        li.className = `p-3 mb-2 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col hover:shadow-md transition-all group cursor-pointer ${isCompleted ? 'bg-gray-50' : ''}`;
        
        li.innerHTML = `
            <div class="flex items-center justify-between w-full">
                <div class="flex items-center flex-1 min-w-0">
                    <div class="relative flex items-center justify-center w-6 h-6 mr-3 flex-shrink-0">
                        <input type="checkbox" ${isCompleted ? 'checked' : ''} 
                               class="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded cursor-pointer checked:bg-blue-500 checked:border-blue-500 transition-colors">
                        <i class="fas fa-check text-white absolute text-xs opacity-0 peer-checked:opacity-100 pointer-events-none"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center flex-wrap">
                            <span class="truncate font-medium ${isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}">${task.title}</span>
                            ${recurIcon}
                            ${descIcon}
                            ${dueDateHtml}
                        </div>
                        ${task.description ? `<p class="text-xs text-gray-500 mt-1 truncate pl-0.5">${task.description}</p>` : ''}
                    </div>
                </div>
                <button class="delete-btn text-gray-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            ${labelBadges}
        `;

        li.querySelector('input').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleTaskStatus(currentUserId, task.id, task.status, task);
        });

        li.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTask(currentUserId, task.id);
        });
        
        li.querySelectorAll('.remove-label-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); 
                const lid = btn.getAttribute('data-lid');
                if(confirm("このタグを外しますか？")) {
                    removeLabelFromTask(currentUserId, task.id, lid);
                }
            });
        });

        taskList.appendChild(li);
    });
    
    document.getElementById('task-count-badge').textContent = tasks.length;
}

function getRecurLabel(type) {
    const labels = { daily: '毎日', weekly: '毎週', monthly: '毎月' };
    return labels[type] || '';
}