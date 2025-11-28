// @miyter:20251125
// ダッシュボードからの画面切り替えが機能しない問題を修正
// + ダークモード対応 (文字色白)
// + タスク数カウント機能

import { addProject } from '@/store/projects.js';
import { addLabel } from '@/store/labels.js';
import { updateTask } from '@/store/store.js'; 

// プロジェクト名を取得するヘルパー関数
export function getProjectName(projectId, allProjects) {
    if (!projectId) return 'インボックス';
    const project = allProjects.find(p => p.id === projectId);
    return project ? project.name : '未分類';
}

// ラベルの詳細を取得するヘルパー関数
let labelMap = {};

export function getLabelDetails(labelId) {
    return labelMap[labelId];
}

/**
 * インボックスの件数を更新する
 */
export function updateInboxCount(tasks) {
    const countEl = document.getElementById('count-inbox');
    if (!countEl || !tasks) return;
    
    const count = tasks.filter(t => !t.projectId && t.status !== 'completed').length;
    countEl.textContent = count > 0 ? count : '';
}

export function renderProjects(projects, onSelect, tasks = null) {
    const list = document.getElementById('project-list');
    if (!list) return;

    // ★修正: タスク数を計算して右端に表示
    list.innerHTML = projects.map(p => {
        const count = tasks ? tasks.filter(t => t.projectId === p.id && t.status !== 'completed').length : 0;
        const countDisplay = count > 0 ? count : '';
        
        return `
        <li class="px-2 py-1.5 text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-sm cursor-pointer flex items-center justify-between transition-colors" data-id="${p.id}">
            <div class="flex items-center flex-1 min-w-0">
                <i class="fas fa-folder mr-2 text-blue-400 flex-shrink-0"></i> 
                <span class="truncate">${p.name}</span>
            </div>
            <span class="text-xs text-gray-400 font-light ml-2">${countDisplay}</span>
        </li>
    `}).join('');
    
    list.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
            onSelect({ type: 'project', value: li.dataset.id });
            document.getElementById('task-view').classList.remove('hidden');
            document.getElementById('dashboard-view').classList.add('hidden');
        });
    });
}

export function renderLabels(labels, onSelect, userId, tasks = null) {
    const list = document.getElementById('label-list');
    if (!list) return;

    labelMap = {};
    labels.forEach(l => {
        labelMap[l.id] = l;
    });

    // ★修正: タスク数を計算して右端に表示
    list.innerHTML = labels.map(l => {
        const count = tasks ? tasks.filter(t => t.labelIds && t.labelIds.includes(l.id) && t.status !== 'completed').length : 0;
        const countDisplay = count > 0 ? count : '';

        return `
        <li class="px-2 py-1.5 text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-sm cursor-pointer flex items-center justify-between transition-colors label-drop-target" data-id="${l.id}">
            <div class="flex items-center flex-1 min-w-0">
                <span class="w-3 h-3 rounded-full mr-2 flex-shrink-0" style="background-color: ${l.color}"></span> 
                <span class="truncate">${l.name}</span>
            </div>
            <span class="text-xs text-gray-400 font-light ml-2">${countDisplay}</span>
        </li>
    `}).join('');

    list.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
            onSelect({ type: 'label', value: li.dataset.id });
            document.getElementById('task-view').classList.remove('hidden');
            document.getElementById('dashboard-view').classList.add('hidden');
        });
        
        setupDropZone(li, li.dataset.id, userId);
    });
}

function setupDropZone(element, labelId, userId) {
    element.addEventListener('dragover', (e) => {
        e.preventDefault();
        element.classList.add('bg-blue-100', 'dark:bg-blue-900', 'border', 'border-blue-300', 'border-dashed');
    });
    
    element.addEventListener('dragleave', () => {
        element.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'border', 'border-blue-300', 'border-dashed');
    });
    
    element.addEventListener('drop', async (e) => {
        e.preventDefault();
        element.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'border', 'border-blue-300', 'border-dashed');
        
        const taskId = e.dataTransfer.getData('text/plain');
        if (taskId) {
            await updateTask(userId, taskId, {}); // リロードトリガー
            console.log(`Task ${taskId} dropped on Label ${labelId}.`); 
        }
    });
}

export function initSidebar(userId, onSelectView) {
    const addProjBtn = document.getElementById('add-project-btn');
    const addLabelBtn = document.getElementById('add-label-btn');
    const navDashboard = document.getElementById('nav-dashboard');
    const navInbox = document.getElementById('nav-inbox');

    if (addProjBtn) {
        addProjBtn.addEventListener('click', async () => {
            const name = prompt("新しいプロジェクト名:");
            if (name) await addProject(userId, name);
        });
    }

    if (addLabelBtn) {
        addLabelBtn.addEventListener('click', async () => {
            const name = prompt("新しいラベル名:");
            const color = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
            if (name) await addLabel(userId, name, color);
        });
    }
    
    if (navDashboard) {
        navDashboard.addEventListener('click', () => {
            onSelectView({ type: 'dashboard', value: null });
        });
    }

    // ★追加: インボックスクリック時の処理
    if (navInbox) {
        navInbox.addEventListener('click', () => {
            onSelectView({ type: 'inbox', value: null });
        });
    }
}