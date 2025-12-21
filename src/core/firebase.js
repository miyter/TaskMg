// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: 設定パース処理の安全性向上
 */

import { initializeApp, getAuth, getFirestore } from './firebase-sdk.js';

export let app;
export let auth;
export let db;
export let isFirebaseInitialized = false;

/**
 * アプリ起動時に呼び出し、Firebase接続を確立する
 */
export function initializeFirebase() {
    if (isFirebaseInitialized) return;

    const firebaseConfig = getConfiguration();

    if (firebaseConfig?.apiKey) {
        try {
            app = initializeApp(firebaseConfig);
            auth = getAuth(app);
            db = getFirestore(app);
            isFirebaseInitialized = true;
            console.log("[Firebase] Initialized successfully.");
        } catch (e) {
            console.error("[Firebase] Initialization error:", e);
            throw e;
        }
    } else {
        const msg = "Firebase configuration is missing or invalid.";
        console.error(msg);
        throw new Error(msg);
    }
}

/**
 * 環境に応じたFirebase Configの取得
 */
function getConfiguration() {
    if (typeof window !== 'undefined' && window.GLOBAL_FIREBASE_CONFIG) {
        return window.GLOBAL_FIREBASE_CONFIG;
    }
    
    if (typeof __firebase_config !== 'undefined') {
        try {
            // 文字列以外が渡された場合のガード
            if (typeof __firebase_config === 'object') return __firebase_config;
            return JSON.parse(__firebase_config);
        } catch (e) {
            console.error("[Firebase] Config parse failed:", e);
            return null;
        }
    }
    return null;
}

/**
 * 初期化済みインスタンスを取得する
 */
export function getFirebase() {
    if (!isFirebaseInitialized) {
        throw new Error("Firebase not initialized. Call initializeFirebase() first.");
    }
    return { app, auth, db };
}