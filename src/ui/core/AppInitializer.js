/**
 * 更新日: 2025-12-27
 * 内容: ワークスペース読み込みタイミングの修正
 *      - subscribeToWorkspaces のコールバック内で startAllSubscriptions を呼び出さないように変更
 *      - workspace-changed イベントに同期開始を任せることで、タイミング問題を解決
 *      - ページ状態の復元処理を EventManager.js に移動
 */

import { onAuthStateChanged } from '../../core/firebase-sdk.js';
import { initializeFirebase, auth } from '../../core/firebase.js';
import { updateAuthUI, setupAuthHandlers } from '../auth.js';
import { renderLayout } from '../layout/layout.js';
import { initTheme } from '../layout/theme.js';
import { initTaskModal } from '../modals/task-modal.js';
import { initSidebar } from '../features/sidebar/sidebar.js';
import { initSettings } from '../settings.js';
import { renderLoginState } from '../layout/ui-view-utils.js';
import { initWorkspaceDropdown, updateWorkspaceDropdownUI } from '../components/WorkspaceDropdown.js';
import {
    stopDataSync,
    getWorkspaceUnsubscribe,
    setWorkspaceUnsubscribe
} from './DataSyncManager.js';
import { setupGlobalEventListeners } from './EventManager.js';
import { subscribeToWorkspaces } from '../../store/workspace.js';

/**
 * 起動シーケンス
 */
export function runInitialization() {
    try {
        initializeFirebase();
    } catch (e) {
        console.error("Firebase Initialization Failed", e);
        return;
    }

    initTheme();
    renderLayout();
    initSettings();
    initTaskModal();
    initWorkspaceDropdown();
    setupAuthHandlers();
    setupGlobalEventListeners();

    setupAuthObserver();
}

/**
 * 認証状態の監視
 */
function setupAuthObserver() {
    if (!auth) return;

    onAuthStateChanged(auth, (user) => {
        updateAuthUI(user);
        if (user) {
            handleUserLogin(user);
        } else {
            handleUserLogout();
        }
    });
}

/**
 * ログイン時の処理
 */
function handleUserLogin(user) {
    initSidebar();

    // 既存のワークスペース購読があれば解除
    const prevUnsub = getWorkspaceUnsubscribe();
    if (typeof prevUnsub === 'function') prevUnsub();

    const unsubscribeWs = subscribeToWorkspaces(user.uid, (workspaces) => {
        updateWorkspaceDropdownUI(workspaces);

        // ワークスペースが確定した後、workspace.js から workspace-changed イベントが発火され、
        // EventManager.js でそのイベントを受け取って startAllSubscriptions() が呼ばれる。
        // ここでは呼び出さない（タイミングの問題を避けるため）
    });
    setWorkspaceUnsubscribe(unsubscribeWs);
}

/**
 * ログアウト時の処理
 */
function handleUserLogout() {
    const unsubWorkspaces = getWorkspaceUnsubscribe();
    if (typeof unsubWorkspaces === 'function') {
        unsubWorkspaces();
        setWorkspaceUnsubscribe(null);
    }

    // ワークスペース購読も止めるため true を指定
    stopDataSync(true);
    renderLoginState();
}