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

export function initSidebar(allTasks = [], allProjects = [], allLabels = []) {
    const container = document.getElementById('sidebar-content');
    if (!container) return;
    
    container.innerHTML = buildSidebarHTML();

    // ★追加: インボックスの下に「検索」項目を挿入
    insertSearchNavItem();
    
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const resizer = document.getElementById('sidebar-resizer');

    setupResizer(sidebar, document.querySelector('main'), resizer);
    
    setupSidebarEvents();
    setupSidebarToggles();
    
    setupDropZone(document.getElementById('nav-inbox'), 'inbox');
    
    renderSidebarItems(sidebar, allTasks, allProjects, allLabels);
    
    document.addEventListener('timeblocks-updated', () => {
        renderSidebarItems(document.getElementById('sidebar'), allTasks, allProjects, []);
    });

    // サイドバー設定変更イベントの購読
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

/**
 * インボックスの下に検索ボタンを挿入する
 */
function insertSearchNavItem() {
    const inboxNav = document.getElementById('nav-inbox');
    // 既に存在する場合は何もしない
    if (inboxNav && !document.getElementById('nav-search')) {
        const searchHTML = `
            <div id="nav-search" class="sidebar-item-row flex items-center px-3 py-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors mb-1 group">
                <div class="flex items-center flex-1 min-w-0">
                    <span class="mr-3 text-lg text-gray-400 group-hover:text-blue-500 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </span>
                    <span class="text-sm font-medium truncate">検索</span>
                </div>
            </div>
        `;
        inboxNav.insertAdjacentHTML('afterend', searchHTML);
    }
}

function setupSidebarEvents() {
    const dispatch = (page, id = null) => document.dispatchEvent(new CustomEvent('route-change', { detail: { page, id } }));
    
    document.getElementById('nav-dashboard')?.addEventListener('click', (e) => { 
        e.preventDefault(); 
        dispatch('dashboard'); 
    });
    document.getElementById('nav-inbox')?.addEventListener('click', (e) => { e.preventDefault(); dispatch('inbox'); });
    
    // ★追加: 検索ボタンのイベント
    document.getElementById('nav-search')?.addEventListener('click', (e) => {
        e.preventDefault();
        dispatch('search');
    });
    
    document.getElementById('add-project-btn')?.addEventListener('click', () => {
        showProjectModal(null, []);
    });
    
    document.getElementById('add-filter-btn')?.addEventListener('click', () => {
        showFilterModal();
    });
    
    document.getElementById('edit-timeblocks-btn')?.addEventListener('click', () => {
        showTimeBlockModal();
    });
    
    const toggleSidebar = () => {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;

        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            sidebar.classList.toggle('-translate-x-full');
        } else {
            if (sidebar.classList.contains('w-[280px]')) {
                sidebar.classList.remove('w-[280px]');
                sidebar.classList.add('w-0');
                sidebar.classList.add('border-none');
                sidebar.classList.add('overflow-hidden');
            } else {
                sidebar.classList.remove('w-0');
                sidebar.classList.remove('border-none');
                sidebar.classList.remove('overflow-hidden');
                sidebar.classList.add('w-[280px]');
            }
        }
    };

    document.getElementById('sidebar-toggle-btn')?.addEventListener('click', toggleSidebar);
    document.getElementById('sidebar-close-mobile')?.addEventListener('click', toggleSidebar);
}