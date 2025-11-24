// --- メインエントリーポイント (更新日: 2025-11-25 修正版) ---
import { initAuthListener, loginWithEmail, logout } from './auth.js';
import { subscribeTasks, getCurrentFilter, setFilter } from './store.js';
import { setupTaskUI, renderTaskList } from './ui-task.js';
// ★修正: ui-sidebar.js の正しい関数名 'initSidebar' をインポート
import { initSidebar, cleanupSidebar } from './ui-sidebar.js';

// UI要素
const loginForm = document.getElementById('login-form-container');
const userInfo = document.getElementById('user-info');
const userDisplay = document.getElementById('user-display-name');
const emailIn = document.getElementById('email-input');
const passIn = document.getElementById('password-input');

document.addEventListener('DOMContentLoaded', () => {
    
    initAuthListener((user) => {
        if (user) {
            console.log("Login:", user.uid);
            loginForm.classList.add('hidden');
            userInfo.classList.remove('hidden');
            userDisplay.textContent = user.email;
            
            // ★修正: setupSidebar ではなく initSidebar を呼び出す
            initSidebar(user.uid, getCurrentFilter(), (newFilter) => {
                // サイドバーで選択されたらフィルタを更新
                setFilter(newFilter);
            });
            
            setupTaskUI(user.uid);
            
            // タスクデータの購読開始
            subscribeTasks(user.uid, (tasks, filterState) => {
                renderTaskList(tasks, filterState);
            });

        } else {
            console.log("Logout");
            loginForm.classList.remove('hidden');
            userInfo.classList.add('hidden');
            
            // ★修正: クリーンアップも反映
            if (typeof cleanupSidebar === 'function') cleanupSidebar();
            
            renderTaskList([], {});
        }
    });

    // ログイン処理
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

    // ログアウト処理
    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await logout();
        });
    }
});