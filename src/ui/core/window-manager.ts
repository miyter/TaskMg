/**
 * ウィンドウ管理モジュール
 * マルチウィンドウ機能を提供し、別ウィンドウでのビュー表示を制御する
 * TypeScript化: 2025-12-29
 */

interface WindowParams {
    [key: string]: string;
}

/**
 * 指定されたビューモードで新しいウィンドウを開く
 */
export function openInNewWindow(viewMode: string, params: WindowParams = {}): void {
    const baseUrl = window.location.origin + window.location.pathname;

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('mode', 'window');
    searchParams.set('view', viewMode);

    Object.entries(params).forEach(([key, value]) => {
        searchParams.set(key, value);
    });

    const url = `${baseUrl}?${searchParams.toString()}`;

    const width = 1200;
    const height = 800;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;

    window.open(url, `TaskMg_${viewMode}_${Date.now()}`, features);
}

/**
 * 現在のウィンドウモードを取得する
 */
export function getWindowMode(): string {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') || 'main';
}

/**
 * 現在指定されているビューモードを取得する
 */
export function getInitialViewMode(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('view');
}

/**
 * 別ウィンドウモードかどうかを判定
 */
export function isWindowMode(): boolean {
    return getWindowMode() === 'window';
}
