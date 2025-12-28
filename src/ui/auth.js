/**
 * 認証関連のUI・ロジック制御
 */
import {
    signInWithEmailAndPassword,
    signOut,
    updatePassword,
    signInAnonymously
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
    const guestBtn = document.getElementById('guest-login-btn');

    // Email Login
    if (loginBtn && emailInput && passInput) {
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

    // Guest Login
    if (guestBtn) {
        guestBtn.onclick = async () => {
            try {
                await signInAnonymously(auth);
                showMessageModal({ message: "ゲストとしてログインしたぞ。データは一時的に保持される。", type: 'success' });
            } catch (error) {
                console.error(error);
                showMessageModal({ message: "ゲストログインに失敗した: " + error.message, type: 'error' });
            }
        };
    }
}

/**
 * 認証状態のUI同期
 */
export function updateAuthUI(user) {
    // 要素が存在しない場合でもエラーにならないようガード
    const loginForm = document.getElementById('login-form-container') || document.getElementById('login-container-wrapper');
    const userInfo = document.getElementById('user-info');
    const userEmailDisplay = document.getElementById('user-email-display');
    const emailInput = document.getElementById('email-input');
    const passInput = document.getElementById('password-input');

    if (!user) {
        currentUserId = null;
        if (loginForm) loginForm.classList.remove('hidden');
        if (userInfo) {
            userInfo.classList.add('hidden');
            userInfo.classList.remove('flex');
        }

        if (emailInput) emailInput.value = '';
        if (passInput) passInput.value = '';
        if (userEmailDisplay) userEmailDisplay.textContent = '';
    } else {
        currentUserId = user.uid;
        if (loginForm) loginForm.classList.add('hidden');
        if (userInfo) {
            userInfo.classList.remove('hidden');
            userInfo.classList.add('flex');
        }

        if (userEmailDisplay) {
            userEmailDisplay.textContent = user.isAnonymous ? 'ゲストユーザー' : (user.email || 'ユーザー');
        }
    }
}