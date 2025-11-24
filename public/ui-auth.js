// --- 認証モジュール (更新日: 2025-11-25) ---
import { 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    signInWithCustomToken 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { auth, isInitialized } from './firebase-init.js';

let currentUser = null;
const initialAuthToken = window.GLOBAL_INITIAL_AUTH_TOKEN;

// ユーザー状態監視のリスナー（これが main.js から呼ばれています）
export function initAuthListener(onUserChanged) {
    if (!isInitialized) return;

    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        onUserChanged(user);
    });

    // 初期トークンがあればログイン試行（Canvas環境用）
    if (initialAuthToken) {
        signInWithCustomToken(auth, initialAuthToken).catch(e => console.error("Token Auth Error:", e));
    }
}

// メールログイン
export async function loginWithEmail(email, password) {
    if (!isInitialized) throw new Error("Firebase not initialized");
    return await signInWithEmailAndPassword(auth, email, password);
}

// ログアウト
export async function logout() {
    if (!isInitialized) return;
    await signOut(auth);
}

export function getCurrentUser() {
    return currentUser;
}