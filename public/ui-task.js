// 更新日: 2025-11-25
// 役割: タスク一覧の描画、編集、詳細メモUI

import { updateTask, removeLabelFromTask, addLabelToTask } from "./store.js";
import { getProjectName, getLabelDetails, getAllLabels } from "./ui-sidebar.js";

const taskList = document.getElementById('task-list');

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

export function renderTaskList(tasks, currentUserId, showCompleted = true) {
    taskList.innerHTML = '';
    
    const filteredTasks = showCompleted ? tasks : tasks.filter(t => t.status !== 'completed');

    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<li class="p-8 text-center text-gray-400 italic">タスクがありません</li>';
        return;
    }

    filteredTasks.forEach(task => {
        const isCompleted = task.status === 'completed';
        const overdue = isOverdue(task.dueDate);
        const hasDescription = task.description && task.description.trim().length > 0;
        const li = document.createElement('li');
        
        li.draggable = true;
        li.dataset.id = task.id;
        li.dataset.status = task.status;
        
        const projectName = getProjectName(task.projectId);
        const projectBadge = projectName ? `<span class="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">#${projectName}</span>` : '';

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
        
        li.className = `p-4 border-l-4 ${borderColor} bg-white rounded-lg shadow transition cursor-move ${isCompleted ? 'opacity-60' : ''}`;
        
        li.innerHTML = `
            <div class="flex items-start flex-grow space-x-3 pointer-events-none">
                <input type="checkbox" class="task-toggle mt-1.5 w-5 h-5 cursor-pointer text-blue-600 pointer-events-auto" ${isCompleted ? 'checked' : ''}>
                
                <div class="flex-grow min-w-0 pointer-events-auto relative">
                    <div class="flex flex-wrap items-center gap-2 mb-1">
                        ${projectBadge}
                        ${labelBadges}
                        <button class="add-label-btn text-xs bg-gray-100 hover:bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200 transition-colors" title="ラベルを追加">
                            + Tag
                        </button>
                        <!-- メモボタン -->
                         <button class="toggle-description-btn text-xs ${hasDescription ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-gray-100 text-gray-500 border-gray-200'} hover:opacity-80 px-1.5 py-0.5 rounded border transition-colors" title="詳細メモ">
                            📝
                        </button>
                        
                        <div class="label-dropdown hidden absolute top-6 left-0 z-20 bg-white border border-gray-200 shadow-lg rounded-lg p-2 w-48 max-h-48 overflow-y-auto"></div>
                    </div>
                    
                    <span class="task-title-span text-gray-800 text-lg ${isCompleted ? 'line-through text-gray-500' : ''} cursor-pointer hover:bg-yellow-50 px-1 rounded block truncate">
                        ${task.title}
                    </span>
                    
                    <!-- 詳細メモエリア (初期は非表示) -->
                    <div class="task-description-area hidden mt-2 w-full">
                         <textarea class="w-full p-2 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none bg-yellow-50" rows="3" placeholder="詳細を入力...">${task.description || ''}</textarea>
                         <div class="flex justify-end mt-1 space-x-2">
                             <button class="cancel-description-btn text-xs text-gray-500 hover:text-gray-700">閉じる</button>
                             <button class="save-description-btn text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">保存</button>
                         </div>
                    </div>
                    <!-- 詳細プレビュー (エリアが閉じている時で、メモがある場合表示) -->
                    <div class="task-description-preview mt-1 text-xs text-gray-500 truncate ${!hasDescription ? 'hidden' : ''}" title="${task.description || ''}">
                        ${task.description || ''}
                    </div>
                    
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

export async function handleTaskClickEvents(e, currentUserId) {
    const target = e.target;
    const li = target.closest('li');
    if (!li) return false;
    const taskId = li.dataset.id;
    
    // 1. ラベル削除
    const labelBadge = target.closest('.task-label-badge');
    if (labelBadge) {
        e.stopPropagation();
        if (confirm('このタグを外しますか？')) {
            await removeLabelFromTask(currentUserId, labelBadge.dataset.taskId, labelBadge.dataset.labelId);
        }
        return true;
    }

    // 2. メモ開閉
    if (target.matches('.toggle-description-btn')) {
        e.stopPropagation();
        const descArea = li.querySelector('.task-description-area');
        const descPreview = li.querySelector('.task-description-preview');
        
        if (descArea.classList.contains('hidden')) {
            descArea.classList.remove('hidden');
            descPreview.classList.add('hidden');
        } else {
            descArea.classList.add('hidden');
            if (descPreview.textContent.trim()) descPreview.classList.remove('hidden');
        }
        return true;
    }

    // 3. メモ保存
    if (target.matches('.save-description-btn')) {
        e.stopPropagation();
        const textarea = li.querySelector('textarea');
        const val = textarea.value;
        await updateTask(currentUserId, taskId, { description: val });
        
        // 閉じる
        const descArea = li.querySelector('.task-description-area');
        descArea.classList.add('hidden');
        return true;
    }
    
    // 4. メモキャンセル
    if (target.matches('.cancel-description-btn')) {
        e.stopPropagation();
        const descArea = li.querySelector('.task-description-area');
        const descPreview = li.querySelector('.task-description-preview');
        descArea.classList.add('hidden');
        if (descPreview.textContent.trim()) descPreview.classList.remove('hidden');
        return true;
    }

    // 5. ラベル追加メニュー表示
    if (target.matches('.add-label-btn')) {
        e.stopPropagation();
        document.querySelectorAll('.label-dropdown').forEach(el => el.classList.add('hidden'));

        const dropdown = li.querySelector('.label-dropdown');
        renderLabelDropdown(dropdown, taskId, currentUserId);
        dropdown.classList.remove('hidden');

        const closeDropdown = (ev) => {
            if (!dropdown.contains(ev.target) && ev.target !== target) {
                dropdown.classList.add('hidden');
                document.removeEventListener('click', closeDropdown);
            }
        };
        setTimeout(() => document.addEventListener('click', closeDropdown), 0);
        return true;
    }

    if (target.closest('.label-dropdown') || target.closest('.task-description-area')) {
        return true; 
    }

    return false;
}

function renderLabelDropdown(container, taskId, currentUserId) {
    const labels = getAllLabels();
    container.innerHTML = '';

    if (labels.length === 0) {
        container.innerHTML = '<span class="text-xs text-gray-400">ラベルがありません</span>';
        return;
    }

    labels.forEach(lbl => {
        const div = document.createElement('div');
        div.className = 'flex items-center p-1 hover:bg-gray-50 rounded cursor-pointer';
        const colorBox = `<span class="inline-block w-3 h-3 rounded-full mr-2" style="background-color: ${lbl.color}"></span>`;
        div.innerHTML = `<label class="flex items-center w-full cursor-pointer text-sm text-gray-700">${colorBox} ${lbl.name}</label>`;

        div.addEventListener('click', async () => {
            await addLabelToTask(currentUserId, taskId, lbl.id);
            div.style.backgroundColor = '#dbeafe';
            setTimeout(() => div.style.backgroundColor = '', 200);
        });
        container.appendChild(div);
    });
}