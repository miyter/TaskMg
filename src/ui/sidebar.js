// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: Inboxカウントロジックの統一、コンパクトモード初期適用の追加
 */

import { setupResizer } from './sidebar-utils.js';
import { buildSidebarHTML, setupSidebarToggles } from './sidebar-dom.js';
import { setupDropZone } from './sidebar-drag-drop.js'; 
import { showFilterModal } from './filter-modal.js';
import { showTimeBlockModal } from './timeblock-modal.js'; 
import { showSettingsModal } from './settings.js';
import { initSidebarProjects, updateSidebarProjects } from './components/SidebarProjects.js';
// 修正: rendererからインポート
import { renderLabels, updateInboxCount } from './sidebar-renderer.js';

// DataSyncManager が期待する名前で再エクスポート
// updateInboxCountはrendererのものを使用し、ロジックを統一
export { updateSidebarProjects as renderProjects, renderLabels, updateInboxCount };

export function initSidebar() {
    const container = document.getElementById('sidebar-content');
    if (!container) return;
    
    container.innerHTML = buildSidebarHTML();
    
    const sidebar = document.getElementById('sidebar');
    const resizer = document.getElementById('sidebar-resizer');
    
    setupResizer(sidebar, document.querySelector('main'), resizer);
    setupSidebarEvents();
    setupSidebarToggles();
    setupDropZone(document.getElementById('nav-inbox'), 'inbox');
    initSidebarProjects(container);
    
    updateSidebarVisibility();
    window.addEventListener('resize', updateSidebarVisibility);
    
    // 修正: 初期化時に設定を即時適用
    applyInitialSettings();
    setupCompactModeListener();
}

/**
 * 初期の表示設定（コンパクトモードなど）を適用
 */
function applyInitialSettings() {
    const isCompact = localStorage.getItem('sidebar_compact') === 'compact';
    if (isCompact) {
        document.querySelectorAll('.sidebar-item-row').forEach(item => {
            item.classList.add('py-0.5');
            item.classList.remove('py-1.5');
        });
    }
}

function setupSidebarEvents() {
    const dispatch = (page, id = null) => document.dispatchEvent(new CustomEvent('route-change', { detail: { page, id } }));
    document.getElementById('nav-dashboard')?.addEventListener('click', (e) => { e.preventDefault(); dispatch('dashboard'); });
    document.getElementById('nav-inbox')?.addEventListener('click', (e) => { e.preventDefault(); dispatch('inbox'); });
    document.getElementById('nav-search')?.addEventListener('click', (e) => { e.preventDefault(); dispatch('search'); });
    document.getElementById('nav-settings')?.addEventListener('click', (e) => { e.preventDefault(); showSettingsModal(); });
    document.getElementById('add-filter-btn')?.addEventListener('click', () => showFilterModal());
    document.getElementById('edit-timeblocks-btn')?.addEventListener('click', () => showTimeBlockModal());
}

function updateSidebarVisibility() {
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.getElementById('sidebar-open-btn');
    const closeBtn = document.getElementById('sidebar-close-btn');
    if (!sidebar || !openBtn || !closeBtn) return;
    
    const isClosed = sidebar.classList.contains('sidebar-closed');
    const resizer = document.getElementById('sidebar-resizer');
    
    if (window.innerWidth >= 768) {
        openBtn.classList.toggle('hidden', !isClosed); 
        closeBtn.classList.toggle('hidden', isClosed);
        sidebar.classList.toggle('hidden', isClosed); 
        if (resizer) resizer.classList.toggle('hidden', isClosed);
    } else {
        openBtn.classList.remove('hidden');
        closeBtn.classList.remove('hidden');
        sidebar.classList.remove('hidden'); 
    }
}

function setupCompactModeListener() {
    window.addEventListener('sidebar-settings-updated', (e) => {
        const isCompact = e.detail.compact;
        document.querySelectorAll('.sidebar-item-row').forEach(item => {
            item.classList.toggle('py-0.5', isCompact);
            item.classList.toggle('py-1.5', !isCompact);
        });
    });
}