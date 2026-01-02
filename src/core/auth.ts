/**
 * 更新日: 2025-12-31
 * 内容: AuthServiceクラスによるリファクタリング (Grok Code Review対応)
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

import { logError } from '../utils/error-logger';
import { auth } from './firebase';

// グローバル定数の型定義
declare global {
    interface Window {
        GLOBAL_INITIAL_AUTH_TOKEN?: string;
    }
    const __initial_auth_token: string | undefined;
}

class AuthService {

    constructor() { }

    /**
     * 現在のログインユーザーIDを取得
     */
    public getCurrentUserId(): string | null {
        return auth.currentUser?.uid || null;
    }

    /**
     * 環境に応じた初期認証トークンを取得
     */
    public hasInitialToken(): boolean {
        if (typeof window !== 'undefined' && window.GLOBAL_INITIAL_AUTH_TOKEN) return true;
        try {
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) return true;
        } catch (e) { }
        return false;
    }

    /**
     * 環境に応じた初期認証トークンを取得
     */
    private getInitialAuthToken(): string | null {
        if (typeof window !== 'undefined' && window.GLOBAL_INITIAL_AUTH_TOKEN) {
            return window.GLOBAL_INITIAL_AUTH_TOKEN;
        }

        try {
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                return __initial_auth_token;
            }
        } catch (e) {
            // ReferenceError safe
        }
        return null;
    }


    private initialLoginPromise: Promise<void> | null = null;

    /**
     * 初期トークンによるログインを試行 (一度だけ成功させるか、進行中のものを待機)
     */
    public async tryInitialTokenLogin(): Promise<void> {
        // すでに試行中または成功済みの場合はそれを待機または無視
        if (this.initialLoginPromise) return this.initialLoginPromise;

        const initialToken = this.getInitialAuthToken();
        if (!initialToken) {
            this.initialLoginPromise = Promise.resolve();
            return;
        }

        this.initialLoginPromise = (async () => {
            try {
                await signInWithCustomToken(auth, initialToken);
                console.log("[Auth] Initial token login success");
            } catch (err: any) {
                logError({
                    timestamp: new Date().toISOString(),
                    type: 'error',
                    message: `Initial token login failed: ${err.message}`,
                    stack: err.stack,
                    url: 'auth.ts'
                });
                // 失敗時は再試行可能にするためにPromiseをクリアするか、
                // あるいは初期化済みとしてマークし続けるか (現状は後者)
            }
        })();

        return this.initialLoginPromise;
    }


    /**
     * 認証状態の監視リスナーを初期化
     * @param {Function} onLogin - ログイン時のコールバック
     * @param {Function} onLogout - ログアウト時のコールバック
     * @returns unsubscribe function
     */
    public initAuthListener(onLogin: (user: User) => void, onLogout: () => void): () => void {
        // 初期トークンログインの試行
        this.tryInitialTokenLogin();


        // 認証状態の監視 (常に新しいリスナーを登録し、その解除関数を返す)
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
    public async loginWithEmail(email: string, password: string): Promise<UserCredential> {
        return await signInWithEmailAndPassword(auth, email, password);
    }

    /**
     * ログアウト実行
     */
    public async logout(): Promise<void> {
        try {
            await signOut(auth);
        } catch (e: any) {
            logError({
                timestamp: new Date().toISOString(),
                type: 'error',
                message: `Logout failed: ${e.message}`,
                stack: e.stack,
                url: 'auth.ts'
            });
            throw e;
        }
    }

    /**
     * パスワードの更新
     */
    public async updateUserAuthPassword(newPassword: string): Promise<void> {
        const user = auth.currentUser;
        if (!user) throw new Error("Authentication required: No current user.");
        await updatePassword(user, newPassword);
    }
}

// Singleton instance
export const authService = new AuthService();

// Legacy Exports (Proxy to singleton) - for backward compatibility
export const getCurrentUserId = () => authService.getCurrentUserId();
export const initAuthListener = (onLogin: (user: User) => void, onLogout: () => void) => authService.initAuthListener(onLogin, onLogout);
export const loginWithEmail = (e: string, p: string) => authService.loginWithEmail(e, p);
export const logout = () => authService.logout();
export const updateUserAuthPassword = (p: string) => authService.updateUserAuthPassword(p);
