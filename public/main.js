// 更新日: 2025-11-25
import { loginWithEmail, logout, subscribeToAuthChanges, tryInitialAuth } from "./auth.js";
import { addTask, subscribeToTasks, toggleTaskStatus, deleteTask, updateTask } from "./store.js"; 
// 新しく作成したプロジェクト用ストアをインポート
import { addProject, subscribeToProjects, deleteProject } from "./project-store.js";

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

// プロジェクト関連UI
const projectList = document.getElementById('project-list');
const newProjectInput = document.getElementById('new-project-input');
const addProjectBtn = document.getElementById('add-project-btn');

// --- 状態変数 ---
let currentUserId = null;
let unsubscribeTasks = null;
let unsubscribeProjects = null;
let currentProjectId = 'all'; // 'all', 'inbox', or projectId
let projectMap = {}; // IDから名前を引くためのマップ

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

// --- 認証・初期化 ---

async function handleLogin() {
    const email = emailInput.value;
    const password = passwordInput.value;
    if (!email || !password) return;
    
    const result = await loginWithEmail(email, password);
    if (!result.success) {
        loginErrorMessage.textContent = result.message;
    } else {
        loginErrorMessage.textContent = '';
    }
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
        
        // プロジェクト一覧の監視開始
        startProjectListener(currentUserId);
        // タスク一覧の監視開始
        selectProject('all'); 
    } else {
        currentUserId = null;
        loginFormContainer.classList.remove('hidden');
        userInfoDiv.classList.add('hidden');
        
        if (unsubscribeTasks) unsubscribeTasks();
        if (unsubscribeProjects) unsubscribeProjects();
        
        renderTaskList([]);
        projectList.innerHTML = '';
    }
}

// --- プロジェクト機能 ---

function startProjectListener(userId) {
    if (unsubscribeProjects) unsubscribeProjects();
    
    unsubscribeProjects = subscribeToProjects(userId, (projects) => {
        projectList.innerHTML = '';
        projectMap = {}; // マップリセット

        if (projects.length === 0) {
            projectList.innerHTML = '<li class="text-xs text-gray-400 px-3">リストがありません</li>';
        }

        projects.forEach(p => {
            projectMap[p.id] = p.name;
            const li = document.createElement('li');
            li.className = 'group flex items-center justify-between hover:bg-gray-100 rounded-lg pr-2';
            
            // 選択中のスタイル適用
            const isActive = currentProjectId === p.id;
            const bgClass = isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600';

            li.innerHTML = `
                <button class="project-item w-full text-left px-3 py-2 text-sm transition-colors rounded-lg ${bgClass}" data-id="${p.id}">
                    # ${p.name}
                </button>
                <button class="delete-project-btn hidden group-hover:block text-gray-400 hover:text-red-500" data-id="${p.id}" title="削除">×</button>
            `;
            projectList.appendChild(li);
        });
    });
}

async function handleAddProject() {
    const name = newProjectInput.value;
    if (!name.trim()) return;
    
    const success = await addProject(currentUserId, name);
    if (success) {
        newProjectInput.value = '';
    }
}

// プロジェクト切り替え処理
function selectProject(projectId) {
    currentProjectId = projectId;

    // タイトルの更新
    if (projectId === 'all') currentViewTitle.textContent = 'すべてのタスク';
    else if (projectId === 'inbox') currentViewTitle.textContent = 'インボックス';
    else currentViewTitle.textContent = projectMap[projectId] || 'プロジェクト';

    // サイドバーの選択状態更新
    document.querySelectorAll('.project-item').forEach(btn => {
        if (btn.dataset.id === projectId) {
            btn.classList.add('bg-blue-50', 'text-blue-700', 'font-medium');
            btn.classList.remove('text-gray-600');
        } else {
            btn.classList.remove('bg-blue-50', 'text-blue-700', 'font-medium');
            btn.classList.add('text-gray-600');
        }
    });

    // タスクリスナー再接続（フィルタリング条件変更）
    const filterId = projectId === 'all' ? null : projectId;
    startTaskListener(currentUserId, filterId);
}

// --- タスク機能 ---

function startTaskListener(userId, filterProjectId) {
    if (unsubscribeTasks) unsubscribeTasks();

    unsubscribeTasks = subscribeToTasks(userId, (tasks) => {
        renderTaskList(tasks);
    }, filterProjectId);
}

async function handleAddTask() {
    const title = taskTitleInput.value;
    const dueDateValue = dueDateInput.value;
    
    if (!title.trim()) return;

    let dueDate = null;
    if (dueDateValue) dueDate = new Date(dueDateValue);

    // 現在選択中のプロジェクトIDを付与（'all'のときはinbox扱い=null）
    const targetProjectId = (currentProjectId === 'all' || currentProjectId === 'inbox') ? null : currentProjectId;

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
        
        // 所属プロジェクト名
        const projectName = task.projectId ? (projectMap[task.projectId] || '不明') : 'Inbox';
        const projectBadge = task.projectId 
            ? `<span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded mr-2"># ${projectName}</span>` 
            : '';

        let borderColor = isCompleted ? 'border-gray-300' : (overdue ? 'border-red-500' : 'border-blue-500');
        
        li.className = `p-4 border-l-4 ${borderColor} bg-white rounded-lg shadow flex justify-between items-start hover:shadow-lg transition ${isCompleted ? 'opacity-60' : ''}`;
        li.setAttribute('data-id', task.id);
        li.setAttribute('data-status', task.status);
        
        li.innerHTML = `
            <div class="flex items-start flex-grow space-x-3">
                <input type="checkbox" class="task-toggle mt-1.5 w-5 h-5 cursor-pointer text-blue-600" ${isCompleted ? 'checked' : ''}>
                
                <div class="flex-grow min-w-0">
                    <div class="flex items-center mb-1">
                        ${projectBadge}
                        <span class="task-title-span text-gray-800 text-lg ${isCompleted ? 'line-through text-gray-500' : ''} cursor-pointer hover:bg-yellow-50 px-1 rounded block truncate">
                            ${task.title}
                        </span>
                    </div>
                    
                    <div class="flex items-center space-x-3 text-sm text-gray-500">
                        ${task.dueDate ? `
                            <span class="flex items-center ${overdue && !isCompleted ? 'text-red-500 font-bold' : ''}">
                                📅 ${formatDate(task.dueDate)}
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>

            <div class="flex items-start space-x-2 ml-2">
                <input type="date" class="task-due-date-input p-1 border rounded text-xs w-6" value="${task.dueDate ? formatDate(task.dueDate) : ''}" title="期限日変更">
                <button class="task-delete-btn text-gray-300 hover:text-red-500 px-1">🗑️</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

function handleTaskAction(e) {
    if (!currentUserId) return;
    const target = e.target;
    const li = target.closest('li[data-id]');
    if (!li) return;
    
    const id = li.dataset.id;
    
    if (target.matches('.task-toggle')) {
        toggleTaskStatus(currentUserId, id, li.dataset.status);
    } else if (target.matches('.task-delete-btn')) {
        if (confirm('削除しますか？')) deleteTask(currentUserId, id);
    } else if (target.matches('.task-title-span') && e.type === 'dblclick') {
        const currentTitle = target.textContent.trim();
        startEditing(li, id, currentTitle);
    } else if (target.matches('.task-due-date-input')) {
        const date = target.value ? new Date(target.value) : '';
        updateTask(currentUserId, id, { dueDate: date });
    }
}

// 編集機能（前回と同じ）
function startEditing(li, id, oldTitle) {
    const span = li.querySelector('.task-title-span');
    if (!span) return;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = oldTitle;
    input.className = 'flex-grow p-1 border border-blue-500 rounded outline-none';
    
    span.style.display = 'none';
    span.parentElement.insertBefore(input, span);
    input.focus();
    
    const finish = async () => {
        const val = input.value.trim();
        if (val && val !== oldTitle) {
            await updateTask(currentUserId, id, { title: val });
        }
        input.remove();
        span.style.display = '';
    };
    
    input.addEventListener('blur', finish);
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') finish(); });
}


// --- 初期化 ---

document.addEventListener('DOMContentLoaded', () => {
    // Auth Events
    if (emailLoginBtn) emailLoginBtn.addEventListener('click', handleLogin);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    // Task Events
    if (addTaskBtn) addTaskBtn.addEventListener('click', handleAddTask);
    if (taskTitleInput) {
        taskTitleInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleAddTask();
        });
    }
    if (taskList) {
        taskList.addEventListener('click', handleTaskAction);
        taskList.addEventListener('dblclick', handleTaskAction);
    }

    // Project Events
    if (addProjectBtn) addProjectBtn.addEventListener('click', handleAddProject);
    
    // サイドバーのプロジェクト選択イベント（イベント委譲）
    document.querySelector('aside').addEventListener('click', (e) => {
        // プロジェクト選択
        const btn = e.target.closest('.project-item');
        if (btn) {
            selectProject(btn.dataset.id);
            return;
        }
        
        // プロジェクト削除
        const delBtn = e.target.closest('.delete-project-btn');
        if (delBtn) {
            if (confirm('プロジェクトを削除しますか？（タスクは削除されません）')) {
                deleteProject(currentUserId, delBtn.dataset.id);
            }
        }
    });

    subscribeToAuthChanges(updateAuthUI);
    tryInitialAuth();
});