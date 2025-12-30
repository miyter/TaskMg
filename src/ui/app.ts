/**
 * アプリケーション・デリゲーター
 */
import { runInitialization } from './core/AppInitializer';

/**
 * アプリケーションの初期化を開始
 */
export function initializeApp(): void {
    // 実体はAppInitializerに委譲し、クリーンなインターフェースを維持
    runInitialization();
}
