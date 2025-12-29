/**
 * ウィンドウ管理モジュール
 * マルチウィンドウ機能を提供し、別ウィンドウでのビュー表示を制御する
 */

/**
 * 指定されたビューモードで新しいウィンドウを開く
 * @param {string} viewMode - ビューモード ('wizard', 'target-dashboard', 'task-list' など)
 * @param {Object} params - 追加のクエリパラメータ
 */
export function openInNewWindow(viewMode, params = {}) {
    // 現在のURLのベースを取得
    const baseUrl = window.location.origin + window.location.pathname;

    // クエリパラメータを構築
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('mode', 'window');
    searchParams.set('view', viewMode);

    // 追加パラメータをセット
    Object.entries(params).forEach(([key, value]) => {
        searchParams.set(key, value);
    });

    const url = `${baseUrl}?${searchParams.toString()}`;

    // ウィンドウサイズの設定（必要に応じて調整）
    const width = 1200;
    const height = 800;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;

    window.open(url, `TaskMg_${viewMode}_${Date.now()}`, features);
}

/**
 * 現在のウィンドウモードを取得する
 * @returns {string} 'main' (通常) または 'window' (別ウィンドウ)
 */
export function getWindowMode() {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') || 'main';
}

/**
 * 現在指定されているビューモードを取得する
 * @returns {string} ビューモードID
 */
export function getInitialViewMode() {
    const params = new URLSearchParams(window.location.search);
    return params.get('view');
}

/**
 * 別ウィンドウモードかどうかを判定
 */
export function isWindowMode() {
    return getWindowMode() === 'window';
}
