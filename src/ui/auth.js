// @ts-nocheck
// @miyter:20251125
// Vite導入に伴い、Firebase SDKのインポートをnpmパッケージ形式に、
// ローカルモジュールのインポートを絶対パス '@' に修正

// --- 修正1: Firebase SDKをラッパーからインポートして一元化 ---
import { 
    signInWithEmailAndPassword,
    signOut,
    signInWithCustomToken,
    onAuthStateChanged,
    updatePassword
} from "../core/firebase-sdk.js";

// --- 修正2: ローカルモジュールへのインポートパスを相対パスに変更 ---
import { auth, isFirebaseInitialized } from '../core/firebase.js'; 
// UI層のヘルパー関数（updatePasswordが依存するため）
import { showMessageModal } from './components.js'; 


// 現在のユーザーID
export let currentUserId = null;

// 認証状態の監視リスナー
// ★注意: app.js が initAuthListener ではなく onAuthStateChanged を直接使用するようになったため、
// この関数は実質未使用だが、他のファイルが呼び出している可能性も考慮し、ロジックを保持する。
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

/**
 * 認証状態に応じてヘッダーUIを更新する
 * (onAuthStateChanged のコールバックとして app.js から呼ばれる)
 * @param {firebase.User | null} user - 認証ユーザーオブジェクト
 */
export function updateAuthUI(user) {
    // ★修正: layout.js に追加された新しいIDを使用
    const loginForm = document.getElementById('login-form-container');
    const userInfo = document.getElementById('user-info');
    const userNameObj = document.getElementById('user-display-name');
    const emailInput = document.getElementById('email-input');
    const passInput = document.getElementById('password-input');
    const logoutBtn = document.getElementById('logout-btn');
    const loginBtn = document.getElementById('email-login-btn'); // ログインボタンも参照

    // 要素がまだ描画されていない場合はスキップ（app.js の onAuthStateChanged が renderLayout() より先に実行された場合）
    if (!loginForm || !userInfo) return;

    if (user) {
        // ログイン時
        loginForm.classList.add('hidden');
        
        // ★修正: hidden を削除し、明示的に flex を追加してレイアウトを修正
        userInfo.classList.remove('hidden');
        userInfo.classList.add('flex'); // <--- ここで flex を追加

        if (userNameObj) {
            // UIDの代わりにメールアドレスを表示
            userNameObj.textContent = user.email || 'ユーザー';
        }
    } else {
        // ログアウト時
        loginForm.classList.remove('hidden');
        userInfo.classList.add('hidden');
        userInfo.classList.remove('flex'); // <--- ここで flex を削除
        
        if (userNameObj) userNameObj.textContent = '';
        
        // フォームクリア
        if (emailInput) emailInput.value = '';
        if (passInput) passInput.value = '';
    }

    // ★追加: イベントリスナーを再設定 (layout.jsのDOM生成後に一度だけ実行)
    if (loginBtn && !loginBtn.hasListener) {
        loginBtn.addEventListener('click', async () => {
            try {
                if (!emailInput.value || !passInput.value) {
                    showMessageModal("メールアドレスとパスワードを入力してください。", null);
                    return;
                }
                await loginWithEmail(emailInput.value, passInput.value);
            } catch (e) {
                showMessageModal("ログインエラー: " + (e.message || "失敗しました"), null);
            }
        });
        loginBtn.hasListener = true; // 重複登録防止フラグ
    }

    if (logoutBtn && !logoutBtn.hasListener) {
        logoutBtn.addEventListener('click', async () => {
            await logout();
        });
        logoutBtn.hasListener = true; // 重複登録防止フラグ
    }
}