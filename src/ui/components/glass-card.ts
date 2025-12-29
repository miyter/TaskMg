// @miyter:20251221
// Glassmorphismデザインの共通カードコンポーネント
import { UI_STYLES } from '../core/ui-style-constants';

/**
 * すりガラス効果を持つカードHTMLを生成する
 * @param {string} contentHTML - カード内部に挿入するHTML
 * @param {string} extraClasses - 追加のTailwindクラス
 * @returns {string} HTML文字列
 */
export function createGlassCard(contentHTML: string, extraClasses: string = ''): string {
    // 共通スタイル:
    // - 背景色と透過度: bg-white/70 dark:bg-gray-900/60
    // - ぼかし効果: backdrop-blur-md
    // - 境界線の光沢: border-white/20
    return `
        <div class="${UI_STYLES.CARD.GLASS} ${extraClasses}">
            ${contentHTML}
        </div>
    `;
}
