// 更新日: 2025-11-24
// 役割: ログイン、ログアウト、認証状態の監視を担当します。

import { 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    signInWithCustomToken
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { auth, isInitialized } from "./firebase-init.js";

/**
 * メールとパスワードでログイン
 */
export async function loginWithEmail(email, password) {
    if (!isInitialized) throw new Error("Firebase未初期化");
    
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        console.log("ログイン成功:", result.user.email);
        return { success: true, user: result.user };
    } catch (error) {
        console.error("ログインエラー:", error.code);
        let message = "ログインに失敗しました。";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            message = "メールアドレスまたはパスワードが間違っています。";
        } else if (error.code === 'auth/invalid-email') {
            message = "メールアドレスの形式が正しくありません。";
        }
        return { success: false, message: message };
    }
}

/**
 * ログアウト
 */
export async function logout() {
    if (!isInitialized) return;
    try {
        await signOut(auth);
        console.log("ログアウトしました");
    } catch (error) {
        console.error("ログアウトエラー:", error);
    }
}

/**
 * 認証状態の監視リスナーを設定
 * @param {Function} callback - (user) => {} 形式の関数
 */
export function subscribeToAuthChanges(callback) {
    if (!isInitialized) return;
    onAuthStateChanged(auth, (user) => {
        callback(user);
    });
}

/**
 * Canvas環境用：カスタムトークンでの初期ログイン試行
 */
export async function tryInitialAuth() {
    const initialToken = window.GLOBAL_INITIAL_AUTH_TOKEN;
    if (isInitialized && initialToken) {
        try {
            await signInWithCustomToken(auth, initialToken);
            console.log("カスタムトークンでログインしました");
        } catch (error) {
            console.error("初期認証トークンエラー:", error);
        }
    }
}