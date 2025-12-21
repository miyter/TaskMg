// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: イベントハンドラ追加、設定値判定の厳格化
 */

import { setupResizer } from './sidebar-utils.js';
import { buildSidebarHTML, setupSidebarToggles } from './sidebar-structure.js';
import { setupDropZone } from './sidebar-drag-drop.js';
import { showFilterModal } from './filter-modal.js';
import { showTimeBlockModal } from './timeblock-modal.js';
import { showSettingsModal } from './settings.js';
import { initSidebarProjects, updateSidebarProjects } from './components/SidebarProjects.js';
import { updateInboxCount } from './sidebar-renderer.js';

export { updateSidebarProjects as renderProjects, updateInboxCount };

export function initSidebar() {
    const container = document.getElementById('sidebar-content');
    if (!container) return;

    container.innerHTML = buildSidebarHTML();

    const sidebar = document.getElementById('sidebar');
    const resizer = document.getElementById('sidebar-resizer');

    setupResizer(sidebar, document.querySelector('main'), resizer);
    setupSidebarEvents();
    setupSidebarToggles();
    setupDropZone(document.getElementById('nav-inbox'), 'inbox');

    // コンポーネント初期化
    initSidebarProjects(container);

    updateSidebarVisibility();
    window.addEventListener('resize', updateSidebarVisibility);

    applyInitialSettings();
    setupCompactModeListener();
}

/**
 * 初期の表示設定（コンパクトモードなど）を適用
 */
function applyInitialSettings() {
    // 修正: 'true' で完全統一
    const isCompact = localStorage.getItem('sidebar_compact') === 'true';
    applyCompactMode(isCompact);
}

/**
 * コンパクトモードのスタイル適用
 */
function applyCompactMode(isCompact) {
    document.querySelectorAll('.sidebar-item-row').forEach(item => {
        if (isCompact) {
            item.classList.add('py-0.5');
            item.classList.remove('py-1.5');
        } else {
            item.classList.add('py-1.5');
            item.classList.remove('py-0.5');
        }
    });
}

function setupSidebarEvents() {
    const dispatch = (page, id = null) => document.dispatchEvent(new CustomEvent('route-change', { detail: { page, id } }));

    // ナビゲーション
    document.getElementById('nav-dashboard')?.addEventListener('click', (e) => { e.preventDefault(); dispatch('dashboard'); });
    document.getElementById('nav-inbox')?.addEventListener('click', (e) => { e.preventDefault(); dispatch('inbox'); });
    document.getElementById('nav-search')?.addEventListener('click', (e) => { e.preventDefault(); dispatch('search'); });
    document.getElementById('nav-settings')?.addEventListener('click', (e) => { e.preventDefault(); showSettingsModal(); });

    // 追加ボタン
    document.getElementById('add-filter-btn')?.addEventListener('click', () => showFilterModal());
    document.getElementById('edit-timeblocks-btn')?.addEventListener('click', () => showTimeBlockModal());

    // サイドバー開閉ボタン
    document.getElementById('sidebar-open-btn')?.addEventListener('click', () => toggleSidebar(true));
    document.getElementById('sidebar-close-btn')?.addEventListener('click', () => toggleSidebar(false));
}

/**
 * サイドバーの開閉切替
 */
function toggleSidebar(open) {
    const sidebar = document.getElementById('sidebar');
    const resizer = document.getElementById('sidebar-resizer');

    if (sidebar) {
        sidebar.classList.toggle('sidebar-closed', !open);
        sidebar.classList.toggle('hidden', !open);

        // モバイル表示のときはhiddenクラスで制御、PCではwidth制御もあるがここではhidden/closedで管理
        if (window.innerWidth >= 768) {
            if (resizer) resizer.classList.toggle('hidden', !open);
            // 幅の復元などはCSSまたはutils側で制御
            if (open) {
                const w = localStorage.getItem('sidebarWidth') || 280;
                sidebar.style.width = `${w}px`;
            } else {
                sidebar.style.width = '0';
            }
        }
        updateSidebarVisibility();
    }
}

function updateSidebarVisibility() {
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.getElementById('sidebar-open-btn');
    const closeBtn = document.getElementById('sidebar-close-btn');
    if (!sidebar || !openBtn || !closeBtn) return;

    // クラスベースか、実際の表示状態かで判定
    const isClosed = sidebar.classList.contains('sidebar-closed') || sidebar.classList.contains('hidden');

    if (window.innerWidth >= 768) {
        // デスクトップ
        openBtn.classList.toggle('hidden', !isClosed);
        closeBtn.classList.toggle('hidden', isClosed);
        // sidebar自体の表示切り替えは toggleSidebar で制御済みだが、リサイズ時の補正
        if (!isClosed) sidebar.classList.remove('hidden');
    } else {
        // モバイル
        openBtn.classList.remove('hidden');
        closeBtn.classList.remove('hidden');
        sidebar.classList.remove('hidden');
    }
}

function setupCompactModeListener() {
    window.addEventListener('sidebar-settings-updated', (e) => {
        // 型強制してbooleanとして扱う
        const isCompact = Boolean(e.detail.compact);
        applyCompactMode(isCompact);
    });
}