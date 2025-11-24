// @miyter:20251125
// Vite導入に伴い、ローカルモジュールのインポートパスを絶対パス '@' に修正
// alert()をshowMessageModalに置き換え

// --- 修正1: コアモジュールへのインポートパスを絶対パスに変更 ---
import { loginWithEmail, logout } from '@/core/auth.js';
// --- 修正2: alert()を置き換えるため、メッセージモーダルをインポート ---
import { showMessageModal } from './components.js'; 

const ui = {
    formContainer: document.getElementById('login-form-container'),
    userInfo: document.getElementById('user-info'),
    displayName: document.getElementById('user-display-name'),
    emailInput: document.getElementById('email-input'),
    passInput: document.getElementById('password-input'),
    loginBtn: document.getElementById('email-login-btn'),
    logoutBtn: document.getElementById('logout-btn')
};

export function initAuthUI() {
    if (ui.loginBtn) {
        ui.loginBtn.addEventListener('click', async () => {
            try {
                // ログイン処理を実行
                await loginWithEmail(ui.emailInput.value, ui.passInput.value);
                // 成功時はonAuthStateChangedでUIが更新されるため、ここでは何もしない
            } catch (e) {
                // ログイン失敗時: alert()の代わりにshowMessageModalを使用
                showMessageModal("ログインエラー", e.message || "ログインに失敗しました。", "error");
            }
        });
    }

    if (ui.logoutBtn) {
        ui.logoutBtn.addEventListener('click', async () => {
            await logout();
        });
    }
}

export function updateAuthUI(user) {
    if (user) {
        ui.formContainer.classList.add('hidden');
        ui.userInfo.classList.remove('hidden');
        ui.userInfo.classList.add('flex');
        // UIDの表示はmain.jsで行うため、ここではEmailのみ
        ui.displayName.textContent = user.email || "ゲスト"; 
    } else {
        ui.formContainer.classList.remove('hidden');
        ui.userInfo.classList.add('hidden');
        ui.userInfo.classList.remove('flex');
        // ログアウト時にフォームの入力値をクリア
        if (ui.emailInput) ui.emailInput.value = '';
        if (ui.passInput) ui.passInput.value = '';
    }
}