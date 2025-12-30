/**
 * 更新日: 2025-12-27
 * 内容: countActiveTasks をエクスポートに追加（ビルドエラー修正）
 * これにより src/ui/sidebar-renderer.js でのインポート失敗を解消
 * TypeScript化: 2025-12-29
 */
import { getLabels } from '../../../store/labels-raw.js';
import { Label, Task } from '../../../store/schema';
import { SIDEBAR_CONFIG } from './sidebar-constants.js';

/**
 * サイドバーのリサイズ（ドラッグ）設定
 */
export function setupResizer(sidebar: HTMLElement | null, resizer: HTMLElement | null) {
    if (!resizer || !sidebar) return;

    let isResizing = false;
    let pendingWidth: number | null = null;
    let requestId: number | null = null;

    const applyPendingWidth = () => {
        if (pendingWidth !== null && sidebar) {
            sidebar.style.width = `${pendingWidth}px`;
        }
        requestId = null;
    };

    const resize = (e: MouseEvent) => {
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
        localStorage.setItem(SIDEBAR_CONFIG.STORAGE_KEYS.WIDTH, String(sidebar.offsetWidth));
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
export function isDesktop(): boolean {
    return window.innerWidth >= 768;
}

/**
 * localStorage から boolean 値を取得
 */
export function getStoredBool(key: string, defaultValue = false): boolean {
    const val = localStorage.getItem(key);
    if (val === null) return defaultValue;
    return val === 'true' || val === 'compact';
}

/**
 * サイドバーの密度レベルを取得
 */
export function getSidebarDensity(): string {
    // 1. New density key
    const density = localStorage.getItem(SIDEBAR_CONFIG.STORAGE_KEYS.DENSITY);
    if (density && (Object.values(SIDEBAR_CONFIG.DENSITY_LEVELS) as string[]).includes(density)) {
        return density;
    }

    // 2. Fallback to legacy 'compact' boolean
    const isCompact = getStoredBool(SIDEBAR_CONFIG.STORAGE_KEYS.COMPACT, false);
    return isCompact ? SIDEBAR_CONFIG.DENSITY_LEVELS.COMPACT : SIDEBAR_CONFIG.DENSITY_LEVELS.NORMAL;
}

/**
 * サイドバーが現在コンパクトモードかどうかを判定 (Deprecated)
 */
export function isSidebarCompact(): boolean {
    return getSidebarDensity() === SIDEBAR_CONFIG.DENSITY_LEVELS.COMPACT;
}

/**
 * 条件に一致するアクティブ（未完了）タスクをカウント
 * @param {Array} tasks - タスク配列
 * @param {Function} predicate - フィルタ条件関数
 */
export function countActiveTasks(tasks: Task[], predicate: (task: Task) => boolean): number {
    if (!Array.isArray(tasks)) return 0;
    return tasks.filter(task => task.status !== 'completed' && predicate(task)).length;
}

/**
 * ラベル詳細を取得 (task-modal-labelsで使用)
 */
export function getLabelDetails(labelId: string): Label | undefined {
    // @ts-ignore
    const labels = getLabels() as Label[];
    return labels.find(l => l.id === labelId);
}
