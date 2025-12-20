// @ts-nocheck
// @miyter:20251221
// 認証ロジックとヘッダーの認証UI制御

import { 
    signInWithEmailAndPassword,
    signOut,
    signInWithCustomToken,
    onAuthStateChanged,
    updatePassword
} from "../core/firebase-sdk.js";
import { auth, isFirebaseInitialized } from '../core/firebase.js'; 
import { showMessageModal } from './components.js'; 

export let currentUserId = null;

/**
 * ログイン実行
 */
export async function loginWithEmail(email, password) {
    if (!isFirebaseInitialized) throw new Error("Firebase not initialized");
    return await signInWithEmailAndPassword(auth, email, password);
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
    if (!user) throw new Error("認証されていません。");
    
    try {
        await updatePassword(user, newPassword);
        showMessageModal("成功", "パスワードが正常に変更されました。", "success");
    } catch (error) {
        let message = "変更に失敗しました。";
        if (error.code === 'auth/requires-recent-login') {
            message = "再ログインが必要です。一度ログアウトしてから再度お試しください。";
        }
        showMessageModal("エラー", message, "error");
        throw error;
    }
}

/**
 * ヘッダーの認証ボタンにイベントリスナーを登録する (初期化時に一度だけ呼ぶ)
 */
export function setupAuthHandlers() {
    const loginBtn = document.getElementById('email-login-btn');
    const emailInput = document.getElementById('email-input');
    const passInput = document.getElementById('password-input');

    if (loginBtn) {
        loginBtn.onclick = async () => {
            const email = emailInput.value.trim();
            const pass = passInput.value.trim();
            
            if (!email || !pass) {
                return showMessageModal("メールアドレスとパスワードを入力してください。");
            }
            
            try {
                await loginWithEmail(email, pass);
            } catch (e) {
                showMessageModal("ログイン失敗: " + e.message, "error");
            }
        };
    }
}

/**
 * 認証状態に応じてUI（表示/非表示）を切り替える
 */
export function updateAuthUI(user) {
    const elements = {
        loginForm: document.getElementById('login-form-container'),
        userInfo: document.getElementById('user-info'),
        emailInput: document.getElementById('email-input'),
        passInput: document.getElementById('password-input')
    };

    if (!elements.loginForm || !elements.userInfo) return;

    if (user) {
        currentUserId = user.uid;
        elements.loginForm.classList.add('hidden');
        elements.userInfo.classList.remove('hidden');
        elements.userInfo.classList.add('flex');
    } else {
        currentUserId = null;
        elements.loginForm.classList.remove('hidden');
        elements.userInfo.classList.add('hidden');
        elements.userInfo.classList.remove('flex');
        
        if (elements.emailInput) elements.emailInput.value = '';
        if (elements.passInput) elements.passInput.value = '';
    }
}