// --- メインエントリーポイント (更新日: 2025-11-25 リファクタリング) ---
import { initAuthListener, loginWithEmail, logout } from './auth.js';
import { subscribeTasks, getCurrentFilter, setFilter } from './store.js';
import { setupTaskUI, renderTaskList } from './ui-task.js';
import { initSidebar, cleanupSidebar, updateSidebarSelection, updateViewTitle } from './ui-sidebar.js';
import { updateDashboard } from './ui-dashboard.js'; 
import { initSettingsUI } from './ui-settings.js'; 
// ★コンポーネント生成をインポート
import { renderModals } from './ui-components.js';

const loginForm = document.getElementById('login-form-container');
const userInfo = document.getElementById('user-info');
const userDisplay = document.getElementById('user-display-name');
const emailIn = document.getElementById('email-input');
const passIn = document.getElementById('password-input');
const taskView = document.getElementById('task-view');
const dashboardView = document.getElementById('dashboard-view');

let currentViewMode = 'tasks'; 
let allTasksCache = []; 

document.addEventListener('DOMContentLoaded', () => {
    
    // ★最初にモーダルなどのHTMLコンポーネントを生成
    renderModals();

    initAuthListener((user) => {
        if (user) {
            console.log("Login:", user.uid);
            loginForm.classList.add('hidden');
            userInfo.classList.remove('hidden');
            const displayName = user.email ? user.email.split('@')[0] : "ユーザー";
            userDisplay.textContent = displayName;
            
            setupTaskUI(user.uid);
            initSettingsUI(user.uid); // モーダル生成後に呼ぶ

            initSidebar(user.uid, getCurrentFilter(), (selection) => {
                if (selection.type === 'dashboard') {
                    currentViewMode = 'dashboard';
                    taskView.classList.add('hidden');
                    dashboardView.classList.remove('hidden');
                    updateDashboard(allTasksCache);
                    updateSidebarSelection({ type: 'dashboard' });
                } else {
                    currentViewMode = 'tasks';
                    dashboardView.classList.add('hidden');
                    taskView.classList.remove('hidden');
                    
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
            renderTaskList([], {}); 
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
                alert("ログインに失敗しました。");
            }
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            if(confirm("ログアウトしますか？")) await logout();
        });
    }
});