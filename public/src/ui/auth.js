// --- 認証UI制御 ---
import { loginWithEmail, logout } from '../core/auth.js';

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
                await loginWithEmail(ui.emailInput.value, ui.passInput.value);
            } catch (e) {
                alert("ログイン失敗: " + e.message);
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
        ui.displayName.textContent = user.email || "ゲスト";
    } else {
        ui.formContainer.classList.remove('hidden');
        ui.userInfo.classList.add('hidden');
        ui.userInfo.classList.remove('flex');
    }
}