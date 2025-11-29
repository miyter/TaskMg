import { updateTaskStatus, deleteTask } from '../store/store.js';
import { getTaskDateColor, formatDateCompact } from '../utils/date.js';
import { openTaskEditModal } from './task-modal.js';
import { showMessageModal } from './components.js';

export function renderTaskList(container, tasks) {
    const list = document.createElement('ul');
    list.id = 'task-list-ul';
    list.className = 'divide-y divide-gray-100 dark:divide-gray-800 border-b border-gray-100 dark:border-gray-800 mb-2';

    if (!tasks || tasks.length === 0) {
        renderEmptyState(list);
    } else {
        tasks.forEach(task => {
            const li = createTaskItem(task);
            list.appendChild(li);
        });
        // リスト全体に対するドラッグイベント (並び替え用)
        setupListDragEvents(list);
    }
    container.appendChild(list);
}

function createTaskItem(task) {
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);
    li.setAttribute('draggable', 'true'); // ドラッグ可能にする
    
    const isCompleted = task.status === 'completed';
    const dateText = formatDateCompact(task.dueDate);
    const dateColorClass = getTaskDateColor(task.dueDate);

    li.className = `group flex items-start gap-2 sm:gap-3 py-2 px-2 rounded -mx-2 transition-all duration-200 cursor-pointer border border-transparent ${isCompleted ? 'opacity-60 bg-gray-50 dark:bg-gray-900/50' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-100 dark:hover:border-gray-700'}`;

    li.innerHTML = `
        <div class="drag-handle hidden group-hover:flex items-center justify-center w-4 h-5 mt-0.5 text-gray-300 hover:text-gray-500 cursor-move" title="並び替え">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path></svg>
        </div>
        <div class="task-checkbox mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors z-10 ${isCompleted ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-400 dark:border-gray-500 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-transparent text-transparent hover:text-blue-500'}">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
        </div>
        <div class="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-2 items-center">
            <div class="col-span-1 sm:col-span-9 flex flex-col justify-center">
                <div class="text-[0.93rem] leading-snug truncate font-medium transition-colors ${isCompleted ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}">${task.title}</div>
                ${task.description ? `<div class="text-xs text-gray-400 truncate mt-0.5 font-light">${task.description}</div>` : ''}
            </div>
            <div class="col-span-1 sm:col-span-3 flex items-center sm:justify-end space-x-2 text-xs h-full mt-1 sm:mt-0">
                ${dateText ? `<div class="flex items-center ${dateColorClass} bg-gray-50 dark:bg-gray-800/50 px-1.5 py-0.5 rounded"><svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>${dateText}</div>` : ''}
                ${task.labelIds?.length > 0 ? `<span class="text-gray-400 group-hover:text-gray-500 flex items-center"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg><span class="ml-0.5">${task.labelIds.length}</span></span>` : ''}
            </div>
        </div>
        <div class="hidden group-hover:flex items-center ml-2 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="edit-btn p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
            <button class="delete-btn p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
        </div>
    `;

    // イベント設定 (完了、編集、削除)
    const checkbox = li.querySelector('.task-checkbox');
    checkbox.addEventListener('click', async (e) => {
        e.stopPropagation();
        await updateTaskStatus(task.id, isCompleted ? 'todo' : 'completed');
    });
    li.addEventListener('click', () => openTaskEditModal(task));
    li.querySelector('.edit-btn').addEventListener('click', (e) => { e.stopPropagation(); openTaskEditModal(task); });
    li.querySelector('.delete-btn').addEventListener('click', async (e) => {
        e.stopPropagation();
        showMessageModal('削除しますか？', async () => await deleteTask(task.id));
    });

    return li;
}

// リスト並び替え用DnDイベント
function setupListDragEvents(list) {
    let draggedItem = null;

    list.addEventListener('dragstart', (e) => {
        draggedItem = e.target.closest('li');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', draggedItem.dataset.id); // ID保持
        setTimeout(() => draggedItem.classList.add('opacity-50'), 0);
    });

    list.addEventListener('dragend', () => {
        if(draggedItem) draggedItem.classList.remove('opacity-50');
        draggedItem = null;
        // ここで順序保存のAPIコールなどを入れる
        console.log('並び替え完了 (保存は未実装)');
    });

    list.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(list, e.clientY);
        if (afterElement == null) {
            list.appendChild(draggedItem);
        } else {
            list.insertBefore(draggedItem, afterElement);
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('li:not(.opacity-50)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function renderEmptyState(list) {
    list.innerHTML = `<div class="py-16 text-center text-gray-400 text-sm">タスクがありません</div>`;
}