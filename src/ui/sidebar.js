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
    
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content'); // layout.jsでIDが変更されている場合は注意
    const resizer = document.getElementById('sidebar-resizer');

    // ★修正: style属性による幅指定を削除し、クラスベースの管理に任せる
    // if (sidebar) {
    //     const storedWidth = localStorage.getItem('sidebarWidth');
    //     sidebarWidth = storedWidth ? parseInt(storedWidth, 10) : 280;
    //     sidebar.style.width = `${sidebarWidth}px`;
    // }

    // リサイズ機能はクラスベースの開閉と競合するため、必要ならロジック調整が必要だが今回はsetupResizerをそのまま呼ぶ
    // (ただし開閉時はリサイズ無効化などの考慮が必要)
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
    
    // ★追加: サイドバーの開閉トグルロジック (クラスベース)
    const toggleSidebar = () => {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;

        // モバイルかどうか判定 (Tailwindのmdブレークポイント: 768px)
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            // モバイル: スライドイン/アウト (-translate-x-full をトグル)
            sidebar.classList.toggle('-translate-x-full');
            // 必要に応じてオーバーレイなどの制御を追加
        } else {
            // デスクトップ: 幅のアニメーション
            // 初期状態は w-[280px]
            if (sidebar.classList.contains('w-[280px]')) {
                // 閉じる
                sidebar.classList.remove('w-[280px]');
                sidebar.classList.add('w-0');
                sidebar.classList.add('border-none'); // 閉じたときにボーダーも消す
                sidebar.classList.add('overflow-hidden');
            } else {
                // 開く
                sidebar.classList.remove('w-0');
                sidebar.classList.remove('border-none');
                sidebar.classList.remove('overflow-hidden');
                sidebar.classList.add('w-[280px]');
            }
        }
    };

    // イベントリスナーの登録（重複防止のため一度削除してから登録はしないが、初期化時に1回呼ばれる前提）
    document.getElementById('sidebar-toggle-btn')?.addEventListener('click', toggleSidebar);
    document.getElementById('sidebar-close-mobile')?.addEventListener('click', toggleSidebar);
}