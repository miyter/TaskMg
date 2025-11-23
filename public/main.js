// --- 1. Firebase SDK のインポートと初期設定 ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { 
    getAuth, 
    signInAnonymously, 
    onAuthStateChanged, 
    signOut, 
    signInWithCustomToken,
    GoogleAuthProvider, 
    signInWithPopup 
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

// ★【修正ポイント】グローバル変数 __firebase_config を安全にパース
let firebaseConfig = {};
let isFirebaseInitialized = false; // Firebaseが正常に初期化されたかを示すフラグ
try {
    if (typeof __firebase_config !== 'undefined' && __firebase_config) {
        firebaseConfig = JSON.parse(__firebase_config);
    }
} catch (e) {
    console.error("Firebase configのパースに失敗しました。このエラーは設定の問題を示唆しています:", e);
}

const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

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
        // 初期化失敗時、isFirebaseInitialized は false のまま
    }
} else {
    // APIキーがない場合は初期化をスキップし、エラーメッセージをコンソールに出力
    console.error("致命的なエラー: Firebase APIキーが設定されていません。Firebase SDKは動作しません。");
}

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
    if (!isFirebaseInitialized) {
        alert("Firebaseサービスが利用できません。\n原因: APIキーが設定されていないか、初期化に失敗しています。");
        return;
    }
    try {
        console.log("Google認証ポップアップを開始します...");
        const result = await signInWithPopup(auth, googleProvider);
        console.log("認証成功:", result.user.displayName);
    } catch (error) {
        console.error("Google認証エラー:", error.code, error.message);
        
        if (error.code === 'auth/popup-blocked') {
            alert("ポップアップがブロックされました。\nブラウザの設定でこのサイトを許可してください。");
        } else if (error.code === 'auth/popup-closed-by-user') {
            console.log("ユーザーがポップアップを閉じました");
        } else {
            alert(`認証に失敗しました: ${error.message}`);
        }
    }
}

// ログアウト関数
async function handleSignOut() {
    if (!isFirebaseInitialized) return;
    try {
        await signOut(auth);
        console.log("ログアウトしました。");
    } catch (error) {
        console.error("ログアウト中にエラーが発生しました:", error);
    }
}

// 認証処理（Canvas環境向け初期化）
async function initializeAuth() {
    if (!isFirebaseInitialized) return;
    try {
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
            const displayName = user.displayName || (user.isAnonymous ? "ゲスト" : "ユーザー");
            console.log("ユーザーログイン検知:", userId);
            
            // UIの更新: ログイン状態
            if (googleLoginBtn) googleLoginBtn.classList.add('hidden');
            if (userInfoDiv) userInfoDiv.classList.remove('hidden');
            if (userDisplayNameSpan) userDisplayNameSpan.textContent = `ようこそ、${displayName} さん (UID: ${userId.substring(0, 8)}...)`; 
            
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