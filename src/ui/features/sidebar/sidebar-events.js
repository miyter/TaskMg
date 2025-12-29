import { APP_EVENTS } from '../../../core/event-constants';
import { getSidebarUI } from './sidebar-state.js';
import { isDesktop } from './sidebar-utils.js';
import { toggleSidebar } from './sidebar-view.js';
import { showSettingsModal } from '../../settings.js';
import { showFilterModal } from '../../modals/filter-modal.js';
import { showTimeBlockModal } from '../timeblock/timeblock-modal.js';
import { showCustomContextMenu } from './sidebar-components';
import { openInNewWindow } from '../../core/window-manager.js';

export function setupSidebarEvents() {
    const UI = getSidebarUI();
    const dispatch = (page, id = null) =>
        document.dispatchEvent(new CustomEvent(APP_EVENTS.ROUTE_CHANGE, { detail: { page, id } }));

    if (!UI.container) return;

    // イベント委譲の統合
    UI.container.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        const btn = e.target.closest('button');

        if (link) {
            e.preventDefault();

            const id = link.id;

            // 設定モーダルの場合、モバイルではサイドバーが閉じてから表示する（重なり防止）
            if (id === 'nav-settings') {
                if (!isDesktop()) {
                    toggleSidebar(false);
                    // サイドバーのアニメーション(300ms)完了を待つ
                    setTimeout(() => showSettingsModal(), 300);
                } else {
                    showSettingsModal();
                }
                return;
            }

            // モバイルならサイドバーを閉じる（その他のリンク）
            if (!isDesktop()) {
                toggleSidebar(false);
            }

            if (id === 'nav-dashboard') dispatch('dashboard');
            if (id === 'nav-inbox') dispatch('inbox');
            if (id === 'nav-search') dispatch('search');

            // Target Tools
            if (id === 'nav-wizard') dispatch('wizard');
            if (id === 'nav-target-dashboard') dispatch('target-dashboard');
            if (id === 'nav-wiki') dispatch('wiki');
            return;
        }

        if (btn) {
            const id = btn.id;
            if (id === 'add-filter-btn') showFilterModal();
            if (id === 'edit-timeblocks-btn') showTimeBlockModal();
        }
    });

    // 右クリックで別ウィンドウで開く（全てのナビゲーション項目に対応）
    UI.container.addEventListener('contextmenu', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const id = link.id;

        // 全てのビューマッピング
        const viewMap = {
            // 基本項目
            'nav-dashboard': 'dashboard',
            'nav-inbox': 'inbox',
            'nav-search': 'search',
            // 目標設計ツール
            'nav-wizard': 'wizard',
            'nav-target-dashboard': 'target-dashboard',
            'nav-wiki': 'wiki'
        };

        // プロジェクトやフィルターの動的項目も対応
        let viewType = viewMap[id];
        let itemId = null;

        if (!viewType) {
            // プロジェクト項目の場合
            if (link.dataset.projectId) {
                viewType = 'project';
                itemId = link.dataset.projectId;
            }
            // フィルター項目の場合
            else if (link.dataset.filterId) {
                viewType = 'filter';
                itemId = link.dataset.filterId;
            }
            // ラベル項目の場合
            else if (link.dataset.labelId) {
                viewType = 'label';
                itemId = link.dataset.labelId;
            }
        }

        if (viewType) {
            showCustomContextMenu(e, [
                {
                    label: '新しいウィンドウで開く',
                    action: () => openInNewWindow(viewType, itemId)
                }
            ]);
        }
    });
}
