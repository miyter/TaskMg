// @ts-nocheck
/**
 * 更新日: 2025-12-30
 * 内容: 自動シングルトン初期化へ変更 (Undefined Error対策)
 */

import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

// グローバル定数の型定義
declare global {
    interface Window {
        GLOBAL_FIREBASE_CONFIG?: any;
    }
    const __firebase_config: string | object | undefined;
}

/**
 * 環境に応じたFirebase Configの取得
 */
function getConfiguration() {
    // 1. index.html等で注入されたグローバル設定を最優先
    if (typeof window !== 'undefined' && window.GLOBAL_FIREBASE_CONFIG && window.GLOBAL_FIREBASE_CONFIG.apiKey) {
        return window.GLOBAL_FIREBASE_CONFIG;
    }

    // 2. Vite環境変数 (import.meta.env)
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
    // @ts-ignore
    if (typeof __firebase_config !== 'undefined') {
        try {
            // @ts-ignore
            if (typeof __firebase_config === 'object') return __firebase_config;
            // @ts-ignore
            return JSON.parse(__firebase_config);
        } catch (e) {
            console.error("[Firebase] Config parse failed (legacy):", e);
            return null;
        }
    }

    console.error("[Firebase] All config sources failed. Check index.html injection.");
    return null;
}

// 設定取得
const firebaseConfig = getConfiguration();

if (!firebaseConfig?.apiKey) {
    const msg = "[Firebase] Configuration is missing or invalid. Application cannot start.";
    console.error(msg);
    throw new Error(msg);
}

// アプリ初期化 (シングルトンパターン)
// 既存のアプリインスタンスがある場合は再利用し、二重初期化を防ぐ
let appInstance: FirebaseApp;
if (getApps().length > 0) {
    appInstance = getApps()[0];
    console.log("[Firebase] Using existing app instance.");
} else {
    appInstance = initializeApp(firebaseConfig);
    console.log("[Firebase] Initialized new app instance.");
}

// サービスのエクスポート (定数として直接公開)
export const app: FirebaseApp = appInstance;
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

// 後方互換性のため（使用箇所がなければ削除可）
export const isFirebaseInitialized = true;
