// 更新日: 2025-11-24
// 役割: UI操作と各モジュール（auth, store）の連携を行います。

import { loginWithEmail, logout, subscribeToAuthChanges, tryInitialAuth } from "./auth.js";
import { addTask, subscribeToTasks } from "./store.js";

// --- UI要素の参照 ---
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
const addTaskBtn = document.getElementById('add-task-btn');

// --- 状態変数 ---
let currentUserId = null;
let unsubscribeTasks = null; // タスク監視の解除用関数

// --- イベントハンドラ ---

// ログインボタンクリック時
async function handleLogin() {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        loginErrorMessage.textContent = 'メールアドレスとパスワードを入力してください。';
        return;
    }
    
    loginErrorMessage.textContent = 'ログイン中...';
    
    const result = await loginWithEmail(email, password);
    
    if (!result.success) {
        loginErrorMessage.textContent = result.message;
    } else {
        loginErrorMessage.textContent = ''; // 成功時はクリア
        // 画面切り替えは onAuthStateChanged で自動的に行われます
    }
}

// ログアウトボタンクリック時
async function handleLogout() {
    await logout();
    // フォームのクリア
    if (emailInput) emailInput.value = '';
    if (passwordInput) passwordInput.value = '';
}

// タスク追加ボタンクリック時
async function handleAddTask() {
    const title = taskTitleInput.value;
    if (!title.trim()) return;

    const success = await addTask(currentUserId, title);
    if (success) {
        taskTitleInput.value = ''; // 入力欄クリア
    }
}

// --- UI更新ロジック ---

function updateAuthUI(user) {
    if (user) {
        // ログイン時
        currentUserId = user.uid;
        const displayName = user.email || "ユーザー";
        
        loginFormContainer.classList.add('hidden');
        userInfoDiv.classList.remove('hidden');
        userDisplayNameSpan.textContent = `ようこそ、${displayName} さん`;
        
        // タスク一覧の監視を開始
        startTaskListener(currentUserId);
    } else {
        // ログアウト時
        currentUserId = null;
        
        loginFormContainer.classList.remove('hidden');
        userInfoDiv.classList.add('hidden');
        
        // タスク監視を停止
        if (unsubscribeTasks) {
            unsubscribeTasks();
            unsubscribeTasks = null;
        }
        
        // タスクリストをクリア
        renderTaskList([]);
        taskList.innerHTML = '<li class="p-4 bg-gray-100 rounded-lg text-gray-500 italic">タスクを表示するにはログインしてください。</li>';
    }
}

function startTaskListener(userId) {
    // 既存の監視があれば解除
    if (unsubscribeTasks) unsubscribeTasks();

    unsubscribeTasks = subscribeToTasks(userId, (tasks) => {
        renderTaskList(tasks);
    });
}

function renderTaskList(tasks) {
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<li class="p-4 bg-gray-100 rounded-lg text-gray-500 italic">タスクがありません。追加してください。</li>';
        return;
    }

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'p-4 border-l-4 border-blue-500 bg-white rounded-lg shadow flex justify-between items-center transition duration-150 hover:shadow-lg';
        li.innerHTML = `
            <span class="text-gray-800">${task.title}</span>
            <span class="text-xs text-gray-400">(${task.status})</span>
        `;
        taskList.appendChild(li);
    });
}

// --- 初期化処理 ---

document.addEventListener('DOMContentLoaded', () => {
    // イベントリスナー登録
    if (emailLoginBtn) emailLoginBtn.addEventListener('click', handleLogin);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (addTaskBtn) addTaskBtn.addEventListener('click', handleAddTask);
    
    // Enterキーでのタスク追加対応
    if (taskTitleInput) {
        taskTitleInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleAddTask();
        });
    }

    // 認証状態の監視開始
    subscribeToAuthChanges(updateAuthUI);

    // Canvas環境用の初期ログイン試行
    tryInitialAuth();
});