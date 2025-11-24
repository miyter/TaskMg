// 更新日: 2025-11-25
// 役割: アプリケーションのエントリーポイント（初期化とモジュール連携）

import { loginWithEmail, logout, subscribeToAuthChanges, tryInitialAuth } from "./auth.js";
import { addTask, subscribeToTasks, toggleTaskStatus, deleteTask, updateTask } from "./store.js";
import { addProject, deleteProject } from "./project-store.js";
import { addLabel, deleteLabel } from "./label-store.js";

import * as AuthUI from "./ui-auth.js";
import * as SidebarUI from "./ui-sidebar.js";
import * as TaskUI from "./ui-task.js";

// --- 状態変数 ---
let currentUserId = null;
let currentFilter = { type: 'project', value: 'all' };
let unsubscribeTasks = null;
let showCompletedTasks = true; 
let currentSortCriteria = 'createdAt_desc'; // ★追加: ソート状態

// --- UI要素 ---
const emailLoginBtn = document.getElementById('email-login-btn');
const logoutBtn = document.getElementById('logout-btn');
const addTaskBtn = document.getElementById('add-task-btn');
const taskTitleInput = document.getElementById('task-title-input');
const dueDateInput = document.getElementById('due-date-input');
const addProjectBtn = document.getElementById('add-project-btn');
const newProjectInput = document.getElementById('new-project-input');
const addLabelBtn = document.getElementById('add-label-btn');
const newLabelInput = document.getElementById('new-label-input');
const toggleCompletedBtn = document.getElementById('toggle-completed-btn');
const sortSelect = document.getElementById('sort-select'); // ★追加

// --- 認証 ---

async function handleLogin() {
    const { email, password } = AuthUI.getAuthInputValues();
    if (!email || !password) return;
    
    AuthUI.showLoginError('ログイン中...');
    const result = await loginWithEmail(email, password);
    
    if (!result.success) {
        AuthUI.showLoginError(result.message);
    } else {
        AuthUI.clearLoginError();
    }
}

async function handleLogout() {
    await logout();
    AuthUI.clearAuthInputs();
    SidebarUI.cleanupSidebar();
}

function onAuthStateChanged(user) {
    AuthUI.updateAuthUI(user);
    
    if (user) {
        currentUserId = user.uid;
        SidebarUI.initSidebar(currentUserId, currentFilter);
        startTaskListener(currentUserId, currentFilter);
    } else {
        currentUserId = null;
        if (unsubscribeTasks) unsubscribeTasks();
        TaskUI.renderTaskList([], null);
    }
}

// --- ビュー切り替え ---

function selectView(filter) {
    currentFilter = filter;
    SidebarUI.updateSidebarSelection(currentFilter);
    SidebarUI.updateViewTitle(currentFilter);
    startTaskListener(currentUserId, currentFilter);
}

// --- タスク ---

function startTaskListener(userId, filter) {
    if (unsubscribeTasks) unsubscribeTasks();
    unsubscribeTasks = subscribeToTasks(userId, (tasks) => {
        // ★更新: ソート引数を渡す
        TaskUI.renderTaskList(tasks, userId, showCompletedTasks, currentSortCriteria);
    }, filter);
}

async function handleAddTask() {
    const title = taskTitleInput.value;
    const dueDateValue = dueDateInput.value;
    if (!title.trim()) return;

    let dueDate = null;
    if (dueDateValue) dueDate = new Date(dueDateValue);

    const targetProjectId = (currentFilter.type === 'project' && currentFilter.value !== 'all' && currentFilter.value !== 'inbox') 
        ? currentFilter.value : null;

    const success = await addTask(currentUserId, title, dueDate, targetProjectId);
    if (success) {
        taskTitleInput.value = '';
        dueDateInput.value = '';
    }
}

// アクション委譲
async function handleTaskAction(e) {
    if (!currentUserId) return;
    
    if (await TaskUI.handleTaskClickEvents(e, currentUserId)) return;

    const target = e.target;
    const li = target.closest('li[data-id]');
    if (!li) return;
    
    const id = li.dataset.id;

    if (target.matches('.task-toggle')) {
        toggleTaskStatus(currentUserId, id, li.dataset.status);
    } else if (target.matches('.task-delete-btn')) {
        if (confirm('削除しますか？')) deleteTask(currentUserId, id);
    } else if (target.matches('.task-title-span') && e.type === 'dblclick') {
        TaskUI.startEditing(li, id, target.textContent.trim(), currentUserId);
    } else if (target.matches('.task-due-date-input')) {
        const date = target.value ? new Date(target.value) : '';
        updateTask(currentUserId, id, { dueDate: date });
    }
}

// --- 初期化 ---

document.addEventListener('DOMContentLoaded', () => {
    if (emailLoginBtn) emailLoginBtn.addEventListener('click', handleLogin);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    document.querySelector('aside').addEventListener('click', async (e) => {
        const btn = e.target.closest('button[data-type]');
        if (btn) return selectView({ type: btn.dataset.type, value: btn.dataset.id });
        
        if (e.target.matches('.delete-project-btn')) {
            if (confirm('リストを削除しますか？')) deleteProject(currentUserId, e.target.dataset.id);
        } else if (e.target.matches('.delete-label-btn')) {
            if (confirm('ラベルを削除しますか？')) deleteLabel(currentUserId, e.target.dataset.id);
        }
    });

    if (addTaskBtn) addTaskBtn.addEventListener('click', handleAddTask);
    if (taskTitleInput) taskTitleInput.addEventListener('keypress', e => { if(e.key==='Enter') handleAddTask() });
    
    if (addProjectBtn) addProjectBtn.addEventListener('click', async () => {
        const name = newProjectInput.value;
        if (name.trim()) await addProject(currentUserId, name);
        newProjectInput.value = '';
    });
    
    if (addLabelBtn) addLabelBtn.addEventListener('click', async () => {
        const name = newLabelInput.value;
        if (name.trim()) await addLabel(currentUserId, name);
        newLabelInput.value = '';
    });

    const taskList = document.getElementById('task-list');
    if (taskList) {
        taskList.addEventListener('click', handleTaskAction);
        taskList.addEventListener('dblclick', handleTaskAction);
    }

    if (toggleCompletedBtn) {
        toggleCompletedBtn.addEventListener('change', (e) => {
            showCompletedTasks = e.target.checked;
            startTaskListener(currentUserId, currentFilter);
        });
    }

    // ★追加: ソート変更イベント
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSortCriteria = e.target.value;
            startTaskListener(currentUserId, currentFilter);
        });
    }

    subscribeToAuthChanges(onAuthStateChanged);
    tryInitialAuth();
});