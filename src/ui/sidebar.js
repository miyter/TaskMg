/**
 * 更新日: 2025-12-21
 * 内容: イベント委譲の導入、DOMキャッシュ、定数連携、アクセシビリティ対応
 */
import { SIDEBAR_CONFIG } from './sidebar-constants.js';
import { setupResizer, isDesktop, getStoredBool } from './sidebar-utils.js';
import { buildSidebarHTML, setupSidebarToggles } from './sidebar-structure.js';
import { setupDropZone } from './sidebar-drag-drop.js';
import { showFilterModal } from './filter-modal.js';
import { showTimeBlockModal } from './timeblock-modal.js';
import { showSettingsModal } from './settings.js';
import { initSidebarProjects, updateSidebarProjects } from './components/SidebarProjects.js';
import { updateInboxCount } from './sidebar-renderer.js';

export { updateSidebarProjects as renderProjects, updateInboxCount };

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

export function initSidebar() {
    cacheElements();
    if (!UI.container) return;

    UI.container.innerHTML = buildSidebarHTML();
    
    // リフレッシュ後の要素もキャッシュ
    cacheElements();

    setupResizer(UI.sidebar, UI.resizer);
    setupSidebarEvents();
    setupSidebarToggles();
    
    if (UI.inbox) setupDropZone(UI.inbox, 'inbox');

    initSidebarProjects(UI.container);

    updateSidebarVisibility();
    window.addEventListener('resize', updateSidebarVisibility);

    const isCompact = getStoredBool(SIDEBAR_CONFIG.STORAGE_KEYS.COMPACT, false);
    applyCompactMode(isCompact);
    setupCompactModeListener();
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