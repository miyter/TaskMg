// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: コード構造の整理、不要な変数の排除
 */

import { 
    signInWithEmailAndPassword,
    signOut,
    updatePassword
} from "../core/firebase-sdk.js";
import { auth, isFirebaseInitialized } from '../core/firebase.js'; 
import { showMessageModal } from './components.js'; 

// 外部からの直接変更を防ぐため、変数は非公開にしGetterのみ公開
let currentUserId = null;

export function getCurrentUserId() {
    return currentUserId;
}

/**
 * ログイン実行
 */
export async function loginWithEmail(email, password) {
    if (!isFirebaseInitialized) throw new Error("Firebase not initialized");
    try {
        return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        // エラーコードを日本語メッセージに変換して再スロー
        let msg = "ログインに失敗しました。";
        switch (error.code) {
            case 'auth/invalid-email': msg = "メールアドレスの形式が正しくありません。"; break;
            case 'auth/user-disabled': msg = "このアカウントは無効化されています。"; break;
            case 'auth/user-not-found': msg = "アカウントが見つかりません。"; break;
            case 'auth/wrong-password': msg = "パスワードが間違っています。"; break;
            case 'auth/too-many-requests': msg = "試行回数が多すぎます。しばらく待ってからお試しください。"; break;
            case 'auth/network-request-failed': msg = "ネットワークエラーが発生しました。通信環境を確認してください。"; break;
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
    if (!user) throw new Error("認証されていません。");
    
    try {
        await updatePassword(user, newPassword);
        showMessageModal("パスワードを変更しました");
    } catch (error) {
        let message = "変更に失敗しました: " + error.message;
        if (error.code === 'auth/requires-recent-login') {
            message = "セキュリティのため、再ログインが必要です。一度ログアウトしてから再度お試しください。";
        }
        showMessageModal(message, "error");
        throw error;
    }
}

/**
 * ヘッダーの認証ボタンにイベントリスナーを登録する
 */
export function setupAuthHandlers() {
    const loginBtn = document.getElementById('email-login-btn');
    const emailInput = document.getElementById('email-input');
    const passInput = document.getElementById('password-input');

    if (loginBtn && emailInput && passInput) {
        const handleLogin = async () => {
            const email = emailInput.value.trim();
            const pass = passInput.value.trim();
            
            if (!email || !pass) {
                return showMessageModal("メールアドレスとパスワードを入力してください。", "error");
            }
            
            try {
                await loginWithEmail(email, pass);
            } catch (e) {
                // UI層でのエラー表示は必須
                showMessageModal(e.message, "error");
            }
        };

        loginBtn.onclick = handleLogin;

        // Enterキーでログイン実行
        passInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
    }
}

/**
 * 認証状態に応じてUI（表示/非表示）を切り替える
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