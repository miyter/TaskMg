// --- Firebase SDK 初期化モジュール ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

setLogLevel('debug');

const firebaseConfig = window.GLOBAL_FIREBASE_CONFIG || {};
export const appId = window.GLOBAL_APP_ID;

let app, auth, db;
let isInitialized = false;

if (firebaseConfig.apiKey) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        isInitialized = true;
        console.log("Firebase/Firestore 初期化成功。");
    } catch (e) {
        console.error("Firebase初期化中にエラー:", e);
    }
} else {
    console.error("Firebase APIキー設定エラー");
}

export { auth, db, isInitialized };