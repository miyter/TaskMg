/**
 * 認証関連のUI・ロジック制御
 */
import { 
    signInWithEmailAndPassword,
    signOut,
    updatePassword
} from "../core/firebase-sdk.js";
import { auth, isFirebaseInitialized } from '../core/firebase.js'; 
import { showMessageModal } from './components.js'; 

let currentUserId = null;

export function getCurrentUserId() {
    return currentUserId;
}

/**
 * ログイン実行
 */
export async function loginWithEmail(email, password) {
    if (!isFirebaseInitialized) throw new Error("Firebaseが初期化されていないぞ。");
    
    try {
        return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        let msg = "ログインに失敗した。";
        switch (error.code) {
            case 'auth/invalid-email': msg = "メールアドレスの形式が正しくない。"; break;
            case 'auth/user-disabled': msg = "このアカウントは無効化されているぞ。"; break;
            case 'auth/user-not-found': msg = "アカウントが見つからない。"; break;
            case 'auth/wrong-password': msg = "パスワードが間違っている。"; break;
            case 'auth/too-many-requests': msg = "試行回数が多すぎる。少し時間を置いてくれ。"; break;
            case 'auth/network-request-failed': msg = "ネットワークエラーだ。通信環境を確認してくれ。"; break;
        }
        throw new Error(msg);
    }
}

/**
 * ログアウト実行
 */
export async function logout() {
    if (!isFirebaseInitialized) return;
    await signOut(auth);
}

/**
 * パスワード更新
 */
export async function updateUserPassword(newPassword) {
    const user = auth.currentUser;
    if (!user) throw new Error("認証されていないぞ。");
    
    try {
        await updatePassword(user, newPassword);
        showMessageModal({ message: "パスワードを変更したぞ", type: 'success' });
    } catch (error) {
        let message = "変更に失敗した: " + error.message;
        if (error.code === 'auth/requires-recent-login') {
            message = "セキュリティのため、再ログインが必要だ。一度ログアウトしてから試してくれ。";
        }
        showMessageModal({ message, type: 'error' });
        throw error;
    }
}

/**
 * イベントリスナー登録
 */
export function setupAuthHandlers() {
    const loginBtn = document.getElementById('email-login-btn');
    const emailInput = document.getElementById('email-input');
    const passInput = document.getElementById('password-input');

    if (!loginBtn || !emailInput || !passInput) return;

    const handleLogin = async () => {
        const email = emailInput.value.trim();
        const pass = passInput.value.trim();
        
        if (!email || !pass) {
            return showMessageModal({ message: "メールアドレスとパスワードを入力してくれ。", type: 'error' });
        }
        
        try {
            await loginWithEmail(email, pass);
        } catch (e) {
            showMessageModal({ message: e.message, type: 'error' });
        }
    };

    loginBtn.onclick = handleLogin;

    passInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.isComposing) handleLogin();
    });
}

/**
 * 認証状態のUI同期
 */
export function updateAuthUI(user) {
    const elements = {
        loginForm: document.getElementById('login-form-container'),
        userInfo: document.getElementById('user-info'),
        userEmailDisplay: document.getElementById('user-email-display'),
        emailInput: document.getElementById('email-input'),
        passInput: document.getElementById('password-input')
    };

    if (!elements.loginForm || !elements.userInfo) return;

    if (user) {
        currentUserId = user.uid;
        elements.loginForm.classList.add('hidden');
        elements.userInfo.classList.remove('hidden');
        elements.userInfo.classList.add('flex');
        
        if (elements.userEmailDisplay) {
            elements.userEmailDisplay.textContent = user.email || 'ユーザー';
        }
    } else {
        currentUserId = null;
        elements.loginForm.classList.remove('hidden');
        elements.userInfo.classList.add('hidden');
        elements.userInfo.classList.remove('flex');
        
        if (elements.emailInput) elements.emailInput.value = '';
        if (elements.passInput) elements.passInput.value = '';
        if (elements.userEmailDisplay) elements.userEmailDisplay.textContent = '';
    }
}