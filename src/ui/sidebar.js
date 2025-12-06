// @ts-nocheck
// @miyter:20251129

import { updateView, setCurrentFilter } from './ui-view-manager.js';
import { updateSidebarState, setupResizer } from './sidebar-utils.js';
import { buildSidebarHTML, setupDropZone, setupSidebarToggles } from './sidebar-dom.js';
import { showProjectModal } from './task-modal.js';
import { showFilterModal } from './filter-modal.js';
import { showTimeBlockModal } from './timeblock-modal.js'; 
import { renderSidebarItems, renderProjects } from './sidebar-renderer.js';

// 外部公開
export { renderSidebarItems, renderProjects };
export { initSidebar as renderSidebar };

// ダミーエクスポート
export function renderLabels() { }
export function updateInboxCount() { }

let sidebarWidth = 280;

export function initSidebar(allTasks = [], allProjects = [], allLabels = []) {
    const container = document.getElementById('sidebar-content');
    if (!container) return;
    
    container.innerHTML = buildSidebarHTML();
    
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const resizer = document.getElementById('sidebar-resizer');

    if (sidebar) {
        const storedWidth = localStorage.getItem('sidebarWidth');
        sidebarWidth = storedWidth ? parseInt(storedWidth, 10) : 280;
        sidebar.style.width = `${sidebarWidth}px`;
    }

    updateSidebarState(sidebar, mainContent);
    setupResizer(sidebar, mainContent, resizer);
    
    setupSidebarEvents();
    setupSidebarToggles();
    
    setupDropZone(document.getElementById('nav-inbox'), 'inbox');
    
    renderSidebarItems(sidebar, allTasks, allProjects, allLabels);
    
    document.addEventListener('timeblocks-updated', () => {
        renderSidebarItems(document.getElementById('sidebar'), allTasks, allProjects, []);
    });

    // ★追加: サイドバー設定変更イベントの購読 (即座にスタイル反映)
    window.addEventListener('sidebar-settings-updated', (e) => {
        const isCompact = e.detail.compact;
        const items = document.querySelectorAll('.sidebar-item-row');
        items.forEach(item => {
            if (isCompact) {
                item.classList.replace('py-1.5', 'py-0.5');
            } else {
                item.classList.replace('py-0.5', 'py-1.5');
            }
        });
    });
}

function setupSidebarEvents() {
    const dispatch = (page, id = null) => document.dispatchEvent(new CustomEvent('route-change', { detail: { page, id } }));
    
    document.getElementById('nav-dashboard')?.addEventListener('click', (e) => { 
        e.preventDefault(); 
        dispatch('dashboard'); 
    });
    document.getElementById('nav-inbox')?.addEventListener('click', (e) => { e.preventDefault(); dispatch('inbox'); });
    
    document.getElementById('add-project-btn')?.addEventListener('click', () => {
        showProjectModal(null, []);
    });
    
    document.getElementById('add-filter-btn')?.addEventListener('click', () => {
        showFilterModal();
    });
    
    document.getElementById('edit-timeblocks-btn')?.addEventListener('click', () => {
        showTimeBlockModal();
    });
    
    document.getElementById('sidebar-toggle-btn')?.addEventListener('click', (e) => {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        localStorage.setItem('sidebarCollapsed', !isCollapsed);
        updateSidebarState(sidebar, mainContent);
    });
}