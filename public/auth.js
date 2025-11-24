// --- 認証モジュール (更新日: 2025-11-25) ---
import { 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    signInWithCustomToken,
    updatePassword // 追加
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { auth, isInitialized } from './firebase-init.js';

let currentUser = null;
const initialAuthToken = window.GLOBAL_INITIAL_AUTH_TOKEN;

export function initAuthListener(onUserChanged) {
    if (!isInitialized) return;

    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        onUserChanged(user);
    });

    if (initialAuthToken) {
        signInWithCustomToken(auth, initialAuthToken).catch(e => console.error("Token Auth Error:", e));
    }
}

export async function loginWithEmail(email, password) {
    if (!isInitialized) throw new Error("Firebase not initialized");
    return await signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
    if (!isInitialized) return;
    await signOut(auth);
}

// ★追加: パスワード更新
export async function updateUserPassword(newPassword) {
    if (!auth.currentUser) throw new Error("ログインしていません");
    await updatePassword(auth.currentUser, newPassword);
}

export function getCurrentUser() {
    return currentUser;
}