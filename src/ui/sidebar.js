// @ts-nocheck
// @miyter:20251129

import { updateView, setCurrentFilter } from './ui-view-manager.js';
import { updateSidebarState, setupResizer, getRandomColor } from './sidebar-utils.js';
// ★修正: setupSidebarToggles をインポート
import { buildSidebarHTML, setupDropZone, setupSidebarToggles } from './sidebar-dom.js';
import { showProjectModal, showLabelModal } from './task-modal.js';
import { renderProjects, renderLabels, updateInboxCount, renderSidebarItems } from './sidebar-renderer.js';

// 外部公開する関数
export { renderSidebarItems, updateInboxCount, renderProjects, renderLabels };
export { initSidebar as renderSidebar };

let sidebarWidth = 280;

/**
 * サイドバーの初期化とイベントリスナーの設定
 * @param {Array} allTasks - 全タスクデータ (初期化時のカウント用)
 * @param {Array} allProjects - 全プロジェクトデータ
 * @param {Array} allLabels - 全ラベルデータ
 */
export function initSidebar(allTasks = [], allProjects = [], allLabels = []) {
    const container = document.getElementById('sidebar-content');
    if (!container) return;
    
    // 1. DOMの構築
    container.innerHTML = buildSidebarHTML();
    
    // 2. リサイズ/開閉ロジックの適用
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
    
    // 3. イベントリスナーの設定
    setupSidebarEvents();
    // ★追加: 折りたたみイベント設定
    setupSidebarToggles();
    
    // 4. インボックスへのドロップ設定 (DOM構築後に実行)
    setupDropZone(document.getElementById('nav-inbox'), 'inbox');
}

/**
 * 静的なナビゲーションとボタンのイベントを設定する
 */
function setupSidebarEvents() {
    const dispatch = (page, id = null) => document.dispatchEvent(new CustomEvent('route-change', { detail: { page, id } }));
    
    // 固定リンク
    document.getElementById('nav-dashboard')?.addEventListener('click', (e) => { 
        e.preventDefault(); 
        dispatch('dashboard'); 
    });
    document.getElementById('nav-inbox')?.addEventListener('click', (e) => { e.preventDefault(); dispatch('inbox'); });
    
    // プロジェクト/ラベル追加ボタン
    document.getElementById('add-project-btn')?.addEventListener('click', () => {
        showProjectModal(null, []); // 新規作成
    });
    
    document.getElementById('add-label-btn')?.addEventListener('click', () => {
        showLabelModal(null, []); // 新規作成
    });
    
    // フィルター追加ボタン（現在はプレースホルダー）
    document.getElementById('add-filter-btn')?.addEventListener('click', () => {
        // 将来的にフィルター作成モーダルを表示
        alert('フィルター作成機能は実装準備中です');
    });
    
    // サイドバー開閉ボタン
    document.getElementById('sidebar-toggle-btn')?.addEventListener('click', (e) => {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        const newState = !isCollapsed;

        localStorage.setItem('sidebarCollapsed', newState);
        updateSidebarState(sidebar, mainContent);
    });
}