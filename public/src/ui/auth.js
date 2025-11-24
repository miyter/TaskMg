// --- 認証UI制御 (移動: public/ui-auth.js -> src/ui/auth.js) ---
// 役割: ログインフォームやユーザー情報の表示切り替え

// UI要素の参照
const loginForm = document.getElementById('login-form-container');
const userInfo = document.getElementById('user-info');
const userDisplay = document.getElementById('user-display-name');

// 認証状態に応じたUI更新
export function updateAuthUI(user) {
    if (user) {
        // ログイン時
        if (loginForm) loginForm.classList.add('hidden');
        if (userInfo) userInfo.classList.remove('hidden');
        
        // メールアドレスの@より前を表示名とする
        const displayName = user.email ? user.email.split('@')[0] : "ユーザー";
        if (userDisplay) userDisplay.textContent = displayName;
    } else {
        // ログアウト時
        if (loginForm) loginForm.classList.remove('hidden');
        if (userInfo) userInfo.classList.add('hidden');
        if (userDisplay) userDisplay.textContent = '';
    }
}