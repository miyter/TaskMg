// --- タスクUI制御 (完全版：最終調整) ---
import { addTask, toggleTaskStatus, deleteTask, setFilter, getCurrentFilter, removeLabelFromTask, updateTask, addLabelToTask } from './store.js';
import { getAllLabels, getLabelDetails } from './ui-sidebar.js'; 

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
let editingTaskId = null; 

export function setupTaskUI(userId) {
    currentUserId = userId;
    
    // イベントリスナー重複防止のためのクローン再配置
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
    
    // モーダル外クリックで閉じる
    editModal.onclick = (e) => {
        if (e.target === editModal) closeEditModal();
    };
    
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

    deleteTaskBtnModal.onclick = async () => {
        if (!editingTaskId || !currentUserId) return;
        if(confirm("本当にこのタスクを削除しますか？")) {
            await deleteTask(currentUserId, editingTaskId);
            closeEditModal();
            showToast("タスクを削除しました", "red");
        }
    };

    // モーダル内のラベル追加
    editAddLabelSelect.onchange = async (e) => {
        const labelId = e.target.value;
        if (labelId && editingTaskId) {
            await addLabelToTask(currentUserId, editingTaskId, labelId);
            e.target.value = ''; 
            updateModalLabels(editingTaskId); // 再描画待ちの間にUI更新したいが、今回はstore更新待ち
        }
    };
}

function closeEditModal() {
    editModal.classList.add('hidden');
    document.body.classList.remove('modal-open'); // スクロールロック解除
    editingTaskId = null;
}

function openEditModal(task) {
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
    
    // プルダウン選択肢更新
    const allLabels = getAllLabels();
    editAddLabelSelect.innerHTML = '<option value="">＋ タグを追加...</option>';
    allLabels.forEach(l => {
        // 既に付与されているタグは除外するか、UI上で分かるようにするのが親切だが、
        // 簡易実装として全て表示し、重複追加はFirestore側(arrayUnion)で防ぐ
        const opt = document.createElement('option');
        opt.value = l.id;
        opt.textContent = l.name;
        editAddLabelSelect.appendChild(opt);
    });

    editModal.classList.remove('hidden');
    document.body.classList.add('modal-open'); // 背景スクロールロック
}

function updateModalLabels(taskId, labelIds = null) {
    editLabelsContainer.innerHTML = '';
    if (!labelIds) return; 

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
    const title = taskTitleInput.value.trim();
    if (!title) return; // 空タイトルのガード

    const recurrence = recurrenceSelect.value;
    const dueDate = taskDueDateInput.value; 
    const description = taskDescInput.value; 
    const currentFilter = getCurrentFilter();
    
    const targetProjectId = (currentFilter.projectId && currentFilter.projectId !== 'all') ? currentFilter.projectId : null;
    
    await addTask(currentUserId, title, recurrence, targetProjectId, dueDate, description);
    showToast("タスクを追加しました");
    
    taskTitleInput.value = '';
    taskDueDateInput.value = '';
    taskDescInput.value = '';
    recurrenceSelect.value = 'none';
}

// トースト通知を表示するヘルパー
function showToast(message, type = 'blue') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColor = type === 'red' ? 'bg-red-500' : 'bg-gray-800';
    toast.className = `${bgColor} text-white text-sm px-4 py-3 rounded shadow-lg flex items-center transform transition-all duration-300 translate-y-2 opacity-0`;
    toast.innerHTML = `
        <i class="fas fa-info-circle mr-2"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // アニメーション
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
    });

    // 3秒後に消える
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

export function renderTaskList(tasks, filterState) {
    taskList.innerHTML = '';
    if (tasks.length === 0) {
        // フィルタリング結果が0件の場合のメッセージ
        const isEmptyInbox = !filterState.projectId && !filterState.labelId && !filterState.searchQuery && !filterState.showCompleted;
        const msg = isEmptyInbox 
            ? "タスクがありません。新しいタスクを追加しましょう！✨" 
            : "条件に一致するタスクは見つかりませんでした。";
            
        taskList.innerHTML = `
            <li class="flex flex-col items-center justify-center py-12 text-center text-gray-400">
                <div class="bg-gray-100 p-4 rounded-full mb-3">
                    <i class="fas fa-clipboard-check fa-2x text-gray-300"></i>
                </div>
                <p class="text-sm">${msg}</p>
            </li>`;
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

        li.addEventListener('click', (e) => {
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
            
            // 今日かどうか判定
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

        const recurIcon = task.recurrence && task.recurrence.type !== 'none' 
            ? `<span class="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-100 ml-2 flex items-center"><i class="fas fa-sync-alt mr-1"></i> ${getRecurLabel(task.recurrence.type)}</span>` 
            : '';

        const descIcon = task.description 
            ? `<span class="text-gray-400 ml-2" title="メモあり"><i class="fas fa-sticky-note"></i></span>` 
            : '';

        let labelBadges = '';
        if (task.labelIds && task.labelIds.length > 0) {
            const badgesHtml = task.labelIds.map(lid => {
                const label = getLabelDetails(lid);
                if (!label) return '';
                return `<span class="text-xs bg-white text-gray-600 px-2 py-0.5 rounded-full border border-gray-200 flex items-center hover:bg-gray-50 transition-colors mr-1 mb-1 remove-label-btn group-tag" data-lid="${lid}" title="クリックで削除">
                    <span class="w-1.5 h-1.5 rounded-full mr-1.5" style="background-color: ${label.color}"></span>
                    ${label.name}
                    <i class="fas fa-times ml-1.5 text-gray-300 group-tag-hover:text-red-400 opacity-0 group-tag-hover:opacity-100 transition-opacity" style="font-size: 0.7em;"></i>
                </span>`;
            }).join('');
            
            labelBadges = `<div class="mt-2 flex flex-wrap pl-9">${badgesHtml}</div>`;
        }

        // スタイル: 完了済みは薄く、ボーダー色変更
        const borderClass = isCompleted ? 'border-gray-200 bg-gray-50' : 'border-gray-200 bg-white hover:border-blue-300';
        const opacityClass = isCompleted ? 'opacity-75' : '';

        li.className = `p-4 mb-3 rounded-xl border shadow-sm flex flex-col transition-all duration-200 cursor-pointer ${borderClass} ${opacityClass}`;
        
        li.innerHTML = `
            <div class="flex items-start justify-between w-full">
                <div class="flex items-start flex-1 min-w-0">
                    <div class="relative flex items-center justify-center w-6 h-6 mr-3 flex-shrink-0 mt-0.5">
                        <input type="checkbox" ${isCompleted ? 'checked' : ''} 
                               class="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded cursor-pointer checked:bg-blue-500 checked:border-blue-500 transition-all duration-200 hover:border-blue-400">
                        <i class="fas fa-check text-white absolute text-xs opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center flex-wrap mb-0.5">
                            <span class="truncate font-medium text-base ${isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}">${task.title}</span>
                            ${recurIcon}
                            ${descIcon}
                            ${dueDateHtml}
                        </div>
                        ${task.description ? `<p class="text-xs text-gray-500 truncate pl-0.5 max-w-md">${task.description}</p>` : ''}
                    </div>
                </div>
                <button class="delete-btn text-gray-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100" title="削除">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
            ${labelBadges}
        `;

        // イベント設定（チェックボックス）
        li.querySelector('input').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleTaskStatus(currentUserId, task.id, task.status, task);
            // 完了時のアニメーション効果などを入れるならここ
        });

        li.querySelector('.delete-btn').addEventListener('click', async (e) => {
            e.stopPropagation();
            if(confirm("このタスクを削除しますか？")) {
                await deleteTask(currentUserId, task.id);
                showToast("タスクを削除しました", "red");
            }
        });
        
        // バッジ削除
        li.querySelectorAll('.remove-label-btn').forEach(btn => {
            // ホバー時の×アイコン表示用クラス操作
            btn.addEventListener('mouseenter', () => btn.querySelector('.fa-times').classList.remove('opacity-0'));
            btn.addEventListener('mouseleave', () => btn.querySelector('.fa-times').classList.add('opacity-0'));

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
    
    // 件数バッジ更新
    const badge = document.getElementById('task-count-badge');
    if(badge) badge.textContent = tasks.length;
}

function getRecurLabel(type) {
    const labels = { daily: '毎日', weekly: '毎週', monthly: '毎月' };
    return labels[type] || '';
}