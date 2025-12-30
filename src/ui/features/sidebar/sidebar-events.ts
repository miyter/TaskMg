import { APP_EVENTS } from '../../../core/event-constants';
import { openFilterEditModal } from '../../../store/ui/modal-store';
import { openInNewWindow } from '../../core/window-manager';
import { showCustomContextMenu } from './sidebar-components';
import { getSidebarUI } from './sidebar-state';
import { isDesktop } from './sidebar-utils';
import { toggleSidebar } from './sidebar-view';

export function setupSidebarEvents() {
    const UI = getSidebarUI();
    const dispatch = (page: string, id: string | null = null) =>
        document.dispatchEvent(new CustomEvent(APP_EVENTS.ROUTE_CHANGE, { detail: { page, id } }));

    if (!UI.container) return;

    // イベント委譲の統合
    UI.container.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const link = target.closest('a') as HTMLAnchorElement | null;
        const btn = target.closest('button') as HTMLButtonElement | null;

        if (link) {
            e.preventDefault();

            const id = link.id;

            // 設定モーダルの場合、モバイルではサイドバーが閉じてから表示する（重なり防止）
            if (id === 'nav-settings') {
                if (!isDesktop()) {
                    toggleSidebar(false);
                    // サイドバーのアニメーション(300ms)完了を待つ
                    setTimeout(() => openSettingsModal(), 300);
                } else {
                    openSettingsModal();
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
            if (id === 'add-filter-btn') openFilterEditModal();
            if (id === 'edit-timeblocks-btn') openTimeBlockModal();
        }
    });

    // 右クリックで別ウィンドウで開く（全てのナビゲーション項目に対応）
    UI.container.addEventListener('contextmenu', (e) => {
        const target = e.target as HTMLElement;
        const link = target.closest('a') as HTMLAnchorElement | null;
        if (!link) return;

        const id = link.id;

        // 全てのビューマッピング
        const viewMap: Record<string, string> = {
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
        let viewType: string | undefined = viewMap[id];
        let itemId: string | null = null;

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
            showCustomContextMenu(e as MouseEvent, [
                {
                    label: '新しいウィンドウで開く',
                    action: () => openInNewWindow(viewType!, itemId)
                }
            ]);
        }
    });
}
