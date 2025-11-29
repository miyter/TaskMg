import { updateTaskStatus, deleteTask } from '../store/store.js';
import { getTaskDateColor, formatDateCompact } from '../utils/date.js';
import { openTaskEditModal } from './task-modal.js';
import { showMessageModal } from './components.js';

/**
 * タスクリストを描画してコンテナに追加する
 * @param {HTMLElement} container - 親要素
 * @param {Array} tasks - 表示するタスクの配列
 */
export function renderTaskList(container, tasks) {
    const list = document.createElement('ul');
    list.id = 'task-list-ul';
    // 高密度UI用のスタイリング
    list.className = 'divide-y divide-gray-100 dark:divide-gray-800 border-b border-gray-100 dark:border-gray-800 mb-2';

    if (!tasks || tasks.length === 0) {
        renderEmptyState(list);
    } else {
        tasks.forEach(task => {
            const li = createTaskItem(task);
            list.appendChild(li);
        });
    }
    container.appendChild(list);
}

/**
 * 個別のタスク要素(Row)を作成
 */
function createTaskItem(task) {
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);
    // ドラッグ&ドロップ対応
    li.setAttribute('draggable', 'true');
    
    const isCompleted = task.status === 'completed';

    // 行の基本スタイル (完了時は薄く表示)
    li.className = `
        group flex items-start gap-2 sm:gap-3 py-2 px-2 rounded -mx-2 transition-all duration-200 cursor-pointer border border-transparent 
        ${isCompleted ? 'opacity-60 bg-gray-50 dark:bg-gray-900/50' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-100 dark:hover:border-gray-700'}
    `;

    // 日付情報の整形
    const dateText = formatDateCompact(task.dueDate);
    const dateColorClass = getTaskDateColor(task.dueDate);

    li.innerHTML = `
        <!-- ドラッグハンドル (ホバー時のみ表示) -->
        <div class="drag-handle hidden group-hover:flex items-center justify-center w-4 h-5 mt-0.5 text-gray-300 hover:text-gray-500 cursor-move" title="並び替え">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path></svg>
        </div>

        <!-- 完了チェックボックス -->
        <div class="task-checkbox mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors z-10
            ${isCompleted 
                ? 'bg-blue-500 border-blue-500 text-white' 
                : 'border-gray-400 dark:border-gray-500 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-transparent text-transparent hover:text-blue-500'}"
            title="${isCompleted ? '未完了に戻す' : '完了にする'}">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
        </div>

        <!-- タスクコンテンツ -->
        <div class="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-2 items-center">
            <!-- タイトル & 詳細 -->
            <div class="col-span-1 sm:col-span-9 flex flex-col justify-center">
                <div class="text-[0.93rem] leading-snug truncate font-medium transition-colors ${isCompleted ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}">
                    ${task.title}
                </div>
                ${task.description ? `<div class="text-xs text-gray-400 truncate mt-0.5 font-light"><i class="far fa-sticky-note mr-1 opacity-70"></i>${task.description}</div>` : ''}
            </div>

            <!-- メタ情報 (日付・タグ・繰り返し) - 右寄せ -->
            <div class="col-span-1 sm:col-span-3 flex items-center sm:justify-end space-x-2 text-xs h-full mt-1 sm:mt-0">
                
                <!-- 繰り返しアイコン -->
                ${task.recurrence && task.recurrence.type !== 'none' ? `
                    <span class="text-blue-500 dark:text-blue-400 flex items-center" title="繰り返し: ${task.recurrence.type}">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    </span>
                ` : ''}

                <!-- 日付 -->
                ${dateText ? `
                    <div class="flex items-center ${dateColorClass} bg-gray-50 dark:bg-gray-800/50 px-1.5 py-0.5 rounded">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        ${dateText}
                    </div>
                ` : ''}

                <!-- ラベル数 -->
                ${task.labelIds && task.labelIds.length > 0 ? `
                    <span class="text-gray-400 group-hover:text-gray-500 flex items-center">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                        <span class="ml-0.5">${task.labelIds.length}</span>
                    </span>
                ` : ''}
            </div>
        </div>

        <!-- アクションボタン (ホバー時) -->
        <div class="hidden group-hover:flex items-center ml-2 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <!-- 編集ボタン -->
            <button class="edit-btn p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition" title="編集">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            </button>
            <!-- 削除ボタン -->
            <button class="delete-btn p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition" title="削除">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
        </div>
    `;

    // --- イベントハンドリング ---

    // 1. 完了トグル処理 (楽観的UI更新付き)
    const checkbox = li.querySelector('.task-checkbox');
    checkbox.addEventListener('click', async (e) => {
        e.stopPropagation();
        const newStatus = isCompleted ? 'todo' : 'completed';
        
        // 即座に見た目を切り替える (Optimistic UI)
        if (isCompleted) {
            checkbox.classList.remove('bg-blue-500', 'border-blue-500', 'text-white');
            checkbox.classList.add('border-gray-400', 'hover:border-blue-500', 'text-transparent', 'hover:text-blue-500');
            li.classList.remove('opacity-60', 'bg-gray-50');
        } else {
            checkbox.classList.add('bg-blue-500', 'border-blue-500', 'text-white');
            checkbox.classList.remove('border-gray-400', 'text-transparent');
            li.classList.add('opacity-60', 'bg-gray-50');
        }

        // Firestore更新
        await updateTaskStatus(task.id, newStatus);
    });

    // 2. 編集モーダル表示 (行クリック or 編集ボタン)
    li.addEventListener('click', () => openTaskEditModal(task));
    li.querySelector('.edit-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openTaskEditModal(task);
    });

    // 3. 削除処理 (確認モーダル付き)
    li.querySelector('.delete-btn').addEventListener('click', async (e) => {
        e.stopPropagation();
        showMessageModal('このタスクを削除しますか？', async () => {
            // UIから即座に消すアニメーションなどを入れても良いが、onSnapshotで消えるので任せる
            await deleteTask(task.id);
        });
    });

    // 4. ドラッグ開始時のスタイル適用
    li.addEventListener('dragstart', (e) => {
        // IDを転送データにセット
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
        // ドラッグ中の見た目を薄くする
        setTimeout(() => li.classList.add('opacity-40'), 0);
    });
    
    li.addEventListener('dragend', () => {
        li.classList.remove('opacity-40');
    });

    return li;
}

/**
 * タスクがない場合の表示
 */
function renderEmptyState(list) {
    list.innerHTML = `
        <div class="py-16 text-center select-none">
            <div class="mb-4 transform transition hover:scale-110 duration-200 inline-block">
                <svg class="w-16 h-16 mx-auto text-gray-200 dark:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">タスクはすべて完了しました</p>
            <p class="text-xs text-gray-400 mt-1">素晴らしい一日を！</p>
        </div>
    `;
}