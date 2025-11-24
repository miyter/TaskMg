// --- メインエントリーポイント (更新日: 2025-11-25) ---
// 役割: 各モジュールの初期化と、画面切り替え(ルーティング的な)制御

import { initAuthListener, loginWithEmail, logout } from './auth.js';
import { subscribeTasks, getCurrentFilter, setFilter } from './store.js';
import { setupTaskUI, renderTaskList } from './ui-task.js';
import { initSidebar, cleanupSidebar, updateSidebarSelection, updateViewTitle } from './ui-sidebar.js';
import { updateDashboard } from './ui-dashboard.js'; 
import { initSettingsUI } from './ui-settings.js'; 

// UI要素
const loginForm = document.getElementById('login-form-container');
const userInfo = document.getElementById('user-info');
const userDisplay = document.getElementById('user-display-name');
const emailIn = document.getElementById('email-input');
const passIn = document.getElementById('password-input');

// 画面切り替え用コンテナ
const taskView = document.getElementById('task-view');
const dashboardView = document.getElementById('dashboard-view');

// 現在の表示モード ('tasks' or 'dashboard')
let currentViewMode = 'tasks'; 
// 全タスクデータを保持（ダッシュボード集計用）
let allTasksCache = []; 

document.addEventListener('DOMContentLoaded', () => {
    
    initAuthListener((user) => {
        if (user) {
            console.log("Login:", user.uid);
            loginForm.classList.add('hidden');
            userInfo.classList.remove('hidden');
            // 表示名を整形（@より前を表示）
            const displayName = user.email ? user.email.split('@')[0] : "ユーザー";
            userDisplay.textContent = displayName;
            
            // 1. タスクUIのイベント設定
            setupTaskUI(user.uid);

            // 2. 設定UIの初期化
            initSettingsUI(user.uid);

            // 3. サイドバー初期化 & 画面切り替えハンドラ
            initSidebar(user.uid, getCurrentFilter(), (selection) => {
                
                if (selection.type === 'dashboard') {
                    // ダッシュボードへ切り替え
                    currentViewMode = 'dashboard';
                    taskView.classList.add('hidden');
                    dashboardView.classList.remove('hidden');
                    // 即時更新
                    updateDashboard(allTasksCache);
                    updateSidebarSelection({ type: 'dashboard' });

                } else {
                    // タスク一覧へ切り替え
                    currentViewMode = 'tasks';
                    dashboardView.classList.add('hidden');
                    taskView.classList.remove('hidden');
                    
                    // フィルタ条件を更新
                    let newFilter = { projectId: 'all', labelId: null };
                    
                    if (selection.type === 'project') {
                        newFilter.projectId = selection.value === 'inbox' ? null : selection.value;
                        newFilter.labelId = null;
                    } else if (selection.type === 'label') {
                        newFilter.projectId = 'all';
                        newFilter.labelId = selection.value;
                    }
                    
                    setFilter(newFilter);
                    updateSidebarSelection(selection);
                    updateViewTitle(selection);
                }
            });
            
            // 4. データ購読開始
            subscribeTasks(user.uid, (tasks, filterState) => {
                allTasksCache = tasks; 

                if (currentViewMode === 'dashboard') {
                    updateDashboard(tasks);
                } else {
                    renderTaskList(tasks, filterState);
                }
            });

        } else {
            console.log("Logout");
            loginForm.classList.remove('hidden');
            userInfo.classList.add('hidden');
            if (typeof cleanupSidebar === 'function') cleanupSidebar();
            renderTaskList([], {}); // クリア
        }
    });

    const loginBtn = document.getElementById('email-login-btn');
    if(loginBtn) {
        loginBtn.addEventListener('click', async () => {
            try {
                if (!emailIn.value || !passIn.value) {
                    alert("メールアドレスとパスワードを入力してください");
                    return;
                }
                await loginWithEmail(emailIn.value, passIn.value);
                emailIn.value = '';
                passIn.value = '';
            } catch (e) {
                console.error(e);
                alert("ログインに失敗しました。メールアドレスかパスワードを確認してください。");
            }
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            if(confirm("ログアウトしますか？")) {
                await logout();
            }
        });
    }
});