/**
 * 更新日: 2025-12-27
 * 内容: 存在しない toggle-completed-btn のリスナーを削除（ランタイムエラー修正）
 * TypeScript化: 2025-12-29
 */

import { APP_EVENTS } from '../../core/event-constants';
import { auth } from '../../core/firebase';
import { setupCustomSortDropdown } from '../components/SortDropdown';
import { setCurrentFilter } from '../layout/ui-view-manager';
import { startAllSubscriptions, stopDataSync, updateUI } from './DataSyncManager.js';
import { getInitialViewMode, isWindowMode } from './window-manager';

/**
 * デバウンス関数（高頻度イベントの間引き）
 */
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: number | undefined;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = window.setTimeout(() => func(...args), wait);
    };
}

/**
 * アプリケーション全体のイベントリスナーを設定
 */
export function setupGlobalEventListeners(): void {
    try {
        // 初回ログインフラグ（ページ状態復元用）
        let isFirstWorkspaceLoad = true;

        // 1. ワークスペース切り替え
        document.addEventListener(APP_EVENTS.WORKSPACE_CHANGED, (e: any) => {
            const { workspaceId } = e.detail;
            console.log('[EventManager] Workspace changed to:', workspaceId);

            const headerTitle = document.getElementById('header-title');
            if (headerTitle) headerTitle.textContent = '読み込み中...';

            if (auth?.currentUser) {
                // 初回ログイン時はwindowモードまたは保存されたページ状態を確認
                if (isFirstWorkspaceLoad) {
                    isFirstWorkspaceLoad = false;

                    if (isWindowMode()) {
                        const initialView = getInitialViewMode();
                        if (initialView) {
                            setCurrentFilter({ type: initialView });
                        }
                    } else {
                        try {
                            const saved = JSON.parse(localStorage.getItem('lastPage') || 'null');
                            // 設定画面は自動で開かないようにする
                            if (saved && saved.page === 'settings') {
                                setCurrentFilter({ type: 'inbox' });
                            } else {
                                setCurrentFilter(saved ? { type: saved.page, id: saved.id || null } : { type: 'inbox' });
                            }
                        } catch (e) {
                            setCurrentFilter({ type: 'inbox' });
                        }
                    }
                } else {
                    // ワークスペース切り替え時はインボックスにリセット
                    setCurrentFilter({ type: 'inbox', id: null });
                }

                // 一旦全てのデータ同期を停止し、再開する
                stopDataSync(false);
                startAllSubscriptions();

                // 即座にUIを更新（クリア状態またはロード中表示のため）
                updateUI();
            }
        });

        // 2. ルーティング（サイドバー等）
        document.addEventListener(APP_EVENTS.ROUTE_CHANGE, (e: any) => {
            const { page, id } = e.detail;
            setCurrentFilter({ type: page, id: id || null });

            // 設定画面は保存しない
            if (page !== 'settings') {
                localStorage.setItem('lastPage', JSON.stringify({ page, id: id || null }));
            }
            updateUI();
        });

        // 3. 検索・フィルタUI
        const debouncedSearch = debounce(() => updateUI(), 300);
        document.getElementById('search-input')?.addEventListener('input', debouncedSearch);

        // 4. コンポーネント固有のイベント
        setupCustomSortDropdown();
    } catch (error) {
        console.error('[EventManager] Failed to setup global event listeners:', error);
    }
}
