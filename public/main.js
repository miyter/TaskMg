// 更新日: 2025-11-24
// 役割: UI操作と各モジュール（auth, store）の連携を行います。

import { loginWithEmail, logout, subscribeToAuthChanges, tryInitialAuth } from "./auth.js";
import { addTask, subscribeToTasks, toggleTaskStatus, deleteTask } from "./store.js"; // ★追加: 新しい関数をインポート

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

// タスク操作イベント (完了/削除) の委譲
function handleTaskAction(e) {
    if (!currentUserId) return;

    const target = e.target;
    const taskElement = target.closest('li');
    if (!taskElement) return;

    const taskId = taskElement.dataset.id;
    const currentStatus = taskElement.dataset.status;

    // 完了チェックボックスの操作
    if (target.matches('.task-toggle')) {
        toggleTaskStatus(currentUserId, taskId, currentStatus);
    } 
    // 削除ボタンの操作
    else if (target.matches('.task-delete-btn')) {
        // alertの代わりにカスタムUIを使うべきだが、今回は手順書の指示に従い簡易対応
        if (confirm('本当にこのタスクを削除しますか？')) {
            deleteTask(currentUserId, taskId);
        }
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
        const isCompleted = task.status === 'completed';
        const li = document.createElement('li');
        
        // データをカスタム属性に設定
        li.className = `p-4 border-l-4 border-blue-500 bg-white rounded-lg shadow flex justify-between items-center transition duration-150 hover:shadow-lg ${isCompleted ? 'opacity-60' : ''}`;
        li.setAttribute('data-id', task.id);
        li.setAttribute('data-status', task.status);
        
        li.innerHTML = `
            <div class="flex items-center flex-grow">
                <!-- 完了チェックボックス -->
                <input type="checkbox" 
                       class="task-toggle w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mr-4 cursor-pointer"
                       ${isCompleted ? 'checked' : ''}>
                
                <!-- タスクタイトル -->
                <span class="text-gray-800 flex-grow ${isCompleted ? 'line-through text-gray-500' : ''}">
                    ${task.title}
                </span>
            </div>

            <!-- 削除ボタン -->
            <button class="task-delete-btn text-gray-400 hover:text-red-500 transition duration-150 p-1 ml-4" title="削除">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 100 2v6a1 1 0 102 0V8a1 1 0 00-2 0z" clip-rule="evenodd" />
                </svg>
            </button>
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
    
    // タスク一覧全体に対するイベントリスナーを登録（イベント委譲）
    if (taskList) taskList.addEventListener('click', handleTaskAction);

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