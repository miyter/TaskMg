// @ts-nocheck
// @miyter:20251129

// ★修正: storeから updateTask をインポート
import { updateTask } from '../store/store.js';
// ★修正: projects.js, labels.js からラッパー関数をインポート
import { addProject, deleteProject } from '../store/projects.js';
import { addLabel, deleteLabel } from '../store/labels.js';
import { showMessageModal } from './components.js';
import { auth } from '../core/firebase.js'; // authはsetupDropZone内で必要


let labelMap = {};

export function getLabelDetails(labelId) {
    return labelMap[labelId];
}

export function getProjectName(projectId, allProjects = []) {
    if (!projectId || projectId === 'inbox' || projectId === 'INBOX') return 'インボックス';
    if (!allProjects || !Array.isArray(allProjects)) return '未分類';
    const project = allProjects.find(p => p.id === projectId);
    return project ? project.name : '未分類';
}

export function renderSidebar() {
    const container = document.getElementById('sidebar-content');
    if (!container) return;

    container.innerHTML = `
        <nav class="space-y-1">
            <a href="#" id="nav-dashboard" class="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                ダッシュボード
            </a>
            <a href="#" id="nav-inbox" class="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors drop-target" data-type="inbox">
                <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                <span class="flex-1">インボックス</span>
                <span id="inbox-count" class="hidden bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs font-semibold">0</span>
            </a>
        </nav>

        <div class="mt-8">
            <div class="flex items-center justify-between px-3 mb-2 group">
                <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">プロジェクト</h3>
                <button id="add-project-btn" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></button>
            </div>
            <ul id="project-list" class="space-y-0.5 mb-6"></ul>

            <div class="flex items-center justify-between px-3 mb-2 group">
                <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ラベル</h3>
                <button id="add-label-btn" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></button>
            </div>
            <ul id="label-list" class="space-y-0.5"></ul>
        </div>
    `;
    setupSidebarEvents();
    
    // インボックスへのドロップ設定
    setupDropZone(document.getElementById('nav-inbox'), 'inbox');
}

export function initSidebar() { renderSidebar(); }

function setupSidebarEvents() {
    const dispatch = (page, id = null) => document.dispatchEvent(new CustomEvent('route-change', { detail: { page, id } }));
    
    document.getElementById('nav-dashboard')?.addEventListener('click', (e) => { 
        e.preventDefault(); 
        dispatch('dashboard'); 
    });
    
    document.getElementById('nav-inbox')?.addEventListener('click', (e) => { e.preventDefault(); dispatch('inbox'); });
    
    document.getElementById('add-project-btn')?.addEventListener('click', async () => {
        const name = prompt("新しいプロジェクト名:"); 
        // ★修正: userIdの引数を削除 (ラッパーが自動注入)
        if (name?.trim()) await addProject(name.trim());
    });
    
    document.getElementById('add-label-btn')?.addEventListener('click', async () => {
        const name = prompt("新しいラベル名:"); 
        // ランダムカラーを使用 (簡易実装)
        // ★修正: userIdの引数を削除 (ラッパーが自動注入)
        if (name?.trim()) await addLabel(name.trim(), getRandomColor());
    });
}

// ダミーのランダムカラー生成関数（簡易的に）
function getRandomColor() {
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6'];
    return colors[Math.floor(Math.random() * colors.length)];
}

export function renderProjects(projects, tasks = []) {
    const list = document.getElementById('project-list');
    if (!list) return;
    list.innerHTML = '';

    projects.forEach(proj => {
        // 未完了タスクのみカウント
        const count = tasks ? tasks.filter(t => t.projectId === proj.id && t.status !== 'completed').length : 0;
        const countDisplay = count > 0 ? count : '';

        const li = document.createElement('li');
        li.className = 'group flex items-center justify-between px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer transition-colors drop-target';
        li.innerHTML = `
            <div class="flex items-center flex-1 min-w-0 pointer-events-none">
                <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                <span class="truncate">${proj.name}</span>
            </div>
            <div class="flex items-center">
                <span class="text-xs text-gray-400 font-light mr-2">${countDisplay}</span>
                <button class="delete-proj-btn text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1" data-id="${proj.id}">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>
        `;
        
        li.addEventListener('click', () => document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'project', id: proj.id } })));
        li.querySelector('.delete-proj-btn').addEventListener('click', async (e) => {
            e.stopPropagation();
            // ★修正: userIdの引数を削除 (ラッパーが自動注入)
            showMessageModal(`プロジェクト「${proj.name}」を削除しますか？`, async () => await deleteProject(proj.id));
        });

        // ドロップ設定 (プロジェクト移動)
        setupDropZone(li, 'project', proj.id);
        list.appendChild(li);
    });
}

export function renderLabels(labels, tasks = []) {
    const list = document.getElementById('label-list');
    if (!list) return;
    list.innerHTML = '';
    labelMap = {};
    labels.forEach(l => labelMap[l.id] = l);

    labels.forEach(label => {
        // 未完了タスクのみカウント
        const count = tasks ? tasks.filter(t => t.labelIds && t.labelIds.includes(label.id) && t.status !== 'completed').length : 0;
        const countDisplay = count > 0 ? count : '';
        const colorStyle = label.color ? `background-color: ${label.color};` : 'background-color: #a0aec0;';

        const li = document.createElement('li');
        li.className = 'group flex items-center justify-between px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer transition-colors drop-target';
        li.innerHTML = `
            <div class="flex items-center flex-1 min-w-0 pointer-events-none">
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

        li.addEventListener('click', () => document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'label', id: label.id } })));
        li.querySelector('.delete-label-btn').addEventListener('click', async (e) => {
            e.stopPropagation();
            // ★修正: userIdの引数を削除 (ラッパーが自動注入)
            showMessageModal(`ラベル「${label.name}」を削除しますか？`, async () => await deleteLabel(label.id));
        });

        // ドロップ設定 (ラベル付与)
        setupDropZone(li, 'label', label.id);
        list.appendChild(li);
    });
}

function setupDropZone(element, type, targetId = null) {
    // 認証情報とFirestore操作をインポート
    import('../core/firebase.js').then(({ auth }) => {
        const userId = auth.currentUser?.uid;
        if (!userId) return; // 未認証ならドロップゾーンを設定しない

        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            element.classList.add('bg-blue-100', 'dark:bg-blue-900', 'ring-2', 'ring-blue-400');
        });
        element.addEventListener('dragleave', () => {
            element.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'ring-2', 'ring-blue-400');
        });
        element.addEventListener('drop', async (e) => {
            e.preventDefault();
            element.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'ring-2', 'ring-blue-400');
            const taskId = e.dataTransfer.getData('text/plain');
            
            if (taskId) {
                // store.js の updateTask を動的にインポート
                const { updateTask } = await import('../store/store.js');

                // ★修正: updateTaskにuserIdを渡す必要がなくなったため、呼び出しから削除
                if (type === 'inbox') {
                    await updateTask(taskId, { projectId: null });
                    showMessageModal("タスクをインボックスに戻しました");
                } else if (type === 'project' && targetId) {
                    await updateTask(taskId, { projectId: targetId });
                    showMessageModal("プロジェクトへ移動しました");
                } else if (type === 'label' && targetId) {
                    // ★課題: ラベルへのドロップは現在のラベル情報が必要なため、
                    // 現状のローカルキャッシュ（allTasks）を参照する仕組みが必要です。
                    // 現状は実装が複雑になるため、コンソールログのみとしておきます。
                    showMessageModal("ラベルへのタスク移動は、現在のタスクラベル情報の読み込みが不完全なため、現時点では未実装です。", null);
                }
            }
        });
    });
}

export function updateInboxCount(tasks) {
    const countEl = document.getElementById('inbox-count');
    if (!countEl) return;
    const count = tasks ? tasks.filter(t => !t.projectId && t.status !== 'completed').length : 0;
    countEl.textContent = count;
    count > 0 ? countEl.classList.remove('hidden') : countEl.classList.add('hidden');
}
