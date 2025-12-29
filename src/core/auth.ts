/**
 * 更新日: 2025-12-29
 * 内容: TypeScript化
 */

import {
    onAuthStateChanged,
    signInWithCustomToken,
    signInWithEmailAndPassword,
    signOut,
    updatePassword,
    User
} from "./firebase-sdk";

import { auth, isFirebaseInitialized } from './firebase';

// グローバル定数の型定義
declare global {
    interface Window {
        GLOBAL_INITIAL_AUTH_TOKEN?: string;
    }
    const __initial_auth_token: string | undefined;
}

/**
 * 現在のログインユーザーIDを取得（キャッシュ用）
 */
export function getCurrentUserId(): string | null {
    if (!isFirebaseInitialized) return null;
    return auth?.currentUser?.uid || null;
}

/**
 * 認証状態の監視リスナーを初期化
 * @param {Function} onLogin - ログイン時のコールバック
 * @param {Function} onLogout - ログアウト時のコールバック
 */
export function initAuthListener(onLogin: (user: User) => void, onLogout: () => void) {
    if (!isFirebaseInitialized) return;

    // 環境変数（Canvas等）からの初期トークンログイン
    // リスナー登録より先に実行することで、初期状態のちらつき（ログアウト→即ログイン）を抑制する
    const initialToken = (typeof window !== 'undefined' && window.GLOBAL_INITIAL_AUTH_TOKEN) ||
        // @ts-ignore
        (typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null);

    if (initialToken) {
        signInWithCustomToken(auth, initialToken)
            .then(() => console.log("[Auth] Initial token login success"))
            .catch(err => {
                // エラーログを詳細化し、失敗時はクリーンな状態を保証するためにサインアウトを試行
                console.error("[Auth] Initial token login failed. Error:", err);
                signOut(auth).catch(() => { });
            });
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
export async function loginWithEmail(email: string, password: string): Promise<any> {
    if (!isFirebaseInitialized) throw new Error("Firebase not initialized");
    return await signInWithEmailAndPassword(auth, email, password);
}

/**
 * ログアウト実行
 */
export async function logout(): Promise<void> {
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
export async function updateUserAuthPassword(newPassword: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication required");

    // UI側のハンドラーでエラーをキャッチしてモーダルを表示することを期待する
    await updatePassword(user, newPassword);
}
