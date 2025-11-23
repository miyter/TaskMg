// 更新日: 2025-11-25
import { loginWithEmail, logout, subscribeToAuthChanges, tryInitialAuth } from "./auth.js";
import { addTask, subscribeToTasks, toggleTaskStatus, deleteTask, updateTask, addLabelToTask, removeLabelFromTask } from "./store.js"; // ★追加: ラベル操作関数
import { addProject, subscribeToProjects, deleteProject } from "./project-store.js";
import { addLabel, subscribeToLabels, deleteLabel } from "./label-store.js"; // ★追加: ラベルストア

// --- UI要素 ---
const loginFormContainer = document.getElementById('login-form-container');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const emailLoginBtn = document.getElementById('email-login-btn');
const loginErrorMessage = document.getElementById('login-error-message');
const userInfoDiv = document.getElementById('user-info');
const userDisplayNameSpan = document.getElementById('user-display-name');
const logoutBtn = document.getElementById('logout-btn');

const taskList = document.getElementById('task-list');
const taskTitleInput = document.getElementById('task-title-input');
const dueDateInput = document.getElementById('due-date-input');
const addTaskBtn = document.getElementById('add-task-btn');
const currentViewTitle = document.getElementById('current-view-title');

const projectList = document.getElementById('project-list');
const newProjectInput = document.getElementById('new-project-input');
const addProjectBtn = document.getElementById('add-project-btn');

// ラベル関連UI
const labelList = document.getElementById('label-list');
const newLabelInput = document.getElementById('new-label-input');
const addLabelBtn = document.getElementById('add-label-btn');

// --- 状態変数 ---
let currentUserId = null;
let unsubscribeTasks = null;
let unsubscribeProjects = null;
let unsubscribeLabels = null;

let currentFilter = { type: 'project', value: 'all' }; // 現在のフィルタリング状態
let projectMap = {}; 
let labelMap = {}; // IDからラベル詳細を引くマップ

// --- ユーティリティ ---
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

// --- 認証 ---
async function handleLogin() {
    const email = emailInput.value;
    const password = passwordInput.value;
    if (!email || !password) return;
    const result = await loginWithEmail(email, password);
    if (!result.success) loginErrorMessage.textContent = result.message;
    else loginErrorMessage.textContent = '';
}

async function handleLogout() {
    await logout();
    if (emailInput) emailInput.value = '';
    if (passwordInput) passwordInput.value = '';
}

function updateAuthUI(user) {
    if (user) {
        currentUserId = user.uid;
        const displayName = user.email || "ユーザー";
        loginFormContainer.classList.add('hidden');
        userInfoDiv.classList.remove('hidden');
        userDisplayNameSpan.textContent = displayName;
        
        startProjectListener(currentUserId);
        startLabelListener(currentUserId); // ★追加: ラベル監視
        selectView({ type: 'project', value: 'all' });
    } else {
        currentUserId = null;
        loginFormContainer.classList.remove('hidden');
        userInfoDiv.classList.add('hidden');
        if (unsubscribeTasks) unsubscribeTasks();
        if (unsubscribeProjects) unsubscribeProjects();
        if (unsubscribeLabels) unsubscribeLabels();
        renderTaskList([]);
        projectList.innerHTML = '';
        labelList.innerHTML = '';
    }
}

// --- サイドバー管理 (プロジェクト & ラベル) ---

function startProjectListener(userId) {
    if (unsubscribeProjects) unsubscribeProjects();
    unsubscribeProjects = subscribeToProjects(userId, (projects) => {
        projectList.innerHTML = '';
        projectMap = {};
        if (projects.length === 0) projectList.innerHTML = '<li class="text-xs text-gray-400 px-3">リストがありません</li>';
        
        projects.forEach(p => {
            projectMap[p.id] = p.name;
            const li = document.createElement('li');
            li.className = 'group flex items-center justify-between hover:bg-gray-100 rounded-lg pr-2';
            li.innerHTML = `
                <button class="project-item w-full text-left px-3 py-2 text-sm transition-colors rounded-lg text-gray-600" data-id="${p.id}" data-type="project">
                    # ${p.name}
                </button>
                <button class="delete-project-btn hidden group-hover:block text-gray-400 hover:text-red-500" data-id="${p.id}">×</button>
            `;
            projectList.appendChild(li);
        });
        updateSidebarSelection(); // 選択状態の再適用
    });
}

function startLabelListener(userId) {
    if (unsubscribeLabels) unsubscribeLabels();
    unsubscribeLabels = subscribeToLabels(userId, (labels) => {
        labelList.innerHTML = '';
        labelMap = {};
        if (labels.length === 0) labelList.innerHTML = '<li class="text-xs text-gray-400 px-3">ラベルがありません</li>';

        labels.forEach(l => {
            labelMap[l.id] = l;
            const li = document.createElement('li');
            li.className = 'group flex items-center justify-between hover:bg-gray-100 rounded-lg pr-2 drop-zone'; // drop-zoneクラス追加
            li.dataset.labelId = l.id; // DnD用

            // カラーバッジ
            const colorBox = `<span class="inline-block w-3 h-3 rounded-full mr-2" style="background-color: ${l.color}"></span>`;

            li.innerHTML = `
                <button class="label-item w-full text-left px-3 py-2 text-sm transition-colors rounded-lg text-gray-600 flex items-center" data-id="${l.id}" data-type="label">
                    ${colorBox} ${l.name}
                </button>
                <button class="delete-label-btn hidden group-hover:block text-gray-400 hover:text-red-500" data-id="${l.id}">×</button>
            `;
            
            // ★ドラッグ&ドロップイベントの設定
            setupDropZone(li, l.id);

            labelList.appendChild(li);
        });
        updateSidebarSelection();
    });
}

// ドロップゾーン（ラベル）の設定
function setupDropZone(element, labelId) {
    element.addEventListener('dragover', (e) => {
        e.preventDefault(); // ドロップを許可
        element.classList.add('drop-target');
    });

    element.addEventListener('dragleave', () => {
        element.classList.remove('drop-target');
    });

    element.addEventListener('drop', async (e) => {
        e.preventDefault();
        element.classList.remove('drop-target');
        const taskId = e.dataTransfer.getData('text/plain');
        if (taskId) {
            await addLabelToTask(currentUserId, taskId, labelId);
        }
    });
}

async function handleAddProject() {
    const name = newProjectInput.value;
    if (name.trim()) await addProject(currentUserId, name);
    newProjectInput.value = '';
}

async function handleAddLabel() {
    const name = newLabelInput.value;
    if (name.trim()) await addLabel(currentUserId, name);
    newLabelInput.value = '';
}

// ビュー切り替え（プロジェクト or ラベル）
function selectView(filter) {
    currentFilter = filter;

    // タイトル更新
    if (filter.type === 'project') {
        if (filter.value === 'all') currentViewTitle.textContent = '📁 すべてのタスク';
        else if (filter.value === 'inbox') currentViewTitle.textContent = '📥 インボックス';
        else currentViewTitle.textContent = `# ${projectMap[filter.value] || 'プロジェクト'}`;
    } else if (filter.type === 'label') {
        const label = labelMap[filter.value];
        currentViewTitle.innerHTML = label ? 
            `<span class="inline-block w-4 h-4 rounded-full mr-2" style="background-color: ${label.color}"></span> ${label.name}` : 'ラベル';
    }

    updateSidebarSelection();
    startTaskListener(currentUserId, filter);
}

function updateSidebarSelection() {
    // 全てのサイドバーボタンの選択状態をリセット
    document.querySelectorAll('.project-item, .label-item').forEach(btn => {
        const isActive = btn.dataset.type === currentFilter.type && btn.dataset.id === currentFilter.value;
        if (isActive) {
            btn.classList.add('bg-blue-50', 'text-blue-700', 'font-medium');
            btn.classList.remove('text-gray-600');
        } else {
            btn.classList.remove('bg-blue-50', 'text-blue-700', 'font-medium');
            btn.classList.add('text-gray-600');
        }
    });
}

// --- タスク機能 ---

function startTaskListener(userId, filterCondition) {
    if (unsubscribeTasks) unsubscribeTasks();
    unsubscribeTasks = subscribeToTasks(userId, (tasks) => {
        renderTaskList(tasks);
    }, filterCondition);
}

async function handleAddTask() {
    const title = taskTitleInput.value;
    const dueDateValue = dueDateInput.value;
    if (!title.trim()) return;

    let dueDate = null;
    if (dueDateValue) dueDate = new Date(dueDateValue);

    // プロジェクト表示中ならそのプロジェクトに追加（ラベル表示中はInboxへ）
    const targetProjectId = (currentFilter.type === 'project' && currentFilter.value !== 'all' && currentFilter.value !== 'inbox') 
        ? currentFilter.value : null;

    const success = await addTask(currentUserId, title, dueDate, targetProjectId);
    if (success) {
        taskTitleInput.value = '';
        dueDateInput.value = '';
    }
}

function renderTaskList(tasks) {
    taskList.innerHTML = '';
    if (tasks.length === 0) {
        taskList.innerHTML = '<li class="p-8 text-center text-gray-400 italic">タスクがありません</li>';
        return;
    }

    tasks.forEach(task => {
        const isCompleted = task.status === 'completed';
        const overdue = isOverdue(task.dueDate);
        const li = document.createElement('li');
        
        // ドラッグ可能にする
        li.draggable = true;
        li.dataset.id = task.id;
        li.dataset.status = task.status;
        
        // プロジェクト名
        const projectName = task.projectId ? (projectMap[task.projectId] || '') : '';
        const projectBadge = projectName ? `<span class="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">#${projectName}</span>` : '';

        // ラベルバッジ生成
        let labelBadges = '';
        if (task.labelIds && task.labelIds.length > 0) {
            task.labelIds.forEach(lblId => {
                const lbl = labelMap[lblId];
                if (lbl) {
                    // ラベルクリックで削除できるようにdata属性付与
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
            <div class="flex items-start flex-grow space-x-3 pointer-events-none"> <!-- inner content ignores drag events -->
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

function handleTaskAction(e) {
    if (!currentUserId) return;
    const target = e.target;
    
    // ラベル削除（バッジクリック）
    const labelBadge = target.closest('.task-label-badge');
    if (labelBadge) {
        e.stopPropagation();
        if (confirm('このタグを外しますか？')) {
            removeLabelFromTask(currentUserId, labelBadge.dataset.taskId, labelBadge.dataset.labelId);
        }
        return;
    }

    const li = target.closest('li[data-id]');
    if (!li) return;
    const id = li.dataset.id;
    
    if (target.matches('.task-toggle')) {
        toggleTaskStatus(currentUserId, id, li.dataset.status);
    } else if (target.matches('.task-delete-btn')) {
        if (confirm('削除しますか？')) deleteTask(currentUserId, id);
    } else if (target.matches('.task-title-span') && e.type === 'dblclick') {
        startEditing(li, id, target.textContent.trim());
    } else if (target.matches('.task-due-date-input')) {
        const date = target.value ? new Date(target.value) : '';
        updateTask(currentUserId, id, { dueDate: date });
    }
}

// 編集機能
function startEditing(li, id, oldTitle) {
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
        if (val && val !== oldTitle) await updateTask(currentUserId, id, { title: val });
        input.remove();
        span.style.display = '';
    };
    input.addEventListener('blur', finish);
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') finish(); });
}

// --- 初期化 ---
document.addEventListener('DOMContentLoaded', () => {
    // Auth
    if (emailLoginBtn) emailLoginBtn.addEventListener('click', handleLogin);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    // Sidebar
    document.querySelector('aside').addEventListener('click', (e) => {
        // プロジェクト/ラベル選択
        const btn = e.target.closest('button[data-type]');
        if (btn) return selectView({ type: btn.dataset.type, value: btn.dataset.id });
        
        // 削除
        if (e.target.matches('.delete-project-btn')) {
            if (confirm('リストを削除しますか？')) deleteProject(currentUserId, e.target.dataset.id);
        } else if (e.target.matches('.delete-label-btn')) {
            if (confirm('ラベルを削除しますか？')) deleteLabel(currentUserId, e.target.dataset.id);
        }
    });

    // Forms
    if (addTaskBtn) addTaskBtn.addEventListener('click', handleAddTask);
    if (taskTitleInput) taskTitleInput.addEventListener('keypress', e => { if(e.key==='Enter') handleAddTask() });
    
    if (addProjectBtn) addProjectBtn.addEventListener('click', handleAddProject);
    if (addLabelBtn) addLabelBtn.addEventListener('click', handleAddLabel); // ★

    if (taskList) {
        taskList.addEventListener('click', handleTaskAction);
        taskList.addEventListener('dblclick', handleTaskAction);
    }

    subscribeToAuthChanges(updateAuthUI);
    tryInitialAuth();
});