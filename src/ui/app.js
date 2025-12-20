// @ts-nocheck
// @miyter:20251221
// アプリケーションのエントリーポイント (デリゲーター)

import { runInitialization } from './core/AppInitializer.js';

/**
 * アプリケーションの初期化プロセスを開始する
 * ロジックの実体は AppInitializer に委譲し、ここはインターフェースに徹する
 */
export function initializeApp() {
    runInitialization();
}