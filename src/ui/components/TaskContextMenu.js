// @miyter:20251221
// タスクの右クリックメニュー制御

import { deleteTask, updateTask } from '../../store/store.js';
import { showMessageModal } from '../components.js';
import { getStartOfDay } from '../../utils/date.js';

/**
 * コンテキストメニューを表示
 */
export function showTaskContextMenu(task, x, y) {
    document.getElementById('task-context-menu')?.remove();

    const menu = document.createElement('div');
    menu.id = 'task-context-menu';
    menu.className = 'fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 z-50 animate-fade-in text-sm min-w-[150px]';
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    menu.innerHTML = `
        <div class="border-b border-gray-100 dark:border-gray-700 pb-1 mb-1">
             <button id="ctx-today" class="flex w-full items-center px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <svg class="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                今日
            </button>
            <button id="ctx-tomorrow" class="flex w-full items-center px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <svg class="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                明日
            </button>
            <button id="ctx-next-week" class="flex w-full items-center px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
                来週
            </button>
        </div>
        <button id="ctx-delete-task-btn" class="flex w-full items-center px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 transition">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            削除
        </button>
    `;

    document.body.appendChild(menu);

    const closeAndExec = (cb) => {
        menu.remove();
        cb();
    };

    menu.querySelector('#ctx-today').addEventListener('click', () => {
        closeAndExec(() => updateTask(task.id, { dueDate: getStartOfDay(new Date()) }));
    });

    menu.querySelector('#ctx-tomorrow').addEventListener('click', () => {
        const d = getStartOfDay(new Date()); d.setDate(d.getDate() + 1);
        closeAndExec(() => updateTask(task.id, { dueDate: d }));
    });

    menu.querySelector('#ctx-next-week').addEventListener('click', () => {
        const d = getStartOfDay(new Date()); d.setDate(d.getDate() + (8 - d.getDay())); // 次の月曜
        closeAndExec(() => updateTask(task.id, { dueDate: d }));
    });

    menu.querySelector('#ctx-delete-task-btn').addEventListener('click', () => {
        closeAndExec(() => showMessageModal('削除しますか？', async () => await deleteTask(task.id)));
    });

    const dismissMenu = (e) => {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', dismissMenu);
        }
    };

    setTimeout(() => document.addEventListener('click', dismissMenu), 0);
}