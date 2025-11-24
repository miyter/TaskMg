// --- Firebase初期化設定 ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// デバッグログを有効化（開発用）
setLogLevel('debug');

const firebaseConfig = window.GLOBAL_FIREBASE_CONFIG || {};

export let app, auth, db;
export let isFirebaseInitialized = false;

if (firebaseConfig.apiKey) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        isFirebaseInitialized = true;
        console.log("Firebase initialized successfully.");
    } catch (e) {
        console.error("Firebase initialization error:", e);
    }
} else {
    console.error("Firebase config not found.");
}