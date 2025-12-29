/**
 * タスクリスト描画制御
 */
import { createTaskItem } from './components/TaskItem.js';
import { showTaskContextMenu } from './components/TaskContextMenu.js';

/**
 * タスクリストをコンテナ内に描画する
 * @param {HTMLElement} container
 * @param {Array} tasks
 * @param {Array} allProjects
 * @param {Object} selectionState - { isSelectionMode, selectedIds } from ui-state
 * @param {Object} context - コンテキスト情報（フィルター条件等）
 */
export function renderTaskList(container, tasks, allProjects, selectionState = { isSelectionMode: false, selectedIds: new Set() }, context = {}) {
    if (!container) return;

    const list = document.createElement('ul');
    list.id = 'task-list-ul';
    list.className = 'divide-y divide-gray-100 dark:divide-gray-800 border-b border-gray-100 dark:border-gray-800 mb-2 min-h-[50px]'; // min-h確保で空でも右クリックしやすく

    // 背景での右クリック
    list.addEventListener('contextmenu', (e) => {
        // li要素（タスク）上でのイベントはstopPropagationされているはずだが、念のためtarget確認
        if (e.target === list || e.target.closest('li') === null) {
            e.preventDefault();
            showTaskContextMenu(null, e.clientX, e.clientY);
        }
    });

    if (!tasks || tasks.length === 0) {
        list.innerHTML = `
            <li class="py-16 text-center text-gray-400 text-sm list-none select-none">
                タスクがありません
                <div class="text-xs mt-2 opacity-70">右クリックでタスク追加・並び替え</div>
            </li>
        `;
    } else {
        const fragment = document.createDocumentFragment();
        tasks.forEach(task => {
            fragment.appendChild(createTaskItem(task, allProjects, selectionState, context));
        });
        list.appendChild(fragment);
    }

    container.innerHTML = '';
    container.appendChild(list);
}