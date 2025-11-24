// --- メインエントリーポイント (最終版) ---
import { initAuthListener, loginWithEmail, logout } from './core/auth.js';
import { subscribeTasks, getCurrentFilter, setFilter } from './store/tasks.js';
import { setupTaskUI, renderTaskList } from './ui/task-view.js';
import { initSidebar, cleanupSidebar, updateSidebarSelection, updateViewTitle } from './ui/sidebar.js';
import { updateDashboard } from './ui/dashboard.js'; 
import { initSettingsUI } from './ui/settings.js'; 
import { renderModals } from './ui/components.js';
// ★追加: 認証UI制御をインポート
import { updateAuthUI } from './ui/auth.js';

const emailIn = document.getElementById('email-input');
const passIn = document.getElementById('password-input');
const taskView = document.getElementById('task-view');
const dashboardView = document.getElementById('dashboard-view');

let currentViewMode = 'tasks'; 
let allTasksCache = []; 

document.addEventListener('DOMContentLoaded', () => {
    renderModals();

    initAuthListener((user) => {
        // ★修正: UI更新を専用モジュールに任せる
        updateAuthUI(user);

        if (user) {
            console.log("Login:", user.uid);
            
            setupTaskUI(user.uid);
            initSettingsUI(user.uid); 

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