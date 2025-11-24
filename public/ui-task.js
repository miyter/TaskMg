// --- タスクUI制御 (完全版：更新 2025/11/25 10:30) ---
import { addTask, toggleTaskStatus, deleteTask, setFilter, getCurrentFilter, removeLabelFromTask } from './store.js';

const taskList = document.getElementById('task-list');
const taskTitleInput = document.getElementById('task-title-input');
const taskDueDateInput = document.getElementById('task-due-date-input'); // 復活
const taskDescInput = document.getElementById('task-desc-input');       // 復活
const recurrenceSelect = document.getElementById('task-recurrence-select');
const addTaskBtn = document.getElementById('add-task-btn');
const searchInput = document.getElementById('search-input');
const showCompletedToggle = document.getElementById('show-completed-toggle');
const sortSelect = document.getElementById('sort-select');

let currentUserId = null;

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
}

async function handleAddTask() {
    if (!currentUserId) {
        alert("ログインしてください");
        return;
    }
    const title = taskTitleInput.value;
    const recurrence = recurrenceSelect.value;
    const dueDate = taskDueDateInput.value; // 取得
    const description = taskDescInput.value; // 取得
    const currentFilter = getCurrentFilter();
    
    const targetProjectId = (currentFilter.projectId && currentFilter.projectId !== 'all') ? currentFilter.projectId : null;
    
    // 引数を増やして渡す
    await addTask(currentUserId, title, recurrence, targetProjectId, dueDate, description);
    
    // フォームリセット
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
        
        // ドラッグ＆ドロップ対応
        li.draggable = true;
        li.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', task.id);
            e.dataTransfer.effectAllowed = 'copy';
            li.classList.add('opacity-50');
        });
        li.addEventListener('dragend', () => {
            li.classList.remove('opacity-50');
        });

        // 期限日の表示ロジック
        let dueDateHtml = '';
        if (task.dueDate) {
            const d = task.dueDate.toDate ? task.dueDate.toDate() : new Date(task.dueDate);
            const dateStr = d.toLocaleDateString();
            // 期限切れチェック
            const isOverdue = d < new Date() && !isCompleted;
            const colorClass = isOverdue ? 'text-red-500 font-bold' : 'text-gray-500';
            dueDateHtml = `<span class="text-xs ${colorClass} ml-3"><i class="fas fa-calendar-alt"></i> ${dateStr}</span>`;
        }

        // 繰り返しアイコン
        const recurIcon = task.recurrence && task.recurrence.type !== 'none' 
            ? `<span class="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-100 ml-2" title="繰り返し"><i class="fas fa-sync-alt"></i> ${getRecurLabel(task.recurrence.type)}</span>` 
            : '';

        // メモありアイコン
        const descIcon = task.description 
            ? `<span class="text-gray-400 ml-2" title="${task.description}"><i class="fas fa-sticky-note"></i></span>` 
            : '';

        // ラベルバッジ
        let labelBadges = '';
        if (task.labelIds && task.labelIds.length > 0) {
            labelBadges = `<div class="mt-1 flex flex-wrap gap-1 pl-8">
                ${task.labelIds.map(lid => `<span class="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded cursor-pointer hover:bg-red-100 hover:text-red-500 remove-label-btn" data-lid="${lid}" title="クリックで削除">🏷️ Tag</span>`).join('')}
            </div>`;
        }

        li.className = `p-3 mb-2 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col hover:shadow-md transition-all group ${isCompleted ? 'bg-gray-50' : ''}`;
        
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

        li.querySelector('input').addEventListener('click', () => {
            toggleTaskStatus(currentUserId, task.id, task.status, task);
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
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