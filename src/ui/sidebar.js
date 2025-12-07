// @ts-nocheck
// @miyter:20251129

import { updateView, setCurrentFilter } from './ui-view-manager.js';
import { updateSidebarState, setupResizer } from './sidebar-utils.js';
// ★修正: setupDropZone を sidebar-dom.js ではなく sidebar-drag-drop.js からインポート
import { buildSidebarHTML, setupSidebarToggles } from './sidebar-dom.js';
import { setupDropZone } from './sidebar-drag-drop.js'; 
import { showProjectModal } from './task-modal.js';
import { showFilterModal } from './filter-modal.js';
import { showTimeBlockModal } from './timeblock-modal.js'; 
import { showSettingsModal } from './settings.js';
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

    // ★修正: HTMLに静的に組み込んだため、JSでの動的挿入ロジックは削除
    
    const sidebar = document.getElementById('sidebar');
    // mainContentではなく、親のapp全体で開閉状態を管理する (今回は不要だが、ロジック変更)
    const resizer = document.getElementById('sidebar-resizer');

    setupResizer(sidebar, document.querySelector('main'), resizer);
    
    setupSidebarEvents();
    setupSidebarToggles();
    
    setupDropZone(document.getElementById('nav-inbox'), 'inbox');
    
    renderSidebarItems(sidebar, allTasks, allProjects, allLabels);
    
    document.addEventListener('timeblocks-updated', () => {
        renderSidebarItems(document.getElementById('sidebar'), allTasks, allProjects, []);
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
    
    // ★追加: 初期状態で開閉ボタンの表示/非表示を決定
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

    // サイドバーが閉じている状態かチェック
    const isClosed = sidebar.classList.contains('sidebar-closed');

    // デスクトップの場合
    if (window.innerWidth >= 768) {
        // 閉じていれば開くボタンを表示し、閉じるボタンを非表示
        openBtn.classList.toggle('hidden', !isClosed); 
        closeBtn.classList.toggle('hidden', isClosed);
        // 閉じた状態ではサイドバー自体を非表示 (領域を解放)
        sidebar.classList.toggle('hidden', isClosed); 

        // リサイズハンドルも非表示にする
        const resizer = document.getElementById('sidebar-resizer');
        if (resizer) {
            resizer.classList.toggle('hidden', isClosed);
        }

    } else {
        // モバイルの場合 (常に開くボタンは表示、閉じるボタンはサイドバー内)
        // モバイルでは `translate-x-full` で制御するため、`hidden` は使わない
        openBtn.classList.remove('hidden'); // モバイルでは常にハンバーガーを表示
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
            // モバイル: translateで開閉
            sidebar.classList.toggle('-translate-x-full');
        } else {
            // デスクトップ: カスタムクラスで開閉し、幅を維持
            sidebar.classList.toggle('sidebar-closed');
            
            // 開閉状態に応じて、開閉ボタンの表示を更新
            updateSidebarVisibility();

            // サイドバーを閉じるときは、リサイズで設定されたwidthを保存
            if (!sidebar.classList.contains('sidebar-closed')) {
                // 開くとき: 保存された幅に戻す
                const savedWidth = localStorage.getItem('sidebarWidth') || '280';
                sidebar.style.width = `${savedWidth}px`;
            } else {
                // 閉じるとき: 現在の幅を保存し、一旦widthをクリア
                localStorage.setItem('sidebarWidth', sidebar.style.width.replace('px', ''));
                sidebar.style.width = ''; // CSSで非表示にするためwidthをクリア
            }
        }
    };

    document.getElementById('sidebar-open-btn')?.addEventListener('click', toggleSidebar);
    document.getElementById('sidebar-close-btn')?.addEventListener('click', toggleSidebar);
    // モバイルクローズボタンはモバイル時にのみ使われるが、ロジックは統合
    document.getElementById('sidebar-close-mobile')?.addEventListener('click', toggleSidebar);
}