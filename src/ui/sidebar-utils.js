/**
 * 更新日: 2025-12-27
 * 内容: countActiveTasks をエクスポートに追加（ビルドエラー修正）
 * これにより src/ui/sidebar-renderer.js でのインポート失敗を解消
 */
import { SIDEBAR_CONFIG } from './sidebar-constants.js';

/**
 * サイドバーのリサイズ（ドラッグ）設定
 */
export function setupResizer(sidebar, resizer) {
    if (!resizer || !sidebar) return;

    let isResizing = false;
    let pendingWidth = null;
    let requestId = null;

    const applyPendingWidth = () => {
        if (pendingWidth !== null && sidebar) {
            sidebar.style.width = `${pendingWidth}px`;
        }
        requestId = null;
    };

    const resize = (e) => {
        if (!isResizing) return;
        const { MIN_WIDTH, MAX_WIDTH } = SIDEBAR_CONFIG;
        pendingWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, e.clientX));
        if (!requestId) {
            requestId = requestAnimationFrame(applyPendingWidth);
        }
    };

    const stopResize = () => {
        if (!isResizing) return;
        isResizing = false;
        document.body.classList.remove('cursor-col-resize', 'select-none');
        sidebar.style.transition = '';
        if (requestId) cancelAnimationFrame(requestId);
        requestId = null;
        applyPendingWidth();
        localStorage.setItem(SIDEBAR_CONFIG.STORAGE_KEYS.WIDTH, sidebar.offsetWidth);
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    };

    resizer.addEventListener('mousedown', (e) => {
        if (!isDesktop()) return;
        isResizing = true;
        document.body.classList.add('cursor-col-resize', 'select-none');
        sidebar.style.transition = 'none';
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    });
}

/**
 * デスクトップ表示（MDブレイクポイント以上）かどうかを判定
 */
export function isDesktop() {
    return window.innerWidth >= 768;
}

/**
 * localStorage から boolean 値を取得
 */
export function getStoredBool(key, defaultValue = false) {
    const val = localStorage.getItem(key);
    if (val === null) return defaultValue;
    return val === 'true' || val === 'compact';
}

/**
 * サイドバーが現在コンパクトモードかどうかを判定
 */
export function isSidebarCompact() {
    return getStoredBool(SIDEBAR_CONFIG.STORAGE_KEYS.COMPACT, false);
}

/**
 * 条件に一致するアクティブ（未完了）タスクをカウント
 * @param {Array} tasks - タスク配列
 * @param {Function} predicate - フィルタ条件関数
 */
export function countActiveTasks(tasks, predicate) {
    if (!Array.isArray(tasks)) return 0;
    return tasks.filter(task => !task.completed && predicate(task)).length;
}