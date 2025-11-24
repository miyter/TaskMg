// 更新日: 2025-11-25 修正版
// 役割: サイドバー（プロジェクト・ラベル）の描画とイベント設定

import { addProject, subscribeProjects, deleteProject } from "./project-store.js";
import { addLabel, subscribeLabels, deleteLabel } from "./label-store.js";
import { addLabelToTask } from "./store.js";

const projectList = document.getElementById('project-list');
const labelList = document.getElementById('label-list');
const currentViewTitle = document.getElementById('current-view-title');
const addProjectBtn = document.getElementById('add-project-btn'); // 取得
const addLabelBtn = document.getElementById('add-label-btn');     // 取得

// 状態保持用
let projectMap = {};
let labelMap = {};
let allLabels = []; 

let unsubscribeProjects = null;
let unsubscribeLabels = null;

// --- 公開メソッド ---

export function initSidebar(userId, currentFilter, onSelectView) {
    // ★ここでイベントリスナーを設定して、ボタンを復活させる
    if (addProjectBtn) {
        addProjectBtn.onclick = async () => {
            const name = prompt("新しいプロジェクト名:");
            if (name) await addProject(userId, name);
        };
    }

    if (addLabelBtn) {
        addLabelBtn.onclick = async () => {
            const name = prompt("新しいタグ名:");
            if (name) await addLabel(userId, name);
        };
    }

    startProjectListener(userId, currentFilter);
    startLabelListener(userId, currentFilter, onSelectView);
}

export function cleanupSidebar() {
    if (unsubscribeProjects) unsubscribeProjects();
    if (unsubscribeLabels) unsubscribeLabels();
    if (projectList) projectList.innerHTML = '';
    if (labelList) labelList.innerHTML = '';
    allLabels = [];
}

export function getAllLabels() {
    return allLabels;
}

export function updateSidebarSelection(currentFilter) {
    document.querySelectorAll('.project-item, .label-item').forEach(btn => {
        const isActive = btn.dataset.type === currentFilter.type && btn.dataset.id === currentFilter.value;
        const baseClass = btn.dataset.type === 'label' ? 'flex items-center' : '';
        
        if (isActive) {
            btn.className = `${baseClass} w-full text-left px-3 py-2 text-sm transition-colors rounded-lg bg-blue-50 text-blue-700 font-medium`;
        } else {
            btn.className = `${baseClass} w-full text-left px-3 py-2 text-sm transition-colors rounded-lg text-gray-600 hover:bg-gray-50`;
        }
    });
}

export function updateViewTitle(filter) {
    if (!currentViewTitle) return;

    if (filter.type === 'project') {
        if (filter.value === 'all') currentViewTitle.textContent = '📁 すべてのタスク';
        else if (filter.value === 'inbox') currentViewTitle.textContent = '📥 インボックス';
        else currentViewTitle.textContent = `# ${projectMap[filter.value] || 'プロジェクト'}`;
    } else if (filter.type === 'label') {
        const label = labelMap[filter.value];
        currentViewTitle.innerHTML = label ? 
            `<span class="inline-block w-4 h-4 rounded-full mr-2" style="background-color: ${label.color}"></span> ${label.name}` : 'ラベル';
    }
}

export function getProjectName(projectId) {
    return projectMap[projectId] || '';
}

export function getLabelDetails(labelId) {
    return labelMap[labelId];
}

// --- 内部ロジック ---

function startProjectListener(userId, currentFilter) {
    if (unsubscribeProjects) unsubscribeProjects();
    unsubscribeProjects = subscribeProjects(userId, (projects) => {
        projectList.innerHTML = '';
        projectMap = {};
        
        if (projects.length === 0) {
            projectList.innerHTML = '<li class="text-xs text-gray-400 px-3">リストがありません</li>';
        }

        projects.forEach(p => {
            projectMap[p.id] = p.name;
            const li = document.createElement('li');
            li.className = 'group flex items-center justify-between hover:bg-gray-100 rounded-lg pr-2';
            li.innerHTML = `
                <button class="project-item" data-id="${p.id}" data-type="project">
                    # ${p.name}
                </button>
                <button class="delete-project-btn hidden group-hover:block text-gray-400 hover:text-red-500" data-id="${p.id}">×</button>
            `;
            
            li.querySelector('.project-item').onclick = () => {
                updateSidebarSelection({ type: 'project', value: p.id });
                updateViewTitle({ type: 'project', value: p.id });
            };

            li.querySelector('.delete-project-btn').onclick = async () => {
                await deleteProject(userId, p.id);
            };

            projectList.appendChild(li);
        });
        updateSidebarSelection(currentFilter);
        updateViewTitle(currentFilter); 
    });
}

function startLabelListener(userId, currentFilter, onSelectView) {
    if (unsubscribeLabels) unsubscribeLabels();
    unsubscribeLabels = subscribeLabels(userId, (labels) => {
        labelList.innerHTML = '';
        labelMap = {};
        allLabels = labels; 
        
        if (labels.length === 0) {
            labelList.innerHTML = '<li class="text-xs text-gray-400 px-3">ラベルがありません</li>';
        }

        labels.forEach(l => {
            labelMap[l.id] = l;
            const li = document.createElement('li');
            li.className = 'group flex items-center justify-between hover:bg-gray-100 rounded-lg pr-2';
            
            const colorBox = `<span class="inline-block w-3 h-3 rounded-full mr-2" style="background-color: ${l.color}"></span>`;
            
            li.innerHTML = `
                <button class="label-item" data-id="${l.id}" data-type="label">
                    ${colorBox} ${l.name}
                </button>
                <button class="delete-label-btn hidden group-hover:block text-gray-400 hover:text-red-500" data-id="${l.id}">×</button>
            `;
            
            setupDropZone(li, l.id, userId);
            
            li.querySelector('.label-item').onclick = () => {
                updateSidebarSelection({ type: 'label', value: l.id });
                updateViewTitle({ type: 'label', value: l.id });
            };

            li.querySelector('.delete-label-btn').onclick = async () => {
                await deleteLabel(userId, l.id);
            };

            labelList.appendChild(li);
        });
        updateSidebarSelection(currentFilter);
        updateViewTitle(currentFilter);
    });
}

function setupDropZone(element, labelId, userId) {
    element.addEventListener('dragover', (e) => {
        e.preventDefault();
        element.classList.add('bg-blue-100', 'border', 'border-blue-300', 'border-dashed');
    });

    element.addEventListener('dragleave', () => {
        element.classList.remove('bg-blue-100', 'border', 'border-blue-300', 'border-dashed');
    });

    element.addEventListener('drop', async (e) => {
        e.preventDefault();
        element.classList.remove('bg-blue-100', 'border', 'border-blue-300', 'border-dashed');
        const taskId = e.dataTransfer.getData('text/plain');
        if (taskId) {
            await addLabelToTask(userId, taskId, labelId);
            alert("タグを追加しました！");
        }
    });
}