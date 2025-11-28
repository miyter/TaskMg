// @miyter:20251125
// ダッシュボードからの画面切り替えが機能しない問題を修正
// + ダークモード対応 (文字色白)

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

export function renderProjects(projects, onSelect) {
    const list = document.getElementById('project-list');
    if (!list) return;

    // ★修正: dark:text-white, dark:hover:bg-gray-700 を追加
    list.innerHTML = projects.map(p => `
        <li class="px-2 py-1.5 text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-sm cursor-pointer flex items-center transition-colors" data-id="${p.id}">
            <i class="fas fa-folder mr-2 text-blue-400"></i> ${p.name}
        </li>
    `).join('');
    
    list.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
            onSelect({ type: 'project', value: li.dataset.id });
            document.getElementById('task-view').classList.remove('hidden');
            document.getElementById('dashboard-view').classList.add('hidden');
        });
    });
}

export function renderLabels(labels, onSelect, userId) {
    const list = document.getElementById('label-list');
    if (!list) return;

    labelMap = {};
    labels.forEach(l => {
        labelMap[l.id] = l;
    });

    // ★修正: dark:text-white, dark:hover:bg-gray-700 を追加
    list.innerHTML = labels.map(l => `
        <li class="px-2 py-1.5 text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-sm cursor-pointer flex items-center transition-colors label-drop-target" data-id="${l.id}">
            <span class="w-3 h-3 rounded-full mr-2" style="background-color: ${l.color}"></span> ${l.name}
        </li>
    `).join('');

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
        // ★修正: ダークモード時のドラッグハイライト調整
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

    if (addProjBtn) {
        addProjBtn.addEventListener('click', async () => {
            const name = prompt("新しいプロジェクト名:");
            // ★再修正: projects.jsの仕様に合わせて文字列を直接渡す形に戻しました
            if (name) await addProject(userId, name);
        });
    }

    if (addLabelBtn) {
        addLabelBtn.addEventListener('click', async () => {
            const name = prompt("新しいラベル名:");
            const color = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
            // ★再修正: labels.jsの仕様に合わせて引数を個別に渡す形に戻しました
            if (name) await addLabel(userId, name, color);
        });
    }
    
    if (navDashboard) {
        navDashboard.addEventListener('click', () => {
            onSelectView({ type: 'dashboard', value: null });
        });
    }
}