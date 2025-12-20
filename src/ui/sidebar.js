// @ts-nocheck
// @miyter:20251221
// サイドバーの初期化と構造・イベント管理

import { setupResizer } from './sidebar-utils.js';
import { buildSidebarHTML, setupSidebarToggles } from './sidebar-dom.js';
import { setupDropZone } from './sidebar-drag-drop.js'; 
import { showFilterModal } from './filter-modal.js';
import { showTimeBlockModal } from './timeblock-modal.js'; 
import { showSettingsModal } from './settings.js';
import { initSidebarProjects } from './components/SidebarProjects.js';

/**
 * サイドバーの初期セットアップ
 * 実際のデータ描画は DataSyncManager が担うため、ここでは静的な構造とイベントのみを定義する
 */
export function initSidebar() {
    const container = document.getElementById('sidebar-content');
    if (!container) return;
    
    // 1. 基本構造の流し込み
    container.innerHTML = buildSidebarHTML();

    const sidebar = document.getElementById('sidebar');
    const resizer = document.getElementById('sidebar-resizer');

    // 2. リサイザーと開閉トグルの初期化
    setupResizer(sidebar, document.querySelector('main'), resizer);
    setupSidebarEvents();
    setupSidebarToggles();
    
    // 3. インボックスへのドロップを有効化
    setupDropZone(document.getElementById('nav-inbox'), 'inbox');

    // 4. プロジェクトセクション（個別コンポーネント）の初期化
    initSidebarProjects(container);

    // 5. 初期表示とレスポンシブ設定
    updateSidebarVisibility();
    window.addEventListener('resize', updateSidebarVisibility);
    setupCompactModeListener();
}

/**
 * 静的なナビゲーションイベントの設定
 */
function setupSidebarEvents() {
    const dispatch = (page, id = null) => document.dispatchEvent(new CustomEvent('route-change', { detail: { page, id } }));
    
    document.getElementById('nav-dashboard')?.addEventListener('click', (e) => { e.preventDefault(); dispatch('dashboard'); });
    document.getElementById('nav-inbox')?.addEventListener('click', (e) => { e.preventDefault(); dispatch('inbox'); });
    document.getElementById('nav-search')?.addEventListener('click', (e) => { e.preventDefault(); dispatch('search'); });
    document.getElementById('nav-settings')?.addEventListener('click', (e) => { e.preventDefault(); showSettingsModal(); });
    
    document.getElementById('add-filter-btn')?.addEventListener('click', () => showFilterModal());
    document.getElementById('edit-timeblocks-btn')?.addEventListener('click', () => showTimeBlockModal());
    
    const toggleSidebar = () => {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;

        if (window.innerWidth < 768) {
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

/**
 * サイドバーの開閉状態とボタンの同期
 */
function updateSidebarVisibility() {
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.getElementById('sidebar-open-btn');
    const closeBtn = document.getElementById('sidebar-close-btn');
    if (!sidebar || !openBtn || !closeBtn) return;

    const isClosed = sidebar.classList.contains('sidebar-closed');
    const resizer = document.getElementById('sidebar-resizer');

    if (window.innerWidth >= 768) {
        openBtn.classList.toggle('hidden', !isClosed); 
        closeBtn.classList.toggle('hidden', isClosed);
        sidebar.classList.toggle('hidden', isClosed); 
        if (resizer) resizer.classList.toggle('hidden', isClosed);
    } else {
        openBtn.classList.remove('hidden');
        closeBtn.classList.remove('hidden');
        sidebar.classList.remove('hidden'); 
    }
}

/**
 * 設定変更に伴うスタイル調整リスナー
 */
function setupCompactModeListener() {
    window.addEventListener('sidebar-settings-updated', (e) => {
        const isCompact = e.detail.compact;
        document.querySelectorAll('.sidebar-item-row').forEach(item => {
            item.classList.toggle('py-0.5', isCompact);
            item.classList.toggle('py-1.5', !isCompact);
        });
    });
}