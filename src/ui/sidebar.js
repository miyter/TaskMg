import { updateTask } from '../store/store.js';
import { addProject, deleteProject } from '../store/projects.js';
import { addLabel, deleteLabel } from '../store/labels.js';
import { showMessageModal } from './components.js';

// ラベル詳細検索用のマップ
let labelMap = {};

/**
 * 指定されたIDのラベル情報を返すヘルパー関数
 */
export function getLabelDetails(labelId) {
    return labelMap[labelId];
}

/**
 * プロジェクト名を取得するヘルパー関数
 * (dashboard.js などから参照されます)
 * @param {string} projectId 
 * @param {Array} allProjects 
 */
export function getProjectName(projectId, allProjects = []) {
    // インボックスの判定
    if (!projectId || projectId === 'inbox' || projectId === 'INBOX') {
        return 'インボックス';
    }
    
    // プロジェクトリストがない場合
    if (!allProjects || !Array.isArray(allProjects)) {
        return '未分類';
    }

    // IDで検索
    const project = allProjects.find(p => p.id === projectId);
    return project ? project.name : '未分類';
}

/**
 * サイドバーの初期構造を描画する
 */
export function renderSidebar() {
    const container = document.getElementById('sidebar-content');
    if (!container) return;

    container.innerHTML = `
        <nav class="space-y-1">
            <!-- ダッシュボード -->
            <a href="#" id="nav-dashboard" class="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                ダッシュボード
            </a>

            <!-- インボックス -->
            <a href="#" id="nav-inbox" class="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                <span class="flex-1">インボックス</span>
                <span id="inbox-count" class="hidden bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs font-semibold">0</span>
            </a>
        </nav>

        <div class="mt-8">
            <!-- プロジェクトヘッダー -->
            <div class="flex items-center justify-between px-3 mb-2 group">
                <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">プロジェクト</h3>
                <button id="add-project-btn" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" title="プロジェクトを追加">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                </button>
            </div>
            <!-- プロジェクトリスト -->
            <ul id="project-list" class="space-y-0.5 mb-6"></ul>

            <!-- ラベルヘッダー -->
            <div class="flex items-center justify-between px-3 mb-2 group">
                <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ラベル</h3>
                <button id="add-label-btn" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" title="ラベルを追加">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                </button>
            </div>
            <!-- ラベルリスト -->
            <ul id="label-list" class="space-y-0.5"></ul>
        </div>
    `;

    setupSidebarEvents();
}

/**
 * app.js互換用: 初期化関数
 */
export function initSidebar() {
    renderSidebar();
}

/**
 * 静的要素のイベント設定
 */
function setupSidebarEvents() {
    const dispatchRoute = (page, id = null) => {
        document.dispatchEvent(new CustomEvent('route-change', { 
            detail: { page, id } 
        }));
    };

    document.getElementById('nav-dashboard')?.addEventListener('click', (e) => {
        e.preventDefault();
        dispatchRoute('dashboard');
    });

    document.getElementById('nav-inbox')?.addEventListener('click', (e) => {
        e.preventDefault();
        dispatchRoute('inbox');
    });

    document.getElementById('add-project-btn')?.addEventListener('click', async () => {
        const name = prompt("新しいプロジェクト名:");
        if (name && name.trim()) await addProject(name.trim());
    });

    document.getElementById('add-label-btn')?.addEventListener('click', async () => {
        const name = prompt("新しいラベル名:");
        if (name && name.trim()) await addLabel(name.trim());
    });
}

/**
 * プロジェクト一覧の描画 (タスク件数付き)
 */
export function renderProjects(projects, tasks = []) {
    const list = document.getElementById('project-list');
    if (!list) return;
    list.innerHTML = '';

    projects.forEach(proj => {
        const count = tasks ? tasks.filter(t => t.projectId === proj.id && t.status !== 'completed').length : 0;
        const countDisplay = count > 0 ? count : '';

        const li = document.createElement('li');
        li.className = 'group flex items-center justify-between px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer transition-colors';
        li.innerHTML = `
            <div class="flex items-center flex-1 min-w-0">
                <span class="text-gray-400 mr-2">#</span>
                <span class="truncate">${proj.name}</span>
            </div>
            <div class="flex items-center">
                <span class="text-xs text-gray-400 font-light mr-2">${countDisplay}</span>
                <button class="delete-proj-btn text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1" data-id="${proj.id}">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>
        `;

        li.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('route-change', { 
                detail: { page: 'project', id: proj.id } 
            }));
        });

        li.querySelector('.delete-proj-btn').addEventListener('click', async (e) => {
            e.stopPropagation();
            showMessageModal(`プロジェクト「${proj.name}」を削除しますか？`, async () => {
                await deleteProject(proj.id);
            });
        });

        list.appendChild(li);
    });
}

/**
 * ラベル一覧の描画 (タスク件数・DnD対応・マップ更新)
 */
export function renderLabels(labels, tasks = []) {
    const list = document.getElementById('label-list');
    if (!list) return;
    list.innerHTML = '';

    // ラベルマップを更新 (詳細取得用)
    labelMap = {};
    labels.forEach(l => {
        labelMap[l.id] = l;
    });

    labels.forEach(label => {
        const count = tasks ? tasks.filter(t => t.labelIds && t.labelIds.includes(label.id) && t.status !== 'completed').length : 0;
        const countDisplay = count > 0 ? count : '';
        const colorStyle = label.color ? `background-color: ${label.color};` : 'background-color: #a0aec0;';

        const li = document.createElement('li');
        li.className = 'group flex items-center justify-between px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer transition-colors';
        li.innerHTML = `
            <div class="flex items-center flex-1 min-w-0">
                <span class="w-2.5 h-2.5 rounded-full mr-2.5 flex-shrink-0" style="${colorStyle}"></span>
                <span class="truncate">${label.name}</span>
            </div>
            <div class="flex items-center">
                <span class="text-xs text-gray-400 font-light mr-2">${countDisplay}</span>
                <button class="delete-label-btn text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1" data-id="${label.id}">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>
        `;

        li.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('route-change', { 
                detail: { page: 'label', id: label.id } 
            }));
        });

        li.querySelector('.delete-label-btn').addEventListener('click', async (e) => {
            e.stopPropagation();
            showMessageModal(`ラベル「${label.name}」を削除しますか？`, async () => {
                await deleteLabel(label.id);
            });
        });

        setupDropZone(li, label.id);
        list.appendChild(li);
    });
}

/**
 * ドラッグ&ドロップの受け入れ設定
 */
function setupDropZone(element, labelId) {
    element.addEventListener('dragover', (e) => {
        e.preventDefault();
        element.classList.add('bg-blue-100', 'dark:bg-blue-900', 'border', 'border-blue-300', 'dark:border-blue-500', 'border-dashed');
    });
    
    element.addEventListener('dragleave', () => {
        element.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'border', 'border-blue-300', 'dark:border-blue-500', 'border-dashed');
    });
    
    element.addEventListener('drop', async (e) => {
        e.preventDefault();
        element.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'border', 'border-blue-300', 'dark:border-blue-500', 'border-dashed');
        
        const taskId = e.dataTransfer.getData('text/plain');
        if (taskId) {
            console.log(`Task ${taskId} dropped on Label ${labelId}`);
            // DnDによるラベル付与処理 (必要に応じて有効化)
            // await updateTask(taskId, { labelIds: [labelId] }); 
        }
    });
}

/**
 * インボックスの件数更新
 */
export function updateInboxCount(tasks) {
    const countEl = document.getElementById('inbox-count');
    if (!countEl) return;

    const count = tasks ? tasks.filter(t => !t.projectId && t.status !== 'completed').length : 0;
    
    countEl.textContent = count;
    if (count > 0) {
        countEl.classList.remove('hidden');
    } else {
        countEl.classList.add('hidden');
    }
}