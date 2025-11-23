// --- 1. Firebase SDK のインポートと初期設定 ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut, 
    signInWithCustomToken,
    signInWithEmailAndPassword // ★Email/Password認証のために追加
} 
from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    query, 
    onSnapshot, 
    setLogLevel 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// ログレベルをデバッグに設定
setLogLevel('debug');

// グローバル変数から設定を取得
const firebaseConfig = window.GLOBAL_FIREBASE_CONFIG || {};
const initialAuthToken = window.GLOBAL_INITIAL_AUTH_TOKEN;
const appId = window.GLOBAL_APP_ID;

let isFirebaseInitialized = false; 
// Firebaseアプリの初期化
let app, auth, db;

if (firebaseConfig.apiKey) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        isFirebaseInitialized = true;
        console.log("Firebase/Firestore 初期化成功。");
    } catch (e) {
        console.error("Firebase初期化中にエラー:", e);
    }
} else {
    // APIキーがない場合は初期化をスキップ
    console.error("致命的なエラー: Firebase APIキーが設定されていません。index.htmlのインラインスクリプトを確認してください。");
}

// ログイン状態とユーザーIDを保持するための変数
let userId = null; 

// UI要素の参照
const loginFormContainer = document.getElementById('login-form-container');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const emailLoginBtn = document.getElementById('email-login-btn');
const loginErrorMessage = document.getElementById('login-error-message');
const userInfoDiv = document.getElementById('user-info');
const userDisplayNameSpan = document.getElementById('user-display-name');
const taskList = document.getElementById('task-list');
const taskTitleInput = document.getElementById('task-title-input');
const addTaskBtn = document.getElementById('add-task-btn');
const logoutBtn = document.getElementById('logout-btn');


// --- 2. 認証処理 ---

/**
 * Email/Passwordでログインを実行
 */
async function signInWithEmailPassword() {
    if (!isFirebaseInitialized) {
        alert("Firebaseサービスが利用できません。初期化エラーを確認してください。");
        return;
    }

    const email = emailInput ? emailInput.value : '';
    const password = passwordInput ? passwordInput.value : '';

    if (!email || !password) {
        if (loginErrorMessage) loginErrorMessage.textContent = 'メールアドレスとパスワードを入力してください。';
        return;
    }
    
    if (loginErrorMessage) loginErrorMessage.textContent = ''; // エラーをクリア

    try {
        // ★ Email/Passwordでサインイン
        const result = await signInWithEmailAndPassword(auth, email, password);
        console.log("Email/Password認証成功:", result.user.email);
    } catch (error) {
        console.error("Email/Password認証エラー:", error.code, error.message);
        
        let displayMessage = "ログインに失敗しました。";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            displayMessage = "メールアドレスまたはパスワードが違います。";
        }
        
        if (loginErrorMessage) loginErrorMessage.textContent = displayMessage;
    }
}

// ログアウト関数
async function handleSignOut() {
    if (!isFirebaseInitialized) return;
    try {
        await signOut(auth);
        // ログアウト後、フォームをクリア
        if (emailInput) emailInput.value = '';
        if (passwordInput) passwordInput.value = '';
        console.log("ログアウトしました。");
    } catch (error) {
        console.error("ログアウト中にエラーが発生しました:", error);
    }
}

// 認証処理（Canvas環境向け初期化）
async function initializeAuth() {
    if (!isFirebaseInitialized) return;
    try {
        // __initial_auth_tokenがある場合はカスタム認証でログインを試みる
        if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
        }
    } catch (error) {
        console.error("初期認証エラー:", error);
    }
}

// 認証状態の監視
if (isFirebaseInitialized) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // ログイン済み
            userId = user.uid;
            // Eメール認証なので、メールアドレスをDisplayNameとして使用
            const displayName = user.email || (user.isAnonymous ? "ゲスト" : "ユーザー");
            console.log("ユーザーログイン検知:", userId);
            
            // UIの更新: ログイン状態
            if (loginFormContainer) loginFormContainer.classList.add('hidden');
            if (userInfoDiv) userInfoDiv.classList.remove('hidden');
            if (userDisplayNameSpan) userDisplayNameSpan.textContent = `ようこそ、${displayName} さん (UID: ${userId.substring(0, 8)}...)`; 
            
            // 認証完了後にタスクのリアルタイムリスナーを開始
            listenToTasks(); 

        } else {
            // ログアウトまたは未ログイン
            userId = null;
            console.log("ログアウト状態検知");

            // UIの更新: ログアウト状態
            if (loginFormContainer) loginFormContainer.classList.remove('hidden');
            if (userInfoDiv) userInfoDiv.classList.add('hidden');
            if (taskList) taskList.innerHTML = '<li class="p-4 bg-gray-100 rounded-lg text-gray-500 italic">タスクがありません。ログインして最初のタスクを追加してください。</li>';
            if (loginErrorMessage) loginErrorMessage.textContent = '';
        }
    });
}


// 認証初期化キック
initializeAuth();


// --- 3. Firestore データ操作関数 ---

function getTaskCollectionRef(currentUserId) {
    if (!db) throw new Error("Firestore is not initialized.");
    const currentAppId = typeof __app_id !== 'undefined' ? __app_id : appId;
    const path = `/artifacts/${currentAppId}/users/${currentUserId}/tasks`;
    return collection(db, path);
}

// データの追加
async function addTask(taskTitle) {
    if (!userId) {
        alert("タスクを追加するにはログインが必要です。");
        return;
    }
    if (!taskTitle.trim()) {
        return;
    }
    
    try {
        await addDoc(getTaskCollectionRef(userId), {
            title: taskTitle.trim(),
            status: "todo",
            createdAt: new Date(),
            ownerId: userId 
        });
        if (taskTitleInput) taskTitleInput.value = '';
        console.log("タスク追加成功");
    } catch (e) {
        console.error("タスク追加エラー:", e);
        if (e.code === 'permission-denied') {
            alert("書き込み権限がありません。セキュリティルールを確認してください。");
        }
    }
}


// データのリアルタイムな読み込みとUI反映
function listenToTasks() {
    if (!userId || !db) return;

    try {
        const q = query(getTaskCollectionRef(userId));
        
        onSnapshot(q, (snapshot) => {
            if (!taskList) return;
            
            taskList.innerHTML = '';
            if (snapshot.empty) {
                 taskList.innerHTML = '<li class="p-4 bg-gray-100 rounded-lg text-gray-500 italic">タスクがありません。追加してください。</li>';
                 return;
            }

            snapshot.docs.forEach((doc) => {
                const task = doc.data();
                const taskId = doc.id;
                const taskElement = document.createElement('li');
                
                taskElement.className = 'p-4 border-l-4 border-blue-500 bg-white rounded-lg shadow flex justify-between items-center transition duration-150 hover:shadow-lg';
                taskElement.setAttribute('data-id', taskId);
                
                taskElement.innerHTML = `
                    <span class="text-gray-800">${task.title}</span>
                    <span class="text-xs text-gray-400">(${task.status})</span>
                `;
                taskList.appendChild(taskElement);
            });
            console.log("タスクリスト更新完了");

        }, (error) => {
            console.error("スナップショットリスナーエラー:", error);
        });
    } catch (e) {
        console.error("Firestore接続エラー:", e);
    }
}


// --- 4. UIイベントリスナーの設定 ---

document.addEventListener('DOMContentLoaded', () => {
    // 認証ボタン
    if (emailLoginBtn) emailLoginBtn.addEventListener('click', signInWithEmailPassword);
    if (logoutBtn) logoutBtn.addEventListener('click', handleSignOut);

    // タスク追加ボタン
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            const title = taskTitleInput ? taskTitleInput.value : "";
            addTask(title);
        });
    }
});