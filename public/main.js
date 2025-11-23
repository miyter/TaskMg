// --- 1. Firebase SDK のインポートと初期設定 ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { 
    getAuth, 
    signInAnonymously, 
    onAuthStateChanged, 
    signOut, 
    signInWithCustomToken,
    GoogleAuthProvider, 
    signInWithPopup // ★ポップアップ認証を使用
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

// 環境変数から設定を取得
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// ★重要: authDomain はデフォルト（firebaseapp.com）のままにします
// これにより、Google認証は信頼されたFirebaseドメイン上で実行されます。
// firebaseConfig.authDomain = "..." // 上書き不要

// Firebaseアプリの初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Google認証プロバイダーの定義
const googleProvider = new GoogleAuthProvider();

// ログイン状態とユーザーIDを保持するための変数
let userId = null; 

// UI要素の参照
const googleLoginBtn = document.getElementById('google-login-btn');
const userInfoDiv = document.getElementById('user-info');
const userDisplayNameSpan = document.getElementById('user-display-name');
const taskList = document.getElementById('task-list');
const taskTitleInput = document.getElementById('task-title-input');
const addTaskBtn = document.getElementById('add-task-btn');
const logoutBtn = document.getElementById('logout-btn');


// --- 2. 認証処理 ---

// Google認証（ポップアップ）を開始する関数 
async function signInWithGoogle() {
    try {
        console.log("Google認証ポップアップを開始します...");
        // ポップアップでサインイン
        const result = await signInWithPopup(auth, googleProvider);
        console.log("認証成功:", result.user.displayName);
        // 成功時の処理は onAuthStateChanged が自動で検知します
    } catch (error) {
        console.error("Google認証エラー:", error.code, error.message);
        
        // ポップアップブロックのエラーハンドリング
        if (error.code === 'auth/popup-blocked') {
            alert("ポップアップがブロックされました。\nブラウザのアドレスバーにある「ポップアップブロック」アイコンをクリックして、このサイトを許可してください。");
        } else if (error.code === 'auth/popup-closed-by-user') {
            console.log("ユーザーがポップアップを閉じました");
        } else {
            alert(`認証に失敗しました: ${error.message}`);
        }
    }
}

// ログアウト関数
async function handleSignOut() {
    try {
        await signOut(auth);
        console.log("ログアウトしました。");
    } catch (error) {
        console.error("ログアウト中にエラーが発生しました:", error);
    }
}

// 認証処理（Canvas環境向け初期化）
async function initializeAuth() {
    try {
        if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
        } else if (!auth.currentUser) { 
            // 永続化されたセッションがない場合のみ匿名認証
            // ポップアップ認証はIndexedDBにセッションを保存するため、
            // リロード後も auth.currentUser が復元されるはずです。
            // ここですぐに匿名認証してしまうと、Googleログイン情報が上書きされる可能性があるため、
            // 少し待つか、明示的なログインを待つのがベターですが、
            // 今回はシンプルに「未ログインなら匿名」とします。
            
            // ★改善: 少し待ってから匿名認証（SDKの初期化待ち）
            // しかしCanvas環境では即時性が求められるため、onAuthStateChangedに任せます。
            // await signInAnonymously(auth); 
            // ↑ Google認証をメインにするため、勝手な匿名ログインは一旦無効化して様子を見ます。
            // 必要であればコメントアウトを外してください。
        }
    } catch (error) {
        console.error("初期認証エラー:", error);
    }
}

// 認証状態の監視
onAuthStateChanged(auth, (user) => {
    if (user) {
        // ログイン済み
        userId = user.uid;
        const displayName = user.displayName || (user.isAnonymous ? "ゲスト" : "ユーザー");
        console.log("ユーザーログイン検知:", userId);
        
        // UIの更新: ログイン状態
        if (googleLoginBtn) googleLoginBtn.classList.add('hidden');
        if (userInfoDiv) userInfoDiv.classList.remove('hidden');
        if (userDisplayNameSpan) userDisplayNameSpan.textContent = `ようこそ、${displayName} さん`; 
        
        // 認証完了後にタスクのリアルタイムリスナーを開始
        listenToTasks(); 

    } else {
        // ログアウトまたは未ログイン
        userId = null;
        console.log("ログアウト状態検知");

        // UIの更新: ログアウト状態
        if (googleLoginBtn) googleLoginBtn.classList.remove('hidden');
        if (userInfoDiv) userInfoDiv.classList.add('hidden');
        if (taskList) taskList.innerHTML = '<li class="p-4 bg-gray-100 rounded-lg text-gray-500 italic">タスクがありません。ログインして最初のタスクを追加してください。</li>';
    }
});

// 認証初期化キック
initializeAuth();


// --- 3. Firestore データ操作関数 ---

function getTaskCollectionRef(currentUserId) {
    // Canvas環境変数 __app_id を安全に使用
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
        return; // 空文字なら何もしない
    }
    
    try {
        await addDoc(getTaskCollectionRef(userId), {
            title: taskTitle.trim(),
            status: "todo",
            createdAt: new Date(),
            ownerId: userId 
        });
        if (taskTitleInput) taskTitleInput.value = ''; // 入力欄をクリア
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
    if (!userId) return;

    const q = query(getTaskCollectionRef(userId));
    
    // リアルタイムリスナーを設定
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
}


// --- 4. UIイベントリスナーの設定 ---

document.addEventListener('DOMContentLoaded', () => {
    // 認証ボタン
    if (googleLoginBtn) googleLoginBtn.addEventListener('click', signInWithGoogle);
    if (logoutBtn) logoutBtn.addEventListener('click', handleSignOut);

    // タスク追加ボタン
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            const title = taskTitleInput ? taskTitleInput.value : "";
            addTask(title);
        });
    }
});