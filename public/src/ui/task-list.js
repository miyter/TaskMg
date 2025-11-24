// 更新日: 2025-11-25
// 役割: タスクリストのDOM描画と、リストアイテムに対するイベント処理を担当

import { updateTask, deleteTask } from '../store/store.js';
import { openEditModal } from './task-modal.js'; // モーダル機能
import { getLabelDetails } from './sidebar.js'; // ラベル詳細取得

// =========================================================
// ユーティリティ
// =========================================================

function getRecurLabel(type) {
    const labels = { daily: '毎日', weekly: '毎週', monthly: '毎月' };
    return labels[type] || '';
}

function showToast(message, type = 'blue') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    const bgColor = type === 'red' ? 'bg-red-500' : 'bg-gray-800';
    toast.className = `${bgColor} text-white text-sm px-4 py-3 rounded shadow-lg flex items-center transform transition-all duration-300 translate-y-2 opacity-0`;
    toast.innerHTML = `<i class="fas fa-info-circle mr-2"></i><span>${message}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
    });
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// =========================================================
// メイン描画関数
// =========================================================

export function renderTaskList(tasks, userId) {
    const taskList = document.getElementById('task-list');
    const badge = document.getElementById('task-count-badge');
    if (badge) badge.textContent = tasks.length;
    if (!taskList) return;

    if (tasks.length === 0) {
        const msg = "タスクがありません。新しいタスクを追加しましょう！✨";
        taskList.innerHTML = `<li class="flex flex-col items-center justify-center py-12 text-center text-gray-400"><div class="bg-gray-100 p-4 rounded-full mb-3"><i class="fas fa-clipboard-check fa-2x text-gray-300"></i></div><p class="text-sm">${msg}</p></li>`;
        return;
    }

    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        const isCompleted = task.status === 'completed';
        
        // --- タスク表示詳細ロジック ---
        let dueDateHtml = '';
        if (task.dueDate) {
            const d = task.dueDate.toDate ? task.dueDate.toDate() : new Date(task.dueDate);
            const dateStr = d.toLocaleDateString();
            const isOverdue = d < new Date() && !isCompleted;
            const today = new Date();
            const isToday = d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
            
            let colorClass = 'text-gray-500';
            let icon = 'fa-calendar-alt';
            if (isOverdue) {
                colorClass = 'text-red-500 font-bold';
                icon = 'fa-exclamation-circle';
            } else if (isToday) {
                colorClass = 'text-blue-600 font-bold';
                icon = 'fa-calendar-day';
            }
            dueDateHtml = `<span class="text-xs ${colorClass} ml-3 flex items-center" title="期限: ${dateStr}"><i class="fas ${icon} mr-1"></i> ${dateStr}</span>`;
        }

        const recurIcon = task.recurrence && task.recurrence.type !== 'none' ? `<span class="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-100 ml-2 flex items-center"><i class="fas fa-sync-alt mr-1"></i> ${getRecurLabel(task.recurrence.type)}</span>` : '';
        const descIcon = task.description ? `<span class="text-gray-400 ml-2" title="メモあり"><i class="fas fa-sticky-note"></i></span>` : '';
        
        let labelBadges = '';
        if (task.labelIds && task.labelIds.length > 0) {
            const badgesHtml = task.labelIds.map(lid => {
                const label = getLabelDetails(lid);
                if (!label) return '';
                return `<span class="text-xs bg-white text-gray-600 px-2 py-0.5 rounded-full border border-gray-200 flex items-center mr-1 mb-1"><span class="w-1.5 h-1.5 rounded-full mr-1.5" style="background-color: ${label.color}"></span>${label.name}</span>`;
            }).join('');
            labelBadges = `<div class="mt-2 flex flex-wrap pl-9">${badgesHtml}</div>`;
        }

        const borderClass = isCompleted ? 'border-gray-200 bg-gray-50' : 'border-gray-200 bg-white hover:border-blue-300';
        const opacityClass = isCompleted ? 'opacity-75' : '';

        // リストアイテムの構築 (ドラッグ＆ドロップ対応)
        li.draggable = true;
        li.setAttribute('data-id', task.id);
        li.className = `p-4 mb-3 rounded-xl border shadow-sm flex flex-col transition-all duration-200 cursor-pointer ${borderClass} ${opacityClass}`;
        li.innerHTML = `
            <div class="flex items-start justify-between w-full">
                <div class="flex items-start flex-1 min-w-0">
                    <div class="relative flex items-center justify-center w-6 h-6 mr-3 flex-shrink-0 mt-0.5">
                        <input type="checkbox" ${isCompleted ? 'checked' : ''} class="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded cursor-pointer checked:bg-blue-500 checked:border-blue-500 transition-all duration-200 hover:border-blue-400"><i class="fas fa-check text-white absolute text-xs opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center flex-wrap mb-0.5"><span class="truncate font-medium text-base ${isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}">${task.title}</span>${recurIcon}${descIcon}${dueDateHtml}</div>
                        ${task.description ? `<p class="text-xs text-gray-500 truncate pl-0.5 max-w-md">${task.description}</p>` : ''}
                    </div>
                </div>
                <button class="delete-btn text-gray-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100" title="削除"><i class="fas fa-trash-alt"></i></button>
            </div>${labelBadges}
        `;

        // --- イベントリスナーの付与 ---
        
        // チェックボックス (ステータス更新)
        li.querySelector('input[type="checkbox"]').addEventListener('click', (e) => {
            e.stopPropagation();
            updateTask(userId, task.id, { status: e.target.checked ? 'completed' : 'todo' });
        });
        
        // 削除ボタン
        li.querySelector('.delete-btn').addEventListener('click', async (e) => {
            e.stopPropagation();
            if(confirm("このタスクを削除しますか？")) {
                await deleteTask(userId, task.id);
                showToast("タスクを削除しました", "red");
            }
        });
        
        // ドラッグ開始
        li.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', task.id);
            e.dataTransfer.effectAllowed = 'copy';
            li.classList.add('opacity-50');
        });
        li.addEventListener('dragend', () => {
            li.classList.remove('opacity-50');
        });

        // タスククリック (編集モーダルを開く)
        li.addEventListener('click', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.closest('.delete-btn')) return;
            openEditModal(task);
        });

        taskList.appendChild(li);
    });
}