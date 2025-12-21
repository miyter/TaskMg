// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: 初期トークンログインの順序修正（ちらつき防止）、状態取得の安全性向上
 */

import { 
    signInWithEmailAndPassword,
    signOut,
    signInWithCustomToken,
    onAuthStateChanged,
    updatePassword
} from "./firebase-sdk.js";

import { auth, isFirebaseInitialized } from './firebase.js'; 

/**
 * 現在のログインユーザーIDを取得（キャッシュ用）
 */
export function getCurrentUserId() {
    if (!isFirebaseInitialized) return null;
    return auth?.currentUser?.uid || null;
}

/**
 * 認証状態の監視リスナーを初期化
 * @param {Function} onLogin - ログイン時のコールバック
 * @param {Function} onLogout - ログアウト時のコールバック
 */
export function initAuthListener(onLogin, onLogout) {
    if (!isFirebaseInitialized) return;

    // 環境変数（Canvas等）からの初期トークンログイン
    // リスナー登録より先に実行することで、初期状態のちらつき（ログアウト→即ログイン）を抑制する
    const initialToken = (typeof window !== 'undefined' && window.GLOBAL_INITIAL_AUTH_TOKEN) || 
                          (typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null);
    
    if (initialToken) {
        signInWithCustomToken(auth, initialToken)
            .then(() => console.log("[Auth] Initial token login success"))
            .catch(err => console.error("[Auth] Initial token login failed:", err));
    }

    // 認証状態の監視
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            onLogin(user);
        } else {
            onLogout();
        }
    });

    return unsubscribe;
}

/**
 * メールアドレスとパスワードによるログイン
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
    try {
        await signOut(auth);
    } catch (e) {
        console.error("Logout failed", e);
    }
}

/**
 * パスワードの更新
 * 注: UIへのメッセージ表示は行わず、エラーをスローする責務のみを持つ
 */
export async function updateUserAuthPassword(newPassword) {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication required");
    
    // UI側のハンドラーでエラーをキャッチしてモーダルを表示することを期待する
    return await updatePassword(user, newPassword);
}