// --- メインエントリーポイント (統合版) ---
import { initAuthListener, loginWithEmail, logout } from './auth.js';
import { subscribeTasks } from './store.js';
import { setupTaskUI, renderTaskList } from './ui-task.js';
import { setupSidebar } from './ui-sidebar.js'; // サイドバー統合

// UI要素
const loginForm = document.getElementById('login-form-container');
const userInfo = document.getElementById('user-info');
const userDisplay = document.getElementById('user-display-name');
const emailIn = document.getElementById('email-input');
const passIn = document.getElementById('password-input');
const loginMsg = document.getElementById('login-error-message'); // index.htmlに追加が必要かも？なければエラーにならないよう配慮

document.addEventListener('DOMContentLoaded', () => {
    
    initAuthListener((user) => {
        if (user) {
            console.log("Login:", user.uid);
            loginForm.classList.add('hidden');
            userInfo.classList.remove('hidden');
            userDisplay.textContent = user.email;
            
            // 各モジュールのセットアップ
            setupSidebar(user.uid);
            setupTaskUI(user.uid);
            
            // タスクデータの購読開始
            // store.jsでフィルタリングされた結果が返ってくる
            subscribeTasks(user.uid, (tasks, filterState) => {
                renderTaskList(tasks, filterState);
            });

        } else {
            console.log("Logout");
            loginForm.classList.remove('hidden');
            userInfo.classList.add('hidden');
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