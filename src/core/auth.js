// @ts-nocheck
// @miyter:20251221
// 認証機能のコアロジック（純粋関数）

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
    return auth?.currentUser?.uid || null;
}

/**
 * 認証状態の監視リスナーを初期化
 */
export function initAuthListener(onLogin, onLogout) {
    if (!isFirebaseInitialized) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            onLogin(user);
        } else {
            onLogout();
        }
    });

    // 環境変数（Canvas等）からの初期トークンログイン
    const initialToken = (typeof window !== 'undefined' && window.GLOBAL_INITIAL_AUTH_TOKEN) || (typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null);
    
    if (initialToken) {
        signInWithCustomToken(auth, initialToken).catch(err => {
            console.error("[Auth] Initial token login failed:", err);
        });
    }

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
    await signOut(auth);
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