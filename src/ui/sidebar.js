// @ts-nocheck
// @miyter:20251129

import { updateView, setCurrentFilter } from './ui-view-manager.js';
import { updateSidebarState, setupResizer } from './sidebar-utils.js';
import { buildSidebarHTML, setupDropZone, setupSidebarToggles } from './sidebar-dom.js';
import { showProjectModal } from './task-modal.js';
import { showFilterModal } from './filter-modal.js';
import { showTimeBlockModal } from './timeblock-modal.js'; 
// ★修正: renderProjects を追加インポート
import { renderSidebarItems, renderProjects } from './sidebar-renderer.js';

// 外部公開
export { renderSidebarItems, renderProjects };
export { initSidebar as renderSidebar };

// ★追加: 廃止された機能や移動した機能への参照エラーを防ぐためのダミーエクスポート
export function renderLabels() { /* 廃止: 時間帯ブロックへ移行 */ }
export function updateInboxCount() { /* renderSidebarItems内で更新されるため空でOK */ }

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
    
    // 時間帯更新イベントの購読（モーダルからの更新通知）
    document.addEventListener('timeblocks-updated', () => {
        // 再描画をトリガー（実際はApp.jsからデータを受け取る構造なので、簡易的なリフレッシュ）
        renderSidebarItems(document.getElementById('sidebar'), allTasks, allProjects, []);
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
    
    // ラベル追加ボタンは削除されたのでイベントリスナーも不要
    
    document.getElementById('add-filter-btn')?.addEventListener('click', () => {
        showFilterModal();
    });
    
    // ★追加: 時間帯編集ボタン
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