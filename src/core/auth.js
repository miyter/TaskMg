// @ts-nocheck
// @miyter:20251129

// 修正: SDKラッパーからインポートして一元管理 (二重ロード防止)
import { 
    signInWithEmailAndPassword,
    signOut,
    signInWithCustomToken,
    onAuthStateChanged,
    updatePassword
} from "./firebase-sdk.js";

// 相対パスを維持
import { auth, isFirebaseInitialized } from './firebase.js'; 
// UI層のヘルパー関数（updatePasswordが依存するため）
import { showMessageModal } from '../ui/components.js'; 


// 現在のユーザーID
export let currentUserId = null;

// 認証状態の監視リスナー
export function initAuthListener(onLogin, onLogout) {
    if (!isFirebaseInitialized) return;

    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUserId = user.uid;
            onLogin(user);
        } else {
            currentUserId = null;
            onLogout();
        }
    });

    // Canvas環境用の初期トークンログイン
    // 修正: window.GLOBAL... または __initial_auth_token を安全に取得
    const initialToken = (typeof window !== 'undefined' && window.GLOBAL_INITIAL_AUTH_TOKEN) || (typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null);
    
    if (initialToken) {
        signInWithCustomToken(auth, initialToken).catch(console.error);
    }
}

export async function loginWithEmail(email, password) {
    if (!isFirebaseInitialized) throw new Error("Firebase not initialized");
    return await signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
    if (!isFirebaseInitialized) return;
    await signOut(auth);
}

/**
 * ユーザーパスワードの更新機能 (Storeラッパー対応)
 * @param {string} newPassword - 新しいパスワード
 */
export async function updateUserPassword(newPassword) {
    const user = auth.currentUser;
    if (!user) {
        showMessageModal("エラー", "認証されていません。", "error");
        // ラッパーが例外を補足し、UI側で処理を継続できるようにする
        throw new Error("認証されていません。");
    }
    
    try {
        await updatePassword(user, newPassword);
        showMessageModal("成功", "パスワードが正常に変更されました。", "success");
    } catch (error) {
        console.error("パスワード変更エラー:", error);
        let message = "パスワードの変更に失敗しました。";
        if (error.code === 'auth/requires-recent-login') {
            message = "セキュリティ保護のため、パスワード変更には再ログインが必要です。一度ログアウトし、再度ログインしてから設定画面を開いてください。";
        }
        showMessageModal("エラー", message, "error");
        throw error;
    }
}