// @miyter:20251125
// Vite導入に伴い、Firebase SDKのインポートをnpmパッケージ形式に修正

// --- 修正: CDNパスからnpmパッケージ名に変更 ---
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, setLogLevel } from "firebase/firestore";

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