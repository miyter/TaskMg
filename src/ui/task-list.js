/**
 * タスクリスト描画制御
 */
import { createTaskItem } from './components/TaskItem.js';

/**
 * タスクリストをコンテナ内に描画する
 */
export function renderTaskList(container, tasks) {
    if (!container) return;

    const list = document.createElement('ul');
    list.id = 'task-list-ul';
    list.className = 'divide-y divide-gray-100 dark:divide-gray-800 border-b border-gray-100 dark:border-gray-800 mb-2';

    if (!tasks || tasks.length === 0) {
        list.innerHTML = `
            <li class="py-16 text-center text-gray-400 text-sm list-none">
                タスクがありません
            </li>
        `;
    } else {
        const fragment = document.createDocumentFragment();
        tasks.forEach(task => {
            fragment.appendChild(createTaskItem(task));
        });
        list.appendChild(fragment);
    }
    
    container.innerHTML = '';
    container.appendChild(list);
}