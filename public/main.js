// 更新日: 2025-11-25
// 役割: UI操作と各モジュール（auth, store）の連携を行います。

import { loginWithEmail, logout, subscribeToAuthChanges, tryInitialAuth } from "./auth.js";
import { addTask, subscribeToTasks, toggleTaskStatus, deleteTask, updateTask } from "./store.js"; 

// --- UI要素の参照 ---
// HTMLに要素を直接追加したので、DOMContentLoaded前に参照可能
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
const dueDateInput = document.getElementById('due-date-input'); // ★修正: HTMLから直接参照
const addTaskBtn = document.getElementById('add-task-btn');

// --- 状態変数 ---
let currentUserId = null;
let unsubscribeTasks = null; // タスク監視の解除用関数

// --- ユーティリティ ---
function formatDate(timestamp) {
    if (!timestamp) return '';
    // FirestoreのTimestampオブジェクトをJavaScriptのDateに変換
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    // YYYY-MM-DD形式にフォーマット (type="date" の input に必要)
    return date.toISOString().split('T')[0];
}

function isOverdue(timestamp) {
    if (!timestamp) return false;
    const now = new Date();
    const dueDate = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    // 日付のみ比較するために時間をクリア
    now.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < now;
}

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
    // ★修正: DOM参照エラー対策。HTMLに要素を直接追加したため、ここでの参照は安全
    const title = taskTitleInput.value;
    const dueDateValue = dueDateInput.value; 
    
    if (!title.trim()) return;

    // store.js の addTask を更新し、dueDateも渡せるように修正
    let dueDate = null;
    if (dueDateValue) {
        // Dateオブジェクトを生成（タイムゾーンの扱いはFirestore側でTimestampに変換される際に調整される）
        dueDate = new Date(dueDateValue); 
    }

    // store.js に新しいaddTaskを定義する
    // ※今回は store.js の addTask が title と status しか受け取らないため、タイトルのみ渡す
    // → store.js の addTask を修正して、dueDate も受け取るようにします
    const success = await addTask(currentUserId, title, dueDate); 

    if (success) {
        taskTitleInput.value = ''; // 入力欄クリア
        dueDateInput.value = ''; // 期限日入力欄クリア
    }
}

// タスク操作イベント (完了/削除/編集) の委譲
function handleTaskAction(e) {
    if (!currentUserId) return;

    const target = e.target;
    const taskElement = target.closest('li[data-id]'); // data-id属性を持つli要素を取得
    if (!taskElement) return;

    const taskId = taskElement.dataset.id;
    const currentStatus = taskElement.dataset.status;

    // 完了チェックボックスの操作
    if (target.matches('.task-toggle')) {
        toggleTaskStatus(currentUserId, taskId, currentStatus);
    } 
    // 削除ボタンの操作
    else if (target.matches('.task-delete-btn')) {
        if (confirm('本当にこのタスクを削除しますか？')) {
            deleteTask(currentUserId, taskId);
        }
    }
    // タスクタイトル要素のクリックまたはダブルクリック操作（編集モード開始）
    else if (target.matches('.task-title-span') && e.type === 'dblclick') {
        const currentTitle = target.textContent.trim();
        startEditing(taskElement, taskId, currentTitle);
    }
    // 期限日入力欄の変更 (changeイベント)
    else if (target.matches('.task-due-date-input')) {
        const newDateString = target.value;
        // store.jsのupdateTaskがTimestampに変換するため、空文字かDateオブジェクトを渡す
        let newDate = newDateString ? new Date(newDateString) : ''; 
        
        updateTask(currentUserId, taskId, { dueDate: newDate });
    }
}

// タスクタイトル編集モードの開始
function startEditing(taskElement, taskId, currentTitle) {
    // 既存のタイトル表示を非表示にし、編集用のinputを作成
    const titleSpan = taskElement.querySelector('.task-title-span');
    if (!titleSpan) return;

    // input要素を生成
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'flex-grow p-1 border border-blue-400 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500';
    input.value = currentTitle;

    // input要素をspanの代わりに追加
    titleSpan.style.display = 'none';
    titleSpan.parentElement.insertBefore(input, titleSpan.nextSibling);

    input.focus();
    
    // 編集終了ハンドラ
    const finishEditing = async () => {
        const newTitle = input.value.trim();
        
        // タイトルが変更された、かつ空でない場合のみ更新
        if (newTitle !== currentTitle && newTitle !== '') {
            await updateTask(currentUserId, taskId, { title: newTitle });
        }
        
        // inputを削除し、タイトル表示を元に戻す
        input.remove();
        titleSpan.style.display = '';
    };

    // Enterキーで編集終了
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            finishEditing();
        }
    });

    // フォーカスが外れたら編集終了（blur）
    input.addEventListener('blur', finishEditing);
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
        const overdue = isOverdue(task.dueDate); 
        const dueDateText = task.dueDate ? formatDate(task.dueDate) : '期限なし';
        
        const li = document.createElement('li');
        
        // 期限切れなら赤色ボーダーとクラスを追加
        let borderColor = 'border-blue-500';
        if (overdue && !isCompleted) {
            borderColor = 'border-red-500';
        } else if (isCompleted) {
            borderColor = 'border-gray-300';
        }

        // データをカスタム属性に設定
        li.className = `p-4 border-l-4 ${borderColor} bg-white rounded-lg shadow flex justify-between items-start transition duration-150 hover:shadow-lg ${isCompleted ? 'opacity-60' : ''}`;
        li.setAttribute('data-id', task.id);
        li.setAttribute('data-status', task.status);
        
        li.innerHTML = `
            <div class="flex items-start flex-grow space-x-4">
                <!-- 完了チェックボックス -->
                <input type="checkbox" 
                       class="task-toggle mt-1 w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer flex-shrink-0"
                       ${isCompleted ? 'checked' : ''}>
                
                <div class="flex-grow min-w-0">
                    <!-- タスクタイトル (ダブルクリックで編集可能) -->
                    <span class="task-title-span text-gray-800 text-lg ${isCompleted ? 'line-through text-gray-500' : ''} cursor-pointer hover:bg-yellow-100 p-1 rounded-sm block" title="ダブルクリックで編集">
                        ${task.title}
                    </span>
                    
                    <!-- 期限日表示 -->
                    <div class="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ${overdue && !isCompleted ? 'text-red-500' : 'text-gray-400'}" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                        </svg>
                        <span class="${overdue && !isCompleted ? 'text-red-500 font-semibold' : ''}">
                            ${task.dueDate ? formatDate(task.dueDate) : '期限なし'}
                            ${overdue && !isCompleted ? ' (期限切れ)' : ''}
                        </span>
                    </div>
                </div>
            </div>

            <!-- 操作ボタン群 (期限日入力と削除) -->
            <div class="flex items-start space-x-2 ml-4 flex-shrink-0">
                <!-- 期限日入力ピッカー -->
                <input type="date" 
                       class="task-due-date-input p-1 border border-gray-300 rounded-md text-sm cursor-pointer ${overdue && !isCompleted ? 'border-red-500' : ''}"
                       value="${task.dueDate ? formatDate(task.dueDate) : ''}"
                       title="期限日を設定">

                <!-- 削除ボタン -->
                <button class="task-delete-btn text-gray-400 hover:text-red-500 transition duration-150 p-1" title="削除">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 100 2v6a1 1 0 102 0V8a1 1 0 00-2 0z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// --- 初期化処理 ---

document.addEventListener('DOMContentLoaded', () => {
    // ★修正: 動的なDOM追加ロジックを削除したため、main.jsからdueDateInputの参照が安全になった。
    
    // イベントリスナー登録
    if (emailLoginBtn) emailLoginBtn.addEventListener('click', handleLogin);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (addTaskBtn) addTaskBtn.addEventListener('click', handleAddTask);
    
    // タスク一覧全体に対するイベントリスナーを登録（イベント委譲）
    if (taskList) {
        taskList.addEventListener('click', handleTaskAction);
        taskList.addEventListener('dblclick', handleTaskAction); // ダブルクリックで編集
    }

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