import { APP_EVENTS } from '../../../core/event-constants';
import { SIDEBAR_CONFIG } from './sidebar-constants';
import { cacheSidebarElements, getSidebarUI } from './sidebar-state';
import { isDesktop } from './sidebar-utils';

// We need to type CustomEvent for SIDEBAR_SETTINGS_UPDATED or use any
interface SidebarSettingsEventDetail {
    density: string;
}

/**
 * 密度モードを適用する
 */
export function applyDensityMode(density: string) {
    const items = document.querySelectorAll('.sidebar-item-row');
    const densityClasses = Object.values(SIDEBAR_CONFIG.DENSITY_CLASSES);
    // Explicitly cast access because density string might be anything
    const configClasses = SIDEBAR_CONFIG.DENSITY_CLASSES as Record<string, string>;
    const targetClass = configClasses[density] || configClasses['normal'];

    items.forEach(item => {
        item.classList.remove(...densityClasses);
        item.classList.add(targetClass);
    });
}

/**
 * 密度モード設定リスナーのセットアップ
 */
export function setupDensityModeListener() {
    window.addEventListener(APP_EVENTS.SIDEBAR_SETTINGS_UPDATED, ((e: CustomEvent<SidebarSettingsEventDetail>) => {
        applyDensityMode(e.detail.density);
    }) as EventListener);
}

/**
 * サイドバーの開閉を切り替える
 */
export function toggleSidebar(open: boolean) {
    const UI = getSidebarUI();
    const { sidebar, resizer, overlay } = UI;
    const { CLOSED, HIDDEN } = SIDEBAR_CONFIG.CLASSES;

    if (!sidebar) return;

    sidebar.classList.toggle(CLOSED, !open);
    sidebar.classList.toggle(HIDDEN, !open);

    // オーバーレイの制御 (モバイル用)
    if (overlay) {
        overlay.classList.toggle(HIDDEN, !open);
    }

    if (isDesktop()) {
        if (resizer) resizer.classList.toggle(HIDDEN, !open);
        if (open) {
            const w = localStorage.getItem(SIDEBAR_CONFIG.STORAGE_KEYS.WIDTH) || String(SIDEBAR_CONFIG.DEFAULT_WIDTH);
            sidebar.style.width = `${w}px`;
        } else {
            sidebar.style.width = '0';
        }
    }
    updateSidebarVisibility();
}

/**
 * サイドバーの可視状態（ボタン等）を更新する
 */
export function updateSidebarVisibility() {
    const UI = getSidebarUI();
    const { sidebar, openBtn, closeBtn } = UI;
    const { CLOSED, HIDDEN } = SIDEBAR_CONFIG.CLASSES;

    // UIキャッシュが古い場合があるため再取得を試みる
    if (!sidebar) return;

    // openBtn/closeBtn はDOM生成タイミングによってはnullの可能性があるためチェック
    if (!openBtn && !closeBtn) return;

    const isClosed = sidebar.classList.contains(CLOSED) || sidebar.classList.contains(HIDDEN);

    if (isDesktop()) {
        if (openBtn) openBtn.classList.toggle(HIDDEN, !isClosed);
        if (closeBtn) closeBtn.classList.toggle(HIDDEN, isClosed);
        if (!isClosed) sidebar.classList.remove(HIDDEN);
    } else {
        if (openBtn) openBtn.classList.remove(HIDDEN);
        if (closeBtn) closeBtn.classList.remove(HIDDEN);
        sidebar.classList.remove(HIDDEN);
    }
}

/**
 * ハンバーガーメニューのイベント登録（DOM生成待機リトライ付き）
 */
export function initializeSidebarToggles() {
    const openBtn = document.getElementById('sidebar-open-btn');
    const closeBtn = document.getElementById('sidebar-close-btn');

    // ボタンが見つかるまでリトライ
    if (!openBtn) {
        requestAnimationFrame(initializeSidebarToggles);
        return;
    }

    // キャッシュ更新（重要）
    const UI = cacheSidebarElements();
    const { overlay } = UI;

    openBtn.onclick = () => toggleSidebar(true);
    if (closeBtn) closeBtn.onclick = () => toggleSidebar(false);

    // オーバーレイのクリックで閉じる
    if (overlay) {
        overlay.onclick = () => toggleSidebar(false);
    }

    // 初期状態の反映
    updateSidebarVisibility();
}
