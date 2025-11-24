// --- 認証ロジック ---
import { 
    signInWithEmailAndPassword,
    signOut,
    signInWithCustomToken,
    onAuthStateChanged,
    updatePassword
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// ★修正: 相対パス './firebase.js' が原因でエラーを引き起こすため、
//         モジュール間の参照エラーを防ぐために一旦直接インポートに戻します。
import { auth, isFirebaseInitialized } from '../core/firebase.js'; 

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
    const initialToken = window.GLOBAL_INITIAL_AUTH_TOKEN;
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

// ユーザーパスワードの更新機能
export async function updateUserPassword(newPassword) {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("認証されていません。");
    }
    return await updatePassword(user, newPassword);
}