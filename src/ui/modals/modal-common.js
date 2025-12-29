/**
 * モーダル共通処理モジュール
 * すべてのモーダルで共通して使用する初期化処理を提供
 */

import { applyUISettingsToModal } from '../core/ui-settings-manager.js';

/**
 * モーダルオーバーレイを作成し、UI設定を適用
 * @param {string} modalId - モーダルのID
 * @param {string} htmlContent - モーダルのHTMLコンテンツ
 * @returns {HTMLElement} 作成されたオーバーレイ要素
 */
export function createModalOverlay(modalId, htmlContent) {
    // 既存のモーダルを削除
    document.getElementById(modalId)?.remove();

    const overlay = document.createElement('div');
    overlay.id = modalId;
    overlay.innerHTML = htmlContent;

    // UI設定を適用（フォント、サイズ、密度はbodyから継承されるが、明示的に適用も可能）
    applyUISettingsToModal(overlay);

    document.body.appendChild(overlay);

    return overlay;
}

/**
 * モーダルの基本的なクローズ処理をセットアップ
 * @param {HTMLElement} overlay - モーダルオーバーレイ要素
 * @param {Function} onClose - クローズ時のコールバック（オプション）
 * @returns {Function} クローズ関数
 */
export function setupModalClose(overlay, onClose = null) {
    const close = () => {
        overlay.remove();
        if (onClose) onClose();
    };

    // オーバーレイクリックでクローズ
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });

    // Escキーでクローズ
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            close();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);

    return close;
}

/**
 * モーダル内のフォーカス管理
 * @param {HTMLElement} overlay - モーダルオーバーレイ要素
 * @param {string} focusSelector - フォーカスする要素のセレクタ
 * @param {boolean} selectText - テキストを選択するか（デフォルト: false）
 */
export function setupModalFocus(overlay, focusSelector, selectText = false) {
    requestAnimationFrame(() => {
        const element = overlay.querySelector(focusSelector);
        if (element) {
            element.focus();
            if (selectText && typeof element.select === 'function') {
                element.select();
            }
        }
    });
}

/**
 * モーダルの完全な初期化（作成 + クローズ設定 + フォーカス）
 * @param {string} modalId - モーダルのID
 * @param {string} htmlContent - モーダルのHTMLコンテンツ
 * @param {Object} options - オプション設定
 * @param {string} options.focusSelector - フォーカスする要素のセレクタ
 * @param {boolean} options.selectText - テキストを選択するか
 * @param {Function} options.onClose - クローズ時のコールバック
 * @returns {Object} { overlay, close } - オーバーレイ要素とクローズ関数
 */
export function initializeModal(modalId, htmlContent, options = {}) {
    const {
        focusSelector = null,
        selectText = false,
        onClose = null
    } = options;

    const overlay = createModalOverlay(modalId, htmlContent);
    const close = setupModalClose(overlay, onClose);

    if (focusSelector) {
        setupModalFocus(overlay, focusSelector, selectText);
    }

    return { overlay, close };
}
