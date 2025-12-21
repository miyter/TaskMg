/**
 * 更新日: 2025-12-21
 * 内容: イベントリスナーの重複登録防止（TypeError: n is not a function 対策）
 */
import { SIDEBAR_CONFIG } from './sidebar-constants.js';
import { setupResizer, isDesktop, getStoredBool } from './sidebar-utils.js';
import { buildSidebarHTML, setupSidebarToggles } from './sidebar-structure.js';
import { setupDropZone } from './sidebar-drag-drop.js';
import { showFilterModal } from './filter-modal.js';
import { showTimeBlockModal } from './timeblock-modal.js';
import { showSettingsModal } from './settings.js';
import { initSidebarProjects, updateSidebarProjects } from './components/SidebarProjects.js';
import { renderSidebarItems, updateInboxCount } from './sidebar-renderer.js';

// 存在する同期取得関数のみインポート
import { getProjects } from '../store/projects.js';
import { getFilters } from '../store/filters.js';

export { updateSidebarProjects as renderProjects, updateInboxCount };

// --- データのキャッシュ用変数 ---
let cachedTasks = [];
let cachedLabels = [];
let cachedProjects = [];
let cachedFilters = [];

// 重複登録防止用のハンドラ保持
let refreshSidebarHandler = null;

/**
 * 外部からサイドバー用のキャッシュを更新する
 */
export function updateSidebarCache({ tasks, labels, projects, filters }) {
    if (tasks !== undefined) cachedTasks = tasks;
    if (labels !== undefined) cachedLabels = labels;
    if (projects !== undefined) cachedProjects = projects;
    if (filters !== undefined) cachedFilters = filters;
}

// DOM要素のキャッシュ
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
 * サイドバーの初期化
 */
export function initSidebar() {
    cacheElements();
    if (!UI.container) return;

    UI.container.innerHTML = buildSidebarHTML();
    
    cacheElements();

    setupResizer(UI.sidebar, UI.resizer);
    setupSidebarEvents();
    setupSidebarToggles();
    setupDataEventListeners(); // リスナーの再設定
    
    if (UI.inbox) setupDropZone(UI.inbox, 'inbox');

    initSidebarProjects(UI.container);

    updateSidebarVisibility();
    window.addEventListener('resize', updateSidebarVisibility);

    const isCompact = getStoredBool(SIDEBAR_CONFIG.STORAGE_KEYS.COMPACT, false);
    applyCompactMode(isCompact);
    setupCompactModeListener();
}

/**
 * 各種データ更新イベントの監視設定（クリーンアップ付き）
 */
function setupDataEventListeners() {
    const updateEvents = [
        'timeblocks-updated',
        'projects-updated',
        'labels-updated',
        'filters-updated',
        'tasks-updated'
    ];

    // 1. 既存のハンドラがあれば解除（重複防止）
    if (refreshSidebarHandler) {
        updateEvents.forEach(event => {
            window.removeEventListener(event, refreshSidebarHandler);
        });
    }

    // 2. 新しいハンドラを定義
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

    // 3. イベントを登録
    updateEvents.forEach(event => {
        window.addEventListener(event, refreshSidebarHandler);
    });
}

function setupSidebarEvents() {
    const dispatch = (page, id = null) => document.dispatchEvent(new CustomEvent('route-change', { detail: { page, id } }));

    // ナビゲーション（イベント委譲）
    UI.container.addEventListener('click', (e) => {
        const item = e.target.closest('a');
        if (!item) return;

        e.preventDefault();
        const id = item.id;

        switch (id) {
            case 'nav-dashboard': dispatch('dashboard'); break;
            case 'nav-inbox':     dispatch('inbox');     break;
            case 'nav-search':    dispatch('search');    break;
            case 'nav-settings':  showSettingsModal();   break;
        }
    });

    // 追加系ボタンの委譲
    UI.container.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        const id = btn.id;
        if (id === 'add-filter-btn') showFilterModal();
        if (id === 'edit-timeblocks-btn') showTimeBlockModal();
    });

    // サイドバー開閉
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