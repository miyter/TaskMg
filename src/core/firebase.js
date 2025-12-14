// @ts-nocheck
// Firebase初期化・インスタンス管理
// SDKのインポートはすべて core/firebase-sdk.js 経由で行う

import { initializeApp, getAuth, getFirestore } from './firebase-sdk.js';

// エクスポートする変数を定義 (初期化されるまではundefined)
export let app;
export let auth;
export let db;
export let isFirebaseInitialized = false;

/**
 * Firebaseを初期化する関数
 * アプリ起動時（main.js/app.jsのinitializeApp冒頭など）に明示的に呼び出す
 */
export function initializeFirebase() {
    // 既に初期化済みなら何もしない
    if (isFirebaseInitialized) {
        console.log("Firebase is already initialized.");
        return;
    }

    // Configの取得: window.GLOBAL_FIREBASE_CONFIG または Canvas環境の __firebase_config をサポート
    let firebaseConfig = null;
    
    if (typeof window !== 'undefined' && window.GLOBAL_FIREBASE_CONFIG) {
        firebaseConfig = window.GLOBAL_FIREBASE_CONFIG;
    } else if (typeof __firebase_config !== 'undefined') {
        try {
            firebaseConfig = JSON.parse(__firebase_config);
        } catch (e) {
            console.error("Failed to parse __firebase_config", e);
        }
    }

    if (firebaseConfig && firebaseConfig.apiKey) {
        try {
            app = initializeApp(firebaseConfig);
            auth = getAuth(app);
            db = getFirestore(app);
            isFirebaseInitialized = true;
            console.log("Firebase initialized successfully.");
        } catch (e) {
            console.error("Firebase initialization error:", e);
            throw e; // 初期化失敗は致命的なので例外を投げる
        }
    } else {
        const msg = "Firebase config not found. Make sure window.GLOBAL_FIREBASE_CONFIG or __firebase_config is set.";
        console.error(msg);
        // 設定がない場合もエラーにする
        throw new Error(msg);
    }
}

/**
 * 初期化済みのFirebaseインスタンスを取得するヘルパー
 * 初期化確認を含みたい場合に使用
 */
export function getFirebase() {
    if (!isFirebaseInitialized) {
        throw new Error("Firebase not initialized. Call initializeFirebase() first.");
    }
    return { app, auth, db };
}