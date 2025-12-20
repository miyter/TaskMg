// @ts-nocheck
// @miyter:20251221
// タスクリスト全体の制御

import { createTaskItem } from './components/TaskItem.js';

/**
 * タスクリストをコンテナ内に描画する
 */
export function renderTaskList(container, tasks) {
    const list = document.createElement('ul');
    list.id = 'task-list-ul';
    list.className = 'divide-y divide-gray-100 dark:divide-gray-800 border-b border-gray-100 dark:border-gray-800 mb-2';

    if (!tasks || tasks.length === 0) {
        list.innerHTML = `<div class="py-16 text-center text-gray-400 text-sm">タスクがありません</div>`;
    } else {
        tasks.forEach(task => {
            list.appendChild(createTaskItem(task));
        });
        setupListDragEvents(list);
    }
    
    container.innerHTML = '';
    container.appendChild(list);
}

/**
 * リスト内のドラッグ＆ドロップイベントを設定
 */
function setupListDragEvents(list) {
    list.addEventListener('dragover', (e) => {
        e.preventDefault();
        // 必要に応じて並び替えのビジュアルフィードバックをここに追加
    });
}