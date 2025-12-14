// @ts-nocheck
// サイドバー制御

import { updateView, setCurrentFilter } from './ui-view-manager.js';
import { updateSidebarState, setupResizer } from './sidebar-utils.js';
import { buildSidebarHTML, setupSidebarToggles } from './sidebar-dom.js';
import { setupDropZone } from './sidebar-drag-drop.js'; 
import { showProjectModal } from './modal/project-modal.js';
import { showFilterModal } from './filter-modal.js';
import { showTimeBlockModal } from './timeblock-modal.js'; 
import { showSettingsModal } from './settings.js';
import { renderSidebarItems, renderProjects } from './sidebar-renderer.js';
import { subscribeToFilters, getFilters } from '../store/filters.js';
import { subscribeToTimeBlocks } from '../store/timeblocks.js';
import { subscribeToProjects } from '../store/projects.js';
// ★追加: ワークスペース関連のインポート
import { subscribeToWorkspaces, addWorkspace, setCurrentWorkspaceId, getCurrentWorkspaceId } from '../store/workspace.js';
import { showMessageModal } from './components.js';

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

    // ★追加: ワークスペースのUIセットアップと購読
    setupWorkspaceDropdown();

    // プロジェクトのリアルタイム購読
    subscribeToProjects((projects) => {
        if (sidebar) {
            const currentFilters = typeof getFilters === 'function' ? getFilters() : [];
            renderSidebarItems(sidebar, allTasks, projects, allLabels, currentFilters);
        }
    });
    
    // フィルターのリアルタイム購読
    subscribeToFilters((filters) => {
        const filterList = document.getElementById('filter-list');
        if (filterList) {
            renderSidebarItems(sidebar, allTasks, allProjects, allLabels, filters);
        }
    });

    // 時間帯のリアルタイム購読
    subscribeToTimeBlocks((timeBlocks) => {
        const tbList = document.getElementById('timeblock-list');
        if (tbList) {
            const currentFilters = getFilters();
            renderSidebarItems(sidebar, allTasks, allProjects, allLabels, currentFilters);
        }
    });

    document.addEventListener('timeblocks-updated', () => {
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
 * ワークスペースドロップダウンのロジック設定
 */
function setupWorkspaceDropdown() {
    const trigger = document.getElementById('workspace-trigger');
    const menu = document.getElementById('workspace-menu');
    const label = document.getElementById('workspace-label');
    const listContainer = document.getElementById('workspace-list');
    const addBtn = document.getElementById('add-workspace-btn');
    const settingsBtn = document.getElementById('settings-workspace-btn');

    if (!trigger || !menu) return;

    // 開閉ロジック
    const closeMenu = (e) => {
        if (e && (menu.contains(e.target) || trigger.contains(e.target))) return;
        menu.classList.replace('opacity-100', 'opacity-0');
        menu.classList.replace('visible', 'invisible');
        menu.classList.replace('scale-100', 'scale-95');
        menu.classList.replace('pointer-events-auto', 'pointer-events-none');
        document.removeEventListener('click', closeMenu);
    };

    const toggleMenu = () => {
        const isOpen = menu.classList.contains('opacity-100');
        if (isOpen) {
            closeMenu();
        } else {
            menu.classList.replace('opacity-0', 'opacity-100');
            menu.classList.replace('invisible', 'visible');
            menu.classList.replace('scale-95', 'scale-100');
            menu.classList.replace('pointer-events-none', 'pointer-events-auto');
            document.addEventListener('click', closeMenu);
        }
    };

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // 追加ボタン
    if (addBtn) {
        addBtn.addEventListener('click', async () => {
            closeMenu();
            const name = window.prompt("新しいワークスペース名を入力してください:");
            if (name && name.trim()) {
                try {
                    const newWorkspace = await addWorkspace(name.trim());
                    setCurrentWorkspaceId(newWorkspace.id); // 作成後に切り替え
                } catch (err) {
                    console.error("Failed to add workspace:", err);
                    showMessageModal("ワークスペースの作成に失敗しました");
                }
            }
        });
    }

    // 設定ボタン
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            closeMenu();
            showSettingsModal(); // 設定モーダルで名前変更などを想定
        });
    }

    // データ購読してUI更新
    subscribeToWorkspaces((workspaces) => {
        if (!listContainer || !label) return;
        
        const currentId = getCurrentWorkspaceId();
        const currentWs = workspaces.find(w => w.id === currentId);
        
        // ラベル更新
        if (currentWs) {
            label.textContent = currentWs.name;
            label.classList.remove('text-gray-400');
        } else {
            label.textContent = "ワークスペースを選択";
            label.classList.add('text-gray-400');
        }

        // リスト更新
        listContainer.innerHTML = '';
        workspaces.forEach(ws => {
            const btn = document.createElement('button');
            const isActive = ws.id === currentId;
            btn.className = `w-full text-left px-4 py-2 text-sm flex items-center justify-between group transition-colors ${
                isActive 
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`;
            
            btn.innerHTML = `
                <span class="truncate">${ws.name}</span>
                ${isActive ? '<svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' : ''}
            `;
            
            btn.addEventListener('click', () => {
                if (!isActive) {
                    setCurrentWorkspaceId(ws.id);
                    // UI更新はイベントリスナー経由で行われるためここでは何もしない
                }
                closeMenu();
            });
            
            listContainer.appendChild(btn);
        });
    });
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
        showProjectModal(); // 新規作成
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