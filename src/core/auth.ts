/**
 * 更新日: 2025-12-30
 * 内容: 自動初期化対応によるリファクタリング
 */

import {
    onAuthStateChanged,
    signInWithCustomToken,
    signInWithEmailAndPassword,
    signOut,
    updatePassword,
    User,
    UserCredential
} from "./firebase-sdk";

import { auth } from './firebase';

// グローバル定数の型定義
declare global {
    interface Window {
        GLOBAL_INITIAL_AUTH_TOKEN?: string;
    }
    const __initial_auth_token: string | undefined;
}

/**
 * 現在のログインユーザーIDを取得
 */
export function getCurrentUserId(): string | null {
    return auth.currentUser?.uid || null;
}

/**
 * 認証状態の監視リスナーを初期化
 * @param {Function} onLogin - ログイン時のコールバック
 * @param {Function} onLogout - ログアウト時のコールバック
 */
let isListenerInitialized = false;

/**
 * 環境に応じた初期認証トークンを取得
 */
function getInitialAuthToken(): string | null {
    if (typeof window !== 'undefined' && window.GLOBAL_INITIAL_AUTH_TOKEN) {
        return window.GLOBAL_INITIAL_AUTH_TOKEN;
    }
    // @ts-ignore
    if (typeof __initial_auth_token !== 'undefined') {
        // @ts-ignore
        return __initial_auth_token;
    }
    return null;
}

/**
 * 認証状態の監視リスナーを初期化
 * @param {Function} onLogin - ログイン時のコールバック
 * @param {Function} onLogout - ログアウト時のコールバック
 */
export function initAuthListener(onLogin: (user: User) => void, onLogout: () => void) {
    if (isListenerInitialized) {
        console.warn("[Auth] Auth listener already initialized. Skipping.");
        return () => { };
    }
    isListenerInitialized = true;

    // 環境変数（Canvas等）からの初期トークンログイン
    // リスナー登録より先に実行することで、初期状態のちらつき（ログアウト→即ログイン）を抑制する
    const initialToken = getInitialAuthToken();

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

    return () => {
        isListenerInitialized = false;
        unsubscribe();
    };
}

/**
 * メールアドレスとパスワードによるログイン
 */
export async function loginWithEmail(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(auth, email, password);
}

/**
 * ログアウト実行
 */
export async function logout(): Promise<void> {
    try {
        await signOut(auth);
    } catch (e) {
        console.error("Logout failed", e);
        throw e; // 呼び出し側が失敗を検知できるよう再スロー
    }
}

/**
 * パスワードの更新
 * 注: UIへのメッセージ表示は行わず、エラーをスローする責務のみを持つ
 */
export async function updateUserAuthPassword(newPassword: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication required: No current user.");

    // UI側のハンドラーでエラーをキャッチしてモーダルを表示することを期待する
    await updatePassword(user, newPassword);
}
