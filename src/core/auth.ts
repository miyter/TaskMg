/**
 * 更新日: 2025-12-31
 * 内容: AuthServiceクラスによるリファクタリング (Grok Code Review対応)
 */

import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updatePassword,
    User,
    UserCredential
} from "./firebase-sdk";

import { logError } from '../utils/error-logger';
import { auth } from './firebase';



class AuthService {

    constructor() { }

    /**
     * 現在のログインユーザーIDを取得
     */
    public getCurrentUserId(): string | null {
        return auth.currentUser?.uid || null;
    }






    /**
     * 認証状態の監視リスナーを初期化
     * @param {Function} onLogin - ログイン時のコールバック
     * @param {Function} onLogout - ログアウト時のコールバック
     * @returns unsubscribe function
     */
    public initAuthListener(onLogin: (user: User) => void, onLogout: () => void): () => void {



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
