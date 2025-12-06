// @ts-nocheck
// タスクリスト描画・操作 (ドラッグ＆ドロップ対応版)

import { updateTaskStatus, deleteTask } from '../store/store.js';
import { getTaskDateColor, formatDateCompact } from '../utils/date.js';
import { openTaskEditModal } from './task-modal.js';
import { showMessageModal } from './components.js';

export function renderTaskList(container, tasks) {
    const list = document.createElement('ul');
    list.id = 'task-list-ul';
    list.className = 'divide-y divide-gray-100 dark:divide-gray-800 border-b border-gray-100 dark:divide-gray-800 mb-2';

    if (!tasks || tasks.length === 0) {
        renderEmptyState(list);
    } else {
        tasks.forEach(task => {
            const li = createTaskItem(task);
            list.appendChild(li);
        });
        setupListDragEvents(list);
    }
    container.appendChild(list);
}

function createTaskItem(task) {
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);
    li.setAttribute('draggable', 'true'); 
    
    const isCompleted = task.status === 'completed';
    const dateText = formatDateCompact(task.dueDate);
    const dateColorClass = getTaskDateColor(task.dueDate);
    const isRecurring = !!task.recurrence; 
    // ラベル数を取得（未設定なら0）
    const labelCount = task.labelIds ? task.labelIds.length : 0;

    li.className = `group flex items-start gap-2 sm:gap-3 py-2 px-2 rounded -mx-2 transition-all duration-200 cursor-default border border-transparent ${isCompleted ? 'opacity-60 bg-gray-50 dark:bg-gray-900/50' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-100 dark:hover:border-gray-700'}`;

    li.innerHTML = `
        <!-- ドラッグハンドル -->
        <div class="task-drag-handle mt-1 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing hidden sm:block mr-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path></svg>
        </div>

        <div class="task-checkbox mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors z-10 cursor-pointer ${isCompleted ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-400 dark:border-gray-500 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-transparent text-transparent hover:text-blue-500'}">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
        </div>
        
        <div class="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-2 items-center">
            <div class="col-span-1 sm:col-span-9 flex flex-col justify-center">
                <div class="text-[0.93rem] leading-snug truncate font-medium transition-colors ${isCompleted ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}">${task.title}</div>
                ${task.description ? `<div class="text-xs text-gray-400 truncate mt-0.5 font-light">${task.description}</div>` : ''}
            </div>
            <div class="col-span-1 sm:col-span-3 flex items-center sm:justify-end space-x-2 text-xs h-full mt-1 sm:mt-0">
                ${isRecurring ? `<div class="text-blue-500 dark:text-blue-400" title="繰り返し設定あり">🔁</div>` : ''}
                
                ${dateText ? `<div class="flex items-center ${dateColorClass} bg-gray-50 dark:bg-gray-800/50 px-1.5 py-0.5 rounded"><svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>${dateText}</div>` : ''}
                
                <!-- ラベル数表示 (0でも常に表示) -->
                <span class="text-gray-400 group-hover:text-gray-500 flex items-center" title="ラベル数">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                    <span class="ml-0.5">${labelCount}</span>
                </span>
            </div>
        </div>
    `;

    li.addEventListener('dragstart', (e) => {
        li.classList.add('opacity-50');
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
    });

    li.addEventListener('dragend', () => {
        li.classList.remove('opacity-50');
    });

    const checkbox = li.querySelector('.task-checkbox');
    checkbox.addEventListener('click', async (e) => {
        e.stopPropagation();
        await updateTaskStatus(task.id, isCompleted ? 'todo' : 'completed');
    });

    li.addEventListener('click', (e) => {
        if (!e.target.closest('.task-checkbox') && !e.target.closest('.task-drag-handle')) {
            openTaskEditModal(task);
        }
    });

    li.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showTaskContextMenu(task, e.clientX, e.clientY);
    });

    return li;
}

function setupListDragEvents(list) {
    list.addEventListener('dragover', (e) => {
        e.preventDefault(); 
        const afterElement = getDragAfterElement(list, e.clientY);
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

function showTaskContextMenu(task, x, y) {
    document.getElementById('task-context-menu')?.remove();

    const menu = document.createElement('div');
    menu.id = 'task-context-menu';
    menu.className = 'fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 z-50 animate-fade-in text-sm min-w-[150px]';
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    menu.innerHTML = `
        <button id="ctx-delete-task-btn" class="flex w-full items-center px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 transition">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            削除
        </button>
    `;

    document.body.appendChild(menu);

    document.getElementById('ctx-delete-task-btn').addEventListener('click', () => {
        menu.remove();
        showMessageModal('削除しますか？', async () => await deleteTask(task.id));
    });

    const dismissMenu = (e) => {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', dismissMenu);
        }
    };
    setTimeout(() => {
        document.addEventListener('click', dismissMenu);
    }, 0);
}

function renderEmptyState(list) {
    list.innerHTML = `<div class="py-16 text-center text-gray-400 text-sm">タスクがありません</div>`;
}