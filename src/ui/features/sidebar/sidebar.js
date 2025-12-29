/**
 * 更新日: 2025-12-27
 * 内容: 動的アイテムのレンダリング後に applyCompactMode を再実行するよう修正
 * これにより、データ同期後もコンパクト表示の設定が正しく反映される
 */
import { SIDEBAR_CONFIG } from './sidebar-constants.js';
import { setupResizer, isDesktop, getStoredBool, getSidebarDensity } from './sidebar-utils.js';
import { buildSidebarHTML, setupSidebarToggles, setupSectionDragAndDrop } from './sidebar-structure.js';
import { setupDropZone } from './sidebar-drag-drop.js';
import { showFilterModal } from '../../modals/filter-modal.js';
import { showTimeBlockModal } from '../timeblock/timeblock-modal.js';
import { initSidebarProjects, updateSidebarProjects } from './SidebarProjects.js';
import { renderSidebarItems, updateInboxCount } from './sidebar-renderer.js';
import { showSettingsModal } from '../../settings.js';
import { openInNewWindow } from '../../core/window-manager.js';
import { showCustomContextMenu } from './sidebar-components.js';

// 同期取得関数
// 同期取得関数
// import { getProjects } from '../../../store/projects.js';
// import { getFilters } from '../../../store/filters.js';

export { updateSidebarProjects as renderProjects, updateInboxCount };

// キャッシュ
let refreshSidebarHandler = null;
let resizeHandler = null;
let UI = {};

function cacheElements() {
    UI = {
        container: document.getElementById('sidebar-content'),
        sidebar: document.getElementById('sidebar'),
        resizer: document.getElementById('sidebar-resizer'),
        openBtn: document.getElementById('sidebar-open-btn'),
        closeBtn: document.getElementById('sidebar-close-btn'),
        inbox: document.getElementById('nav-inbox')
    };
}

/**
 * サイドバー初期化
 */
export function initSidebar() {
    cacheElements();
    if (!UI.container) return;

    // HTML構築
    UI.container.innerHTML = buildSidebarHTML();

    // 再キャッシュ
    cacheElements();

    setupResizer(UI.sidebar, UI.resizer);
    setupSidebarEvents();
    setupSidebarToggles();
    setupSectionDragAndDrop(); // ドラッグ&ドロップのセットアップ
    setupDataEventListeners();

    if (UI.inbox) setupDropZone(UI.inbox, 'inbox');

    initSidebarProjects(UI.container);

    // リサイズ監視（既存があれば解除）
    if (resizeHandler) window.removeEventListener('resize', resizeHandler);
    resizeHandler = () => updateSidebarVisibility();
    window.addEventListener('resize', resizeHandler);

    updateSidebarVisibility();

    // 初期化時の適用
    const density = getSidebarDensity();
    applyDensityMode(density);
    setupDensityModeListener();


    // 初回描画を強制実行
    if (refreshSidebarHandler) refreshSidebarHandler();
}

/**
 * データ更新イベントの監視（クリーンアップ付き）
 */
function setupDataEventListeners() {
    const updateEvents = [
        'timeblocks-updated', 'projects-updated', 'labels-updated',
        'filters-updated', 'tasks-updated'
    ];

    if (refreshSidebarHandler) {
        updateEvents.forEach(ev => document.removeEventListener(ev, refreshSidebarHandler));
    }


    refreshSidebarHandler = () => {
        renderSidebarItems();

        // 【修正】動的アイテム描画後に密度設定を再適用
        const density = getSidebarDensity();
        applyDensityMode(density);
    };

    updateEvents.forEach(ev => document.addEventListener(ev, refreshSidebarHandler));
}

function setupSidebarEvents() {
    const dispatch = (page, id = null) =>
        document.dispatchEvent(new CustomEvent('route-change', { detail: { page, id } }));

    // イベント委譲の統合
    UI.container.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        const btn = e.target.closest('button');

        if (link) {
            e.preventDefault();
            const id = link.id;
            if (id === 'nav-dashboard') dispatch('dashboard');
            if (id === 'nav-inbox') dispatch('inbox');
            if (id === 'nav-search') dispatch('search');
            if (id === 'nav-settings') showSettingsModal();

            // Target Tools
            if (id === 'nav-wizard') dispatch('wizard');
            if (id === 'nav-target-dashboard') dispatch('target-dashboard');
            if (id === 'nav-wiki') dispatch('wiki');
            return;
        }

        if (btn) {
            const id = btn.id;
            if (id === 'add-filter-btn') showFilterModal();
            if (id === 'edit-timeblocks-btn') showTimeBlockModal();
        }
    });



    // 右クリックで別ウィンドウで開く
    UI.container.addEventListener('contextmenu', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const id = link.id;
        const viewMap = {
            'nav-wizard': 'wizard',
            'nav-target-dashboard': 'target-dashboard',
            'nav-wiki': 'wiki',
            'nav-dashboard': 'dashboard'
        };

        if (viewMap[id]) {
            showCustomContextMenu(e, [
                {
                    label: '新しいウィンドウで開く',
                    action: () => openInNewWindow(viewMap[id])
                }
            ]);
        }
    });

    UI.openBtn?.addEventListener('click', () => toggleSidebar(true));
    UI.closeBtn?.addEventListener('click', () => toggleSidebar(false));
}

function applyDensityMode(density) {
    const items = document.querySelectorAll('.sidebar-item-row');
    const densityClasses = Object.values(SIDEBAR_CONFIG.DENSITY_CLASSES);
    const targetClass = SIDEBAR_CONFIG.DENSITY_CLASSES[density] || SIDEBAR_CONFIG.DENSITY_CLASSES.normal;

    items.forEach(item => {
        item.classList.remove(...densityClasses);
        item.classList.add(targetClass);
    });
}

function toggleSidebar(open) {
    const { sidebar, resizer } = UI;
    const { CLOSED, HIDDEN } = SIDEBAR_CONFIG.CLASSES;

    if (!sidebar) return;

    sidebar.classList.toggle(CLOSED, !open);
    sidebar.classList.toggle(HIDDEN, !open);

    if (isDesktop()) {
        if (resizer) resizer.classList.toggle(HIDDEN, !open);
        if (open) {
            const w = localStorage.getItem(SIDEBAR_CONFIG.STORAGE_KEYS.WIDTH) || SIDEBAR_CONFIG.DEFAULT_WIDTH;
            sidebar.style.width = `${w}px`;
        } else {
            sidebar.style.width = '0';
        }
    }
    updateSidebarVisibility();
}

function updateSidebarVisibility() {
    const { sidebar, openBtn, closeBtn } = UI;
    const { CLOSED, HIDDEN } = SIDEBAR_CONFIG.CLASSES;
    if (!sidebar || !openBtn || !closeBtn) return;

    const isClosed = sidebar.classList.contains(CLOSED) || sidebar.classList.contains(HIDDEN);

    if (isDesktop()) {
        openBtn.classList.toggle(HIDDEN, !isClosed);
        closeBtn.classList.toggle(HIDDEN, isClosed);
        if (!isClosed) sidebar.classList.remove(HIDDEN);
    } else {
        openBtn.classList.remove(HIDDEN);
        closeBtn.classList.remove(HIDDEN);
        sidebar.classList.remove(HIDDEN);
    }
}

function setupDensityModeListener() {
    window.addEventListener('sidebar-settings-updated', (e) => {
        applyDensityMode(e.detail.density);
    });
}
