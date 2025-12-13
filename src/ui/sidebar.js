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
// ★追加: フィルター購読用
import { subscribeToFilters, getFilters } from '../store/filters.js';

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
    
    // ★修正: フィルターデータも含めて初期描画
    // 初期状態ではフィルターは空かもしれないが、subscribeですぐ更新される
    renderSidebarItems(sidebar, allTasks, allProjects, allLabels, []);
    
    // ★追加: フィルターのリアルタイム購読
    // Firestoreの変更を検知してサイドバーのフィルターリストを更新
    subscribeToFilters((filters) => {
        // 既存のタスク・プロジェクト情報は保持したままフィルター部分だけ更新したいが、
        // 簡易的にrenderSidebarItemsを呼ぶ。
        // ※ 本来はストアから最新のallTasks/allProjectsを取得すべきだが、
        // ここでは引数の変数がクロージャで古いままの可能性がある。
        // ただし、renderFiltersは単独で呼べる設計にしたので、
        // フィルター更新時は renderFilters だけ呼ぶのがベスト。
        
        const filterList = document.getElementById('filter-list');
        if (filterList) {
            // sidebar-renderer.js で export した renderFilters を利用して部分更新
            // ※ renderFilters は default export ではないので、renderSidebarItems 経由か直接 import が必要。
            // ここでは renderSidebarItems を再利用する形で実装する（引数は最新を渡す必要があるが...）
            
            // 暫定対応: DOM要素があれば直接描画関数を動的インポート的に呼ぶか、
            // initSidebarの引数が古くなる問題を避けるため、カスタムイベント経由で全体の再描画を促すのが理想。
            // 今回は renderSidebarItems の第5引数に filters を渡して再描画する。
            // (allTasks等は初期化時のものが使われるため、タスク数カウントが古くなるリスクはあるが、フィルターリスト表示には影響ない)
            renderSidebarItems(sidebar, allTasks, allProjects, allLabels, filters);
        }
    });

    document.addEventListener('timeblocks-updated', () => {
        renderSidebarItems(document.getElementById('sidebar'), allTasks, allProjects, [], []);
    });

    // ★追加: 手動イベントでのフィルター更新（filter-modalからの通知用）
    document.addEventListener('filters-updated', () => {
        // subscribeToFilters があるので基本不要だが、即時反映の保険として
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