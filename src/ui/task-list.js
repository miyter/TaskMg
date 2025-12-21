// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: 不要なドラッグイベント設定の削除
 */

import { createTaskItem } from './components/TaskItem.js';

/**
 * タスクリストをコンテナ内に描画する
 */
export function renderTaskList(container, tasks) {
    const list = document.createElement('ul');
    list.id = 'task-list-ul';
    list.className = 'divide-y divide-gray-100 dark:divide-gray-800 border-b border-gray-100 dark:border-gray-800 mb-2';

    if (!tasks || tasks.length === 0) {
        // HTML構造の修正: ul > li
        list.innerHTML = `
            <li class="py-16 text-center text-gray-400 text-sm list-none">
                タスクがありません
            </li>
        `;
    } else {
        tasks.forEach(task => {
            list.appendChild(createTaskItem(task));
        });
    }
    
    container.innerHTML = '';
    container.appendChild(list);
}