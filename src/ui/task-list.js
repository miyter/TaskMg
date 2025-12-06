// @ts-nocheck
// ★修正: updateTaskStatus, deleteTask をインポート
import { updateTaskStatus, deleteTask } from '../store/store.js';
import { getTaskDateColor, formatDateCompact } from '../utils/date.js';
import { openTaskEditModal } from './task-modal.js';
import { showMessageModal } from './components.js';

export function renderTaskList(container, tasks) {
    const list = document.createElement('ul');
    list.id = 'task-list-ul';
    // flex-col, gap-1, padding/margin調整を行い、高密度化
    list.className = 'divide-y divide-gray-100 dark:divide-gray-800 border-b border-gray-100 dark:divide-gray-800 mb-2';

    if (!tasks || tasks.length === 0) {
        renderEmptyState(list);
    } else {
        tasks.forEach(task => {
            const li = createTaskItem(task);
            list.appendChild(li);
        });
        // ★修正: リスト全体のドラッグイベントは削除
        // setupListDragEvents(list); 
    }
    container.appendChild(list);
}

function createTaskItem(task) {
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);
    // ★修正: ドラッグ機能を削除
    // li.setAttribute('draggable', 'true'); 
    
    const isCompleted = task.status === 'completed';
    const dateText = formatDateCompact(task.dueDate);
    // ★修正: getTaskDateDateColor -> getTaskDateColor に修正
    const dateColorClass = getTaskDateColor(task.dueDate);
    // ★追加: 繰り返し設定があるかどうかのフラグ
    const isRecurring = !!task.recurrence; 

    // ★修正: UIをよりコンパクトに（Todoist風の高密度なリストアイテム）
    // ★修正: ドラッグ関連のクラス(group-hover:flex)を削除し、純粋なホバー効果のみに
    li.className = `group flex items-start gap-2 sm:gap-3 py-2 px-2 rounded -mx-2 transition-all duration-200 cursor-pointer border border-transparent ${isCompleted ? 'opacity-60 bg-gray-50 dark:bg-gray-900/50' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-100 dark:hover:border-gray-700'}`;

    // ★修正: HTML構造を更新 - ドラッグハンドルを削除し、繰り返しアイコンを追加
    // ★修正: ホバー時の編集/削除ボタンを完全に削除
    li.innerHTML = `
        <div class="task-checkbox mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors z-10 ${isCompleted ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-400 dark:border-gray-500 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-transparent text-transparent hover:text-blue-500'}">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
        </div>
        <div class="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-2 items-center">
            <div class="col-span-1 sm:col-span-9 flex flex-col justify-center">
                <div class="text-[0.93rem] leading-snug truncate font-medium transition-colors ${isCompleted ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}">${task.title}</div>
                ${task.description ? `<div class="text-xs text-gray-400 truncate mt-0.5 font-light">${task.description}</div>` : ''}
            </div>
            <div class="col-span-1 sm:col-span-3 flex items-center sm:justify-end space-x-2 text-xs h-full mt-1 sm:mt-0">
                <!-- 繰り返しアイコン -->
                ${isRecurring ? `<div class="text-blue-500 dark:text-blue-400" title="繰り返し設定あり">🔁</div>` : ''}
                <!-- 日付表示 -->
                ${dateText ? `<div class="flex items-center ${dateColorClass} bg-gray-50 dark:bg-gray-800/50 px-1.5 py-0.5 rounded"><svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>${dateText}</div>` : ''}
                <!-- ラベル数表示 -->
                ${task.labelIds?.length > 0 ? `<span class="text-gray-400 group-hover:text-gray-500 flex items-center"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg><span class="ml-0.5">${task.labelIds.length}</span></span>` : ''}
            </div>
        </div>
    `;

    // イベント設定 (完了、編集、削除)
    const checkbox = li.querySelector('.task-checkbox');
    checkbox.addEventListener('click', async (e) => {
        e.stopPropagation();
        // ★修正: userIdを削除
        await updateTaskStatus(task.id, isCompleted ? 'todo' : 'completed');
    });
    // ★修正: タスク行全体をクリックでモーダルを開く
    li.addEventListener('click', () => openTaskEditModal(task));

    // ★追加: 右クリックイベント (タスク移動メニュー用 -> 削除機能も追加)
    li.addEventListener('contextmenu', (e) => {
        e.preventDefault(); // デフォルトのコンテキストメニューを抑制
        e.stopPropagation();
        
        // コンテキストメニューを表示
        showTaskContextMenu(task, e.clientX, e.clientY);
    });

    return li;
}

/**
 * タスク用のコンテキストメニューを表示する
 */
function showTaskContextMenu(task, x, y) {
    // 既存のメニューがあれば削除
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

    // 削除ボタン
    document.getElementById('ctx-delete-task-btn').addEventListener('click', () => {
        menu.remove();
        showMessageModal('削除しますか？', async () => await deleteTask(task.id));
    });

    // 画面外クリックで閉じる
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

// ★削除: setupListDragEvents関数を削除 (ドラッグ並び替え機能廃止のため)
/*
function setupListDragEvents(list) {
    // ...
}
*/

// ★削除: getDragAfterElement関数を削除 (ドラッグ並び替え機能廃止のため)
/*
function getDragAfterElement(container, y) {
    // ...
}
*/

function renderEmptyState(list) {
    list.innerHTML = `<div class="py-16 text-center text-gray-400 text-sm">タスクがありません</div>`;
}