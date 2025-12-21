// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: Config取得ロジックの優先順位修正（Global -> Env -> Legacy）
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
    // 1. index.html等で注入されたグローバル設定を最優先
    if (typeof window !== 'undefined' && window.GLOBAL_FIREBASE_CONFIG) {
        return window.GLOBAL_FIREBASE_CONFIG;
    }

    // 2. Vite環境変数 (import.meta.env)
    // 注意: 環境によっては import.meta が使用できない場合があるため try-catch
    try {
        // @ts-ignore
        if (import.meta && import.meta.env) {
            // @ts-ignore
            const env = import.meta.env;
            const envConfig = {
                apiKey: env.VITE_FIREBASE_API_KEY,
                authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
                projectId: env.VITE_FIREBASE_PROJECT_ID,
                storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
                messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
                appId: env.VITE_FIREBASE_APP_ID,
                measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
            };
            if (envConfig.apiKey) {
                return envConfig;
            }
        }
    } catch (e) {
        // 無視して次へ
    }

    // 3. レガシー注入変数 (__firebase_config)
    if (typeof __firebase_config !== 'undefined') {
        try {
            if (typeof __firebase_config === 'object') return __firebase_config;
            return JSON.parse(__firebase_config);
        } catch (e) {
            console.error("[Firebase] Config parse failed (legacy):", e);
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