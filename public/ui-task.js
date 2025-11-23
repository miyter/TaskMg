// 作成日: 2025-11-25
// 役割: タスク一覧の描画、編集、ドラッグ＆ドロップなどのUI操作

import { updateTask, removeLabelFromTask } from "./store.js";
import { getProjectName, getLabelDetails } from "./ui-sidebar.js";

const taskList = document.getElementById('task-list');

// ユーティリティ
function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toISOString().split('T')[0];
}

function isOverdue(timestamp) {
    if (!timestamp) return false;
    const now = new Date();
    const dueDate = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    now.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < now;
}

/**
 * タスク一覧を描画
 * showCompleted: 完了済みタスクを表示するかどうか
 */
export function renderTaskList(tasks, currentUserId, showCompleted = true) {
    taskList.innerHTML = '';
    
    // 完了タスクのフィルタリング
    const filteredTasks = showCompleted ? tasks : tasks.filter(t => t.status !== 'completed');

    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<li class="p-8 text-center text-gray-400 italic">タスクがありません</li>';
        return;
    }

    filteredTasks.forEach(task => {
        const isCompleted = task.status === 'completed';
        const overdue = isOverdue(task.dueDate);
        const li = document.createElement('li');
        
        li.draggable = true;
        li.dataset.id = task.id;
        li.dataset.status = task.status;
        
        // プロジェクトバッジ
        const projectName = getProjectName(task.projectId);
        const projectBadge = projectName ? `<span class="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">#${projectName}</span>` : '';

        // ラベルバッジ
        let labelBadges = '';
        if (task.labelIds && task.labelIds.length > 0) {
            task.labelIds.forEach(lblId => {
                const lbl = getLabelDetails(lblId);
                if (lbl) {
                    labelBadges += `
                        <span class="task-label-badge inline-flex items-center text-[10px] px-2 py-0.5 rounded-full mr-1 cursor-pointer hover:opacity-80 transition-opacity" 
                              style="background-color: ${lbl.color}40; color: #444; border: 1px solid ${lbl.color}"
                              data-task-id="${task.id}" data-label-id="${lbl.id}" title="クリックで外す">
                            ${lbl.name} <span class="ml-1 opacity-50">×</span>
                        </span>`;
                }
            });
        }

        let borderColor = isCompleted ? 'border-gray-300' : (overdue ? 'border-red-500' : 'border-blue-500');
        
        li.className = `p-4 border-l-4 ${borderColor} bg-white rounded-lg shadow flex justify-between items-start hover:shadow-lg transition cursor-move ${isCompleted ? 'opacity-60' : ''}`;
        
        li.innerHTML = `
            <div class="flex items-start flex-grow space-x-3 pointer-events-none">
                <input type="checkbox" class="task-toggle mt-1.5 w-5 h-5 cursor-pointer text-blue-600 pointer-events-auto" ${isCompleted ? 'checked' : ''}>
                
                <div class="flex-grow min-w-0 pointer-events-auto">
                    <div class="flex flex-wrap items-center gap-2 mb-1">
                        ${projectBadge}
                        ${labelBadges}
                    </div>
                    
                    <span class="task-title-span text-gray-800 text-lg ${isCompleted ? 'line-through text-gray-500' : ''} cursor-pointer hover:bg-yellow-50 px-1 rounded block truncate">
                        ${task.title}
                    </span>
                    
                    <div class="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                        ${task.dueDate ? `
                            <span class="flex items-center ${overdue && !isCompleted ? 'text-red-500 font-bold' : ''}">
                                📅 ${formatDate(task.dueDate)}
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>

            <div class="flex items-start space-x-2 ml-2 pointer-events-auto">
                <input type="date" class="task-due-date-input p-1 border rounded text-xs w-6" value="${task.dueDate ? formatDate(task.dueDate) : ''}" title="期限日変更">
                <button class="task-delete-btn text-gray-300 hover:text-red-500 px-1">🗑️</button>
            </div>
        `;

        // ドラッグイベント
        li.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', task.id);
            li.classList.add('opacity-50');
        });
        li.addEventListener('dragend', () => {
            li.classList.remove('opacity-50');
        });

        taskList.appendChild(li);
    });
}

// 編集機能
export function startEditing(li, taskId, oldTitle, currentUserId) {
    const span = li.querySelector('.task-title-span');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = oldTitle;
    input.className = 'flex-grow p-1 border border-blue-500 rounded outline-none w-full';
    
    span.style.display = 'none';
    span.parentElement.insertBefore(input, span);
    input.focus();
    
    const finish = async () => {
        const val = input.value.trim();
        if (val && val !== oldTitle) await updateTask(currentUserId, taskId, { title: val });
        input.remove();
        span.style.display = '';
    };
    input.addEventListener('blur', finish);
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') finish(); });
}

// ラベル削除などのアクションハンドラ
export async function handleLabelBadgeClick(e, currentUserId) {
    const labelBadge = e.target.closest('.task-label-badge');
    if (labelBadge) {
        e.stopPropagation();
        if (confirm('このタグを外しますか？')) {
            await removeLabelFromTask(currentUserId, labelBadge.dataset.taskId, labelBadge.dataset.labelId);
        }
        return true;
    }
    return false;
}