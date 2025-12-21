/**
 * サイドバーのメイン制御
 */
import { SIDEBAR_CONFIG } from './sidebar-constants.js';
import { setupResizer, isDesktop, getStoredBool } from './sidebar-utils.js';
import { buildSidebarHTML, setupSidebarToggles } from './sidebar-structure.js';
import { setupDropZone } from './sidebar-drag-drop.js';
import { showFilterModal } from './filter-modal.js';
import { showTimeBlockModal } from './timeblock-modal.js';
import { initSidebarProjects, updateSidebarProjects } from './components/SidebarProjects.js';
import { renderSidebarItems, updateInboxCount } from './sidebar-renderer.js';
import { showSettingsModal } from './settings.js';

// 同期取得関数
import { getProjects } from '../store/projects.js';
import { getFilters } from '../store/filters.js';

export { updateSidebarProjects as renderProjects, updateInboxCount };

// キャッシュ
let cachedTasks = [];
let cachedLabels = [];
let cachedProjects = [];
let cachedFilters = [];

let refreshSidebarHandler = null;
let resizeHandler = null;
let UI = {};

/**
 * 外部からキャッシュを更新
 */
export function updateSidebarCache({ tasks, labels, projects, filters }) {
    if (tasks !== undefined) cachedTasks = tasks || [];
    if (labels !== undefined) cachedLabels = labels || [];
    if (projects !== undefined) cachedProjects = projects || [];
    if (filters !== undefined) cachedFilters = filters || [];
}

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
    setupDataEventListeners();
    
    if (UI.inbox) setupDropZone(UI.inbox, 'inbox');

    initSidebarProjects(UI.container);

    // リサイズ監視（既存があれば解除）
    if (resizeHandler) window.removeEventListener('resize', resizeHandler);
    resizeHandler = () => updateSidebarVisibility();
    window.addEventListener('resize', resizeHandler);

    updateSidebarVisibility();

    const isCompact = getStoredBool(SIDEBAR_CONFIG.STORAGE_KEYS.COMPACT, false);
    applyCompactMode(isCompact);
    setupCompactModeListener();
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
        updateEvents.forEach(ev => window.removeEventListener(ev, refreshSidebarHandler));
    }

    refreshSidebarHandler = () => {
        const projects = cachedProjects.length > 0 ? cachedProjects : getProjects();
        const filters = cachedFilters.length > 0 ? cachedFilters : getFilters();

        renderSidebarItems(
            UI.sidebar, 
            cachedTasks, 
            projects, 
            cachedLabels, 
            filters
        );
    };

    updateEvents.forEach(ev => window.addEventListener(ev, refreshSidebarHandler));
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
            return;
        }

        if (btn) {
            const id = btn.id;
            if (id === 'add-filter-btn') showFilterModal();
            if (id === 'edit-timeblocks-btn') showTimeBlockModal();
        }
    });

    UI.openBtn?.addEventListener('click', () => toggleSidebar(true));
    UI.closeBtn?.addEventListener('click', () => toggleSidebar(false));
}

function applyCompactMode(isCompact) {
    const items = document.querySelectorAll('.sidebar-item-row');
    const { COMPACT_PY, NORMAL_PY } = SIDEBAR_CONFIG.CLASSES;
    
    items.forEach(item => {
        item.classList.toggle(COMPACT_PY, isCompact);
        item.classList.toggle(NORMAL_PY, !isCompact);
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

function setupCompactModeListener() {
    window.addEventListener('sidebar-settings-updated', (e) => {
        applyCompactMode(Boolean(e.detail.compact));
    });
}