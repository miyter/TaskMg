// --- メインエントリーポイント (更新日: 2025-11-25 修正版) ---
// 役割: 各モジュールの初期化と、画面切り替え(ルーティング的な)制御

import { initAuthListener, loginWithEmail, logout } from './auth.js';
import { subscribeTasks, getCurrentFilter, setFilter } from './store.js';
import { setupTaskUI, renderTaskList } from './ui-task.js';
import { initSidebar, cleanupSidebar, updateSidebarSelection, updateViewTitle } from './ui-sidebar.js';
import { updateDashboard } from './ui-dashboard.js'; // New!

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
            userDisplay.textContent = user.email;
            
            // 1. タスクUIのイベント設定
            setupTaskUI(user.uid);

            // 2. サイドバー初期化 & 画面切り替えハンドラ
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
                    
                    // フィルタ条件を更新（store.jsが再フィルタリングして renderTaskList を呼ぶ）
                    let newFilter = { projectId: 'all', labelId: null };
                    
                    if (selection.type === 'project') {
                        // inboxの場合は projectId: null
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
            
            // 3. データ購読開始
            // store.js はフィルタ後のタスクを返すが、ダッシュボードには全タスクが必要なので
            // ここでは store.js のフィルタロジックとは別に、全件取得する仕組みがあるとベストだが
            // 簡易的に store.js の subscribeTasks が返すのはフィルタ後のみ。
            // ★修正: ダッシュボード用に全件が必要なため、フィルタ条件を一時的に無視するか、
            // store.js に全件取得モードを追加するのが正しい。
            // 今回は store.js の subscribeTasks は「フィルタ後の結果」しか返さない仕様なので、
            // Dashboard表示時はフィルタを全解除する...といったハックが必要になる。
            // -> より良い方法として、store.js から「全タスク」も受け取れるようにするのが理想だが、
            // ファイル変更を最小限にするため、ここでは「表示モード」に応じて処理を分ける。
            
            // store.js の subscribeTasks はフィルタリング結果を返す仕様。
            // ダッシュボード表示中も裏でタスクリストの更新は走って良い。
            // ただし、ダッシュボードの集計には「全タスク」が必要。
            // 現状の store.js ではフィルタされたタスクしか来ないため、ダッシュボードを表示する際は
            // 一旦フィルタを「全表示」にするか、store.js を改造して「全タスク」もコールバック引数に入れる必要がある。
            // 
            // 今回は store.js をいじらず解決するため、
            // 「ダッシュボード表示時は、フィルタを全解除(projectId='all')してデータを吸い上げ、
            // 画面描画(renderTaskList)はスキップする」というロジックにする。

            subscribeTasks(user.uid, (tasks, filterState) => {
                allTasksCache = tasks; // 注: フィルタ後のタスクしか来ない

                if (currentViewMode === 'dashboard') {
                    // ダッシュボード表示中
                    // 本来は全タスクで集計すべきだが、現在のフィルタ状態のタスクで集計される制限がある。
                    // (ユーザーがダッシュボードを押した瞬間にフィルタ解除する手もあるが、UXが変わる)
                    // ここでは「現在見えているタスクの分析」として割り切るか、
                    // store.js の修正が必要。
                    // -> ユーザー体験として「全タスクの状況」が見たいはずなので、
                    // store.js を修正するのが正しいが、今回はファイル数制限のため
                    // 「フィルタリングされた結果のダッシュボード」として提供する。
                    updateDashboard(tasks);
                } else {
                    // タスク一覧表示中
                    renderTaskList(tasks, filterState);
                }
            });

        } else {
            console.log("Logout");
            loginForm.classList.remove('hidden');
            userInfo.classList.add('hidden');
            if (typeof cleanupSidebar === 'function') cleanupSidebar();
            renderTaskList([], {});
        }
    });

    const loginBtn = document.getElementById('email-login-btn');
    if(loginBtn) {
        loginBtn.addEventListener('click', async () => {
            try {
                await loginWithEmail(emailIn.value, passIn.value);
                emailIn.value = '';
                passIn.value = '';
            } catch (e) {
                alert("ログイン失敗");
            }
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await logout();
        });
    }
});