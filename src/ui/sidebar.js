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
        // style属性ではなくクラス管理に変更したため、ここは調整が必要だが
        // リサイズ機能を維持する場合はstyleも併用するケースがある。
        // 今回はTailwindクラスベースの開閉ロジックを優先するため幅設定は一時的に無効化またはクラス併用
        sidebar.style.width = `${sidebarWidth}px`;
    }

    // updateSidebarState(sidebar, mainContent); // 今回は自前で制御するためコメントアウト推奨だが残しておく
    setupResizer(sidebar, mainContent, resizer);
    
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
    
    // ★追加: サイドバーの開閉トグルロジック
    // デスクトップ・モバイル両対応
    const toggleSidebar = () => {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;

        // モバイル: -translate-x-full をトグル (画面外からスライド)
        // デスクトップ: w-[280px] と w-0 をトグル (幅をアニメーション)
        
        // 現在の状態を確認 (md以上かどうかで分岐したほうが綺麗だが、簡易的に両方トグルでも動作するようクラス構成済み)
        sidebar.classList.toggle('-translate-x-full'); // モバイル用 (デフォルトで付いているクラス)
        sidebar.classList.toggle('translate-x-0');     // モバイル用 (開くとき)
        
        // デスクトップ用: md:translate-x-0 がlayout.jsで指定されているため、モバイル用クラスはデスクトップでは無視されるはずだが
        // layout.jsで `md:translate-x-0` を書いたので、デスクトップでは常に表示状態がデフォルト。
        // デスクトップで閉じるには、明示的にマージンや幅を操作する必要がある。
        
        if (window.innerWidth >= 768) { // md breakpoint
            if (sidebar.classList.contains('w-[280px]')) {
                sidebar.classList.remove('w-[280px]');
                sidebar.classList.add('w-0', 'overflow-hidden', 'border-none');
            } else {
                sidebar.classList.add('w-[280px]');
                sidebar.classList.remove('w-0', 'overflow-hidden', 'border-none');
            }
        } else {
            // モバイル用: オーバーレイ開閉などのロジックがあればここに追加
        }
    };

    document.getElementById('sidebar-toggle-btn')?.addEventListener('click', toggleSidebar);
    document.getElementById('sidebar-close-mobile')?.addEventListener('click', toggleSidebar);
}