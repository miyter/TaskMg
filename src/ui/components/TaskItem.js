// @ts-nocheck
// @miyter:20251221
// タスク単体（1行分）の描画とイベント

import { updateTaskStatus } from '../../store/store.js';
import { getTaskDateColor, formatDateCompact } from '../../utils/date.js';
import { getTimeBlocks } from '../../store/timeblocks.js';
import { openTaskEditModal } from '../task-modal.js';
import { showTaskContextMenu } from './TaskContextMenu.js';

export function createTaskItem(task) {
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);
    li.setAttribute('draggable', 'true'); 
    
    const isCompleted = task.status === 'completed';
    const dateText = formatDateCompact(task.dueDate);
    const dateColorClass = getTaskDateColor(task.dueDate);
    const isRecurring = !!task.recurrence; 
    const isOneTime = !!task.dueDate && !isRecurring;

    const timeBlocks = getTimeBlocks();
    const timeBlock = task.timeBlockId ? timeBlocks.find(tb => tb.id === task.timeBlockId) : null;

    li.className = `group flex items-start gap-2 sm:gap-3 py-2 px-2 rounded -mx-2 transition-all duration-200 cursor-default border border-transparent ${isCompleted ? 'opacity-60 bg-gray-50 dark:bg-gray-900/50' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-100 dark:hover:border-gray-700'}`;

    li.innerHTML = `
        <div class="task-drag-handle mt-1 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing hidden sm:block mr-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path></svg>
        </div>

        <div class="task-checkbox mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors z-10 cursor-pointer ${isCompleted ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-400 dark:border-gray-500 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-transparent text-transparent hover:text-blue-500'}">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
        </div>
        
        <div class="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-2 items-center">
            <div class="col-span-1 sm:col-span-7 flex flex-col justify-center">
                <div class="leading-snug truncate font-medium transition-colors ${isCompleted ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}">${task.title}</div>
                ${task.description ? `<div class="text-xs text-gray-400 truncate mt-0.5 font-light">${task.description}</div>` : ''}
            </div>
            
            <div class="col-span-1 sm:col-span-5 flex items-center sm:justify-end space-x-2 text-xs h-full mt-1 sm:mt-0 overflow-hidden">
                ${isRecurring ? `<div class="text-blue-500 dark:text-blue-400 flex-shrink-0" title="繰り返し">🔁</div>` : ''}
                ${isOneTime ? `<div class="text-gray-400 dark:text-gray-500 flex-shrink-0" title="期限あり">▶️</div>` : ''}
                
                ${timeBlock ? `
                    <div class="flex items-center px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 max-w-[140px]" title="${timeBlock.start} - ${timeBlock.end}">
                        <span class="w-2 h-2 rounded-full mr-1.5 flex-shrink-0" style="background-color: ${timeBlock.color}"></span>
                        <span class="truncate font-mono text-[11px]">${timeBlock.start} - ${timeBlock.end}</span>
                    </div>
                ` : ''}

                ${task.duration ? `
                    <div class="flex items-center text-gray-500 dark:text-gray-400 whitespace-nowrap" title="所要時間: ${task.duration}分">
                        <span class="mr-0.5 text-[10px]">⏱️</span>${task.duration}m
                    </div>
                ` : ''}

                ${dateText ? `<div class="flex items-center ${dateColorClass} bg-gray-50 dark:bg-gray-800/50 px-1.5 py-0.5 rounded flex-shrink-0">${dateText}</div>` : ''}
            </div>
        </div>
    `;

    // ドラッグイベント
    li.addEventListener('dragstart', (e) => {
        li.classList.add('opacity-50');
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
    });
    li.addEventListener('dragend', () => li.classList.remove('opacity-50'));

    // チェックボックス
    li.querySelector('.task-checkbox').addEventListener('click', async (e) => {
        e.stopPropagation();
        await updateTaskStatus(task.id, isCompleted ? 'todo' : 'completed');
    });

    // 編集モーダル
    li.addEventListener('click', (e) => {
        if (!e.target.closest('.task-checkbox') && !e.target.closest('.task-drag-handle')) {
            openTaskEditModal(task);
        }
    });

    // コンテキストメニュー
    li.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showTaskContextMenu(task, e.clientX, e.clientY);
    });

    return li;
}