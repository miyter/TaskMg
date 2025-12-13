// @ts-nocheck
// サイドバー制御

import { updateView, setCurrentFilter } from './ui-view-manager.js';
import { updateSidebarState, setupResizer } from './sidebar-utils.js';
import { buildSidebarHTML, setupSidebarToggles } from './sidebar-dom.js';
import { setupDropZone } from './sidebar-drag-drop.js'; 
import { showProjectModal } from './task-modal.js';
import { showFilterModal } from './filter-modal.js';
import { showTimeBlockModal } from './timeblock-modal.js'; 
import { showSettingsModal } from './settings.js';
import { renderSidebarItems, renderProjects } from './sidebar-renderer.js';
// ★追加: フィルターと時間帯の購読用
import { subscribeToFilters, getFilters } from '../store/filters.js';
import { subscribeToTimeBlocks } from '../store/timeblocks.js';

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

    const sidebar = document.getElementById('sidebar');
    const resizer = document.getElementById('sidebar-resizer');

    setupResizer(sidebar, document.querySelector('main'), resizer);
    
    setupSidebarEvents();
    setupSidebarToggles();
    
    setupDropZone(document.getElementById('nav-inbox'), 'inbox');
    
    // 初期描画
    renderSidebarItems(sidebar, allTasks, allProjects, allLabels, []);
    
    // フィルターのリアルタイム購読
    subscribeToFilters((filters) => {
        const filterList = document.getElementById('filter-list');
        if (filterList) {
            renderSidebarItems(sidebar, allTasks, allProjects, allLabels, filters);
        }
    });

    // ★追加: 時間帯のリアルタイム購読
    // Firestoreの変更を検知してサイドバーの時間帯リストを更新
    subscribeToTimeBlocks((timeBlocks) => {
        // 時間帯リストのDOM要素が存在する場合のみ更新
        const tbList = document.getElementById('timeblock-list');
        if (tbList) {
            // 現在のフィルターリストを取得 (なければ空)
            const currentFilters = getFilters();
            // 全体を再描画 (引数のtimeBlocksはstore内で更新済みなので、
            // renderSidebarItems内部でgetTimeBlocks()を呼べば最新が取れるはずだが、
            // storeのキャッシュ更新タイミングと同期させるため、
            // renderSidebarItemsが内部でgetTimeBlocks()を呼ぶ構造ならこれでOK)
            renderSidebarItems(sidebar, allTasks, allProjects, allLabels, currentFilters);
        }
    });

    document.addEventListener('timeblocks-updated', () => {
        // モーダルからの手動通知用 (subscribeがあるため必須ではないが、即時性担保のため残す)
        const filters = getFilters();
        renderSidebarItems(document.getElementById('sidebar'), allTasks, allProjects, allLabels, filters);
    });

    // 手動イベントでのフィルター更新
    document.addEventListener('filters-updated', () => {
        const filters = getFilters();
        renderSidebarItems(sidebar, allTasks, allProjects, allLabels, filters);
    });

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
    
    updateSidebarVisibility();
    window.addEventListener('resize', updateSidebarVisibility);
}

/**
 * サイドバーの開閉状態に応じて、ヘッダーの開閉ボタンの表示を制御する
 */
function updateSidebarVisibility() {
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.getElementById('sidebar-open-btn');
    const closeBtn = document.getElementById('sidebar-close-btn');

    if (!sidebar || !openBtn || !closeBtn) return;

    const isClosed = sidebar.classList.contains('sidebar-closed');

    if (window.innerWidth >= 768) {
        openBtn.classList.toggle('hidden', !isClosed); 
        closeBtn.classList.toggle('hidden', isClosed);
        sidebar.classList.toggle('hidden', isClosed); 

        const resizer = document.getElementById('sidebar-resizer');
        if (resizer) {
            resizer.classList.toggle('hidden', isClosed);
        }

    } else {
        openBtn.classList.remove('hidden');
        closeBtn.classList.remove('hidden');
        sidebar.classList.remove('hidden'); 
    }
}


function setupSidebarEvents() {
    const dispatch = (page, id = null) => document.dispatchEvent(new CustomEvent('route-change', { detail: { page, id } }));
    
    document.getElementById('nav-dashboard')?.addEventListener('click', (e) => { 
        e.preventDefault(); 
        dispatch('dashboard'); 
    });
    document.getElementById('nav-inbox')?.addEventListener('click', (e) => { e.preventDefault(); dispatch('inbox'); });
    
    document.getElementById('nav-search')?.addEventListener('click', (e) => {
        e.preventDefault();
        dispatch('search');
    });

    document.getElementById('nav-settings')?.addEventListener('click', (e) => {
        e.preventDefault();
        showSettingsModal();
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
            sidebar.classList.toggle('sidebar-closed');
            updateSidebarVisibility();

            if (!sidebar.classList.contains('sidebar-closed')) {
                const savedWidth = localStorage.getItem('sidebarWidth') || '280';
                sidebar.style.width = `${savedWidth}px`;
            } else {
                localStorage.setItem('sidebarWidth', sidebar.style.width.replace('px', ''));
                sidebar.style.width = ''; 
            }
        }
    };

    document.getElementById('sidebar-open-btn')?.addEventListener('click', toggleSidebar);
    document.getElementById('sidebar-close-btn')?.addEventListener('click', toggleSidebar);
    document.getElementById('sidebar-close-mobile')?.addEventListener('click', toggleSidebar);
}