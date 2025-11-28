// タスクリストの描画とカードUIの生成

import { updateTaskStatus, deleteTask } from '@/store/store.js';
import { openTaskModal } from './task-modal.js';
import { showMessageModal } from './components.js';

/**
 * タスク一覧を描画する
 */
export function renderTaskList(tasks, currentUserId) {
    const listEl = document.getElementById('task-list');
    const badgeEl = document.getElementById('task-count-badge');
    
    if (!listEl) return;
    listEl.innerHTML = '';

    if (!tasks || tasks.length === 0) {
        listEl.innerHTML = '<li class="text-center text-gray-400 dark:text-gray-500 mt-10 italic">タスクがありません</li>';
        if (badgeEl) badgeEl.textContent = '0';
        return;
    }

    if (badgeEl) badgeEl.textContent = tasks.length;

    tasks.forEach(task => {
        const li = document.createElement('li');
        const isCompleted = task.status === 'completed';
        
        // 期限切れチェック
        const isOverdue = !isCompleted && task.dueDate && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0));
        
        // ★修正: 背景色、文字色、ボーダーをダークモード対応
        // bg-white -> bg-white dark:bg-gray-800
        // text-gray-800 -> text-gray-800 dark:text-gray-100
        // border-gray-200 -> dark:border-gray-700
        li.className = `
            group bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200
            border border-gray-100 dark:border-gray-700
            flex items-start gap-3 cursor-pointer
            ${isCompleted ? 'opacity-60 bg-gray-50 dark:bg-gray-900' : ''}
        `;
        li.setAttribute('draggable', 'true');
        li.dataset.id = task.id;

        // チェックボックス
        const checkbox = document.createElement('div');
        checkbox.className = `
            w-5 h-5 rounded border cursor-pointer mt-1 flex-shrink-0 flex items-center justify-center transition-colors
            ${isCompleted 
                ? 'bg-blue-500 border-blue-500 text-white' 
                : 'border-gray-300 dark:border-gray-500 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-gray-700'}
        `;
        checkbox.innerHTML = isCompleted ? '<i class="fas fa-check text-xs"></i>' : '';
        
        // 完了トグル処理
        checkbox.addEventListener('click', async (e) => {
            e.stopPropagation();
            const newStatus = isCompleted ? 'todo' : 'completed';
            // UIを即時反映（楽観的UI）
            if (isCompleted) {
                checkbox.className = 'w-5 h-5 rounded border border-gray-300 dark:border-gray-500 cursor-pointer mt-1 flex-shrink-0 flex items-center justify-center bg-white dark:bg-gray-700';
                checkbox.innerHTML = '';
                li.classList.remove('opacity-60', 'bg-gray-50', 'dark:bg-gray-900');
            } else {
                checkbox.className = 'w-5 h-5 rounded border border-blue-500 bg-blue-500 text-white cursor-pointer mt-1 flex-shrink-0 flex items-center justify-center';
                checkbox.innerHTML = '<i class="fas fa-check text-xs"></i>';
                li.classList.add('opacity-60', 'bg-gray-50', 'dark:bg-gray-900');
            }
            await updateTaskStatus(currentUserId, task.id, newStatus);
        });

        // コンテンツ部分
        const content = document.createElement('div');
        content.className = 'flex-1 min-w-0';

        // タイトル
        const titleEl = document.createElement('h3');
        titleEl.className = `text-sm font-medium leading-6 truncate ${isCompleted ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-800 dark:text-gray-100'}`;
        titleEl.textContent = task.title;

        // メタ情報（期限、メモ有無、ラベルなど）
        const metaEl = document.createElement('div');
        metaEl.className = 'flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400';

        // 期限表示
        if (task.dueDate) {
            const dateStr = new Date(task.dueDate).toLocaleDateString();
            const dateSpan = document.createElement('span');
            dateSpan.className = `flex items-center ${isOverdue ? 'text-red-500 dark:text-red-400 font-semibold' : ''}`;
            dateSpan.innerHTML = `<i class="far fa-calendar-alt mr-1"></i>${dateStr}`;
            metaEl.appendChild(dateSpan);
        }

        // 繰り返しアイコン
        if (task.recurrence && task.recurrence.type !== 'none') {
            const repeatSpan = document.createElement('span');
            repeatSpan.className = 'flex items-center text-blue-500 dark:text-blue-400';
            repeatSpan.innerHTML = `<i class="fas fa-sync-alt mr-1"></i>`;
            metaEl.appendChild(repeatSpan);
        }

        // メモあり表示
        if (task.description) {
            const memoSpan = document.createElement('span');
            memoSpan.innerHTML = `<i class="far fa-sticky-note mr-1"></i>`;
            metaEl.appendChild(memoSpan);
        }
        
        // ラベル表示 (簡易版: 本来はLabelStoreから名前を引くが、ここではIDのみか、Labelオブジェクトが結合されている前提)
        // taskオブジェクトにlabelNamesが含まれているか、別途解決が必要。今回は簡易的にバッジを表示
        if (task.labelIds && task.labelIds.length > 0) {
             const labelIcon = document.createElement('span');
             labelIcon.className = 'text-gray-400 dark:text-gray-500 ml-1';
             labelIcon.innerHTML = `<i class="fas fa-tags"></i> ${task.labelIds.length}`;
             metaEl.appendChild(labelIcon);
        }

        content.appendChild(titleEl);
        content.appendChild(metaEl);

        // 削除ボタン
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition p-1.5';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            showMessageModal('タスクを削除しますか？', async () => {
                await deleteTask(currentUserId, task.id);
            });
        });

        li.appendChild(checkbox);
        li.appendChild(content);
        li.appendChild(deleteBtn);

        // 詳細編集モーダルを開く
        li.addEventListener('click', () => {
            openTaskModal(task);
        });

        // ドラッグイベント
        li.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', task.id);
            li.classList.add('opacity-50');
        });
        li.addEventListener('dragend', () => {
            li.classList.remove('opacity-50');
        });

        listEl.appendChild(li);
    });
}