
/**
 * 更新日: 2025-12-31
 * 内容: TypeScript型チェックの有効化と設定取得ロジックの整理
 */

import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Auth, browserLocalPersistence, browserPopupRedirectResolver, initializeAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

// グローバル定数の型定義
declare global {
    interface Window {
        GLOBAL_FIREBASE_CONFIG?: Record<string, string>;
    }
    const __firebase_config: string | Record<string, string> | undefined;
}

// Viteの環境変数の型定義
interface ImportMetaEnv {
    readonly VITE_FIREBASE_API_KEY?: string;
    readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
    readonly VITE_FIREBASE_PROJECT_ID?: string;
    readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
    readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
    readonly VITE_FIREBASE_APP_ID?: string;
    readonly VITE_FIREBASE_MEASUREMENT_ID?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
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
    // Note: vite-env.d.ts で型定義推奨
    try {
        const env = import.meta.env as unknown as ImportMetaEnv;
        if (env && env.VITE_FIREBASE_API_KEY) {
            return {
                apiKey: env.VITE_FIREBASE_API_KEY,
                authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
                projectId: env.VITE_FIREBASE_PROJECT_ID,
                storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
                messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
                appId: env.VITE_FIREBASE_APP_ID,
                measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
            };
        }
    } catch (e) {
        // 無視して次へ
    }


    // 3. レガシー注入変数 (__firebase_config)
    if (typeof __firebase_config !== 'undefined') {
        try {
            if (typeof __firebase_config === 'object') return __firebase_config;
            return JSON.parse(__firebase_config) as Record<string, string>;
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

// 必須フィールドのチェック (API Key と Project ID)
if (!firebaseConfig?.apiKey || !firebaseConfig?.projectId) {
    const msg = "[Firebase] Configuration is missing required fields (apiKey, projectId). Application cannot start.";
    console.error(msg, firebaseConfig);
    throw new Error(msg);
}

// アプリ初期化 (シングルトンパターン)
let appInstance: FirebaseApp;
if (getApps().length > 0) {
    appInstance = getApps()[0];
} else {
    appInstance = initializeApp(firebaseConfig);
}


// サービスのエクスポート
export const app: FirebaseApp = appInstance;


// Optimize Auth initialization
// Use browserLocalPersistence to prefer IndexedDB/LocalStorage and avoid some iframe reliance if possible
// Also providing popupRedirectResolver explicitly might help tree-shaking (though less likely in this context)
export const auth: Auth = initializeAuth(app, {
    persistence: browserLocalPersistence,
    popupRedirectResolver: browserPopupRedirectResolver
});

export const db: Firestore = getFirestore(app);

// 後方互換性のため
export const isFirebaseInitialized = true;
