// @ts-nocheck
/**
 * GlassmorphismデザインのカードHTMLを生成する共通コンポーネント
 * * @param {string} contentHTML - カード内部のHTML
 * @param {string} extraClasses - 追加のクラス (paddingやmarginなど)
 * @returns {string} HTML文字列
 */
export function createGlassCard(contentHTML, extraClasses = '') {
    // 共通のデザイン定義
    // bg-white/70 dark:bg-gray-900/60 : 背景色と透過度
    // backdrop-blur-md : すりガラス効果
    // border-white/20 : 境界線の光沢
    return `
        <div class="bg-white/70 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-800/30 ${extraClasses}">
            ${contentHTML}
        </div>
    `;
}