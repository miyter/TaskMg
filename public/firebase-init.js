// 更新日: 2025-11-24
// 役割: Firebaseアプリの初期化を行い、authとdbインスタンスをエクスポートします。

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// ログレベルをデバッグに設定（開発中便利です）
setLogLevel('debug');

// グローバル変数から設定を取得（index.htmlで定義されています）
const firebaseConfig = window.GLOBAL_FIREBASE_CONFIG || {};

let app;
let auth;
let db;
let isInitialized = false;

if (firebaseConfig.apiKey) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        isInitialized = true;
        console.log("✅ Firebase/Firestore 初期化成功");
    } catch (e) {
        console.error("❌ Firebase初期化エラー:", e);
    }
} else {
    console.error("❌ エラー: APIキーが見つかりません。index.htmlの設定を確認してください。");
}

// 他のモジュールで使えるようにエクスポート
export { auth, db, isInitialized };