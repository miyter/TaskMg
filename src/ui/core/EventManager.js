// @ts-nocheck
/**
 * 更新日: 2025-12-27
 * 内容: 存在しない toggle-completed-btn のリスナーを削除（ランタイムエラー修正）
 */

import { auth } from '../../core/firebase.js';
import { setCurrentFilter } from '../layout/ui-view-manager.js';
import { startAllSubscriptions, stopDataSync, updateUI } from './DataSyncManager.js';
import { setupCustomSortDropdown } from '../components/SortDropdown.js';
import { isWindowMode, getInitialViewMode } from './window-manager.js';

/**
 * デバウンス関数（高頻度イベントの間引き）
 */
function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * アプリケーション全体のイベントリスナーを設定
 */
export function setupGlobalEventListeners() {
    // 初回ログインフラグ（ページ状態復元用）
    let isFirstWorkspaceLoad = true;

    // 1. ワークスペース切り替え
    document.addEventListener('workspace-changed', (e) => {
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
                        const saved = JSON.parse(localStorage.getItem('lastPage'));
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
                // ワークスペース切り替え時はインボックスにリセット（ウィンドウモードでも切り替え時は一旦Homeに戻す運用とするか、あるいは維持するか。ここではシンプルにリセット）
                // ただしウィンドウモードの場合はパラメータを維持したいかもしれないが、ワークスペースまたぐのは稀なので一旦Homeへ
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
    document.addEventListener('route-change', (e) => {
        const { page, id } = e.detail;
        setCurrentFilter({ type: page, id: id || null });

        // 設定画面は保存しない
        if (page !== 'settings') {
            localStorage.setItem('lastPage', JSON.stringify({ page, id: id || null }));
        }
        updateUI();
    });

    // 3. 検索・フィルタUI
    // 検索入力は頻度が高いのでデバウンスを適用して負荷軽減
    const debouncedSearch = debounce(() => updateUI(), 300);
    document.getElementById('search-input')?.addEventListener('input', debouncedSearch);

    // 4. コンポーネント固有のイベント
    setupCustomSortDropdown();
}