// @ts-nocheck
// @miyter:20251129
// アプリケーションのエントリーポイント (リファクタリング版)

// 初期化ロジックをコアモジュールに委譲
import { runInitialization } from './core/AppInitializer.js';

export function initializeApp() {
    // アプリケーションの初期化プロセスを開始
    runInitialization();
}