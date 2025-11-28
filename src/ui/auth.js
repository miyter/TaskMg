// 認証UIの制御

// --- 修正: インポートパス ---
import { loginWithEmail, logout } from '@/core/auth.js';
import { showMessageModal } from './components.js'; 

export function initAuthUI() {
    const loginBtn = document.getElementById('email-login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const emailInput = document.getElementById('email-input');
    const passInput = document.getElementById('password-input');

    if (loginBtn) {
        // 重複リスナーを防ぐため、クローンして置換する方法も有効ですが、
        // initAuthUIが一度しか呼ばれない前提ならこのままでOK
        loginBtn.addEventListener('click', async () => {
            try {
                if (!emailInput.value || !passInput.value) {
                    showMessageModal("メールアドレスとパスワードを入力してください。", null);
                    return;
                }
                await loginWithEmail(emailInput.value, passInput.value);
                // 成功時の処理は onAuthStateChanged で自動的に行われる
            } catch (e) {
                showMessageModal("ログインエラー: " + (e.message || "失敗しました"), null);
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await logout();
        });
    }
}

export function updateAuthUI(user) {
    const loginForm = document.getElementById('login-form-container');
    const userInfo = document.getElementById('user-info');
    const userNameObj = document.getElementById('user-display-name');
    const emailInput = document.getElementById('email-input');
    const passInput = document.getElementById('password-input');

    // 要素がまだ描画されていない場合はスキップ
    if (!loginForm || !userInfo) return;

    if (user) {
        // ログイン時
        loginForm.classList.add('hidden');
        userInfo.classList.remove('hidden');
        if (userNameObj) {
            userNameObj.textContent = user.email || 'ユーザー';
        }
    } else {
        // ログアウト時
        loginForm.classList.remove('hidden');
        userInfo.classList.add('hidden');
        if (userNameObj) userNameObj.textContent = '';
        
        // フォームクリア
        if (emailInput) emailInput.value = '';
        if (passInput) passInput.value = '';
    }
}