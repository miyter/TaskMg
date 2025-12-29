/**
 * 更新日: 2025-12-27
 * 内容: ワークスペース読み込みタイミングの修正
 * TypeScript化: 2025-12-29
 */

import { auth, initializeFirebase } from '../../core/firebase';
import { onAuthStateChanged, User } from '../../core/firebase-sdk';
import { subscribeToWorkspaces } from '../../store/workspace';
import { setupAuthHandlers, updateAuthUI } from '../auth.js';
import { initWorkspaceDropdown, updateWorkspaceDropdownUI } from '../components/WorkspaceDropdown';
import { initSidebar } from '../features/sidebar/sidebar.js';
import { renderLayout } from '../layout/layout';
import { applyBackground, initTheme } from '../layout/theme';
import { renderLoginState } from '../layout/ui-view-utils';
import { initTaskModal } from '../modals/task-modal';
import { initSettings } from '../settings.js';
import {
    getWorkspaceUnsubscribe,
    setWorkspaceUnsubscribe,
    stopDataSync
} from './DataSyncManager';
import { setupGlobalEventListeners } from './EventManager';
import { applyAllUISettings } from './ui-settings-manager';

/**
 * 起動シーケンス
 */
export function runInitialization(): void {
    try {
        initializeFirebase();
    } catch (e) {
        console.error("Firebase Initialization Failed", e);
        return;
    }

    initTheme();
    renderLayout();

    // レイアウト生成後に背景を適用
    applyBackground();

    // UI設定を適用
    applyAllUISettings();

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
function setupAuthObserver(): void {
    if (!auth) return;

    onAuthStateChanged(auth, (user: User | null) => {
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
function handleUserLogin(user: User): void {
    initSidebar();

    // 既存のワークスペース購読があれば解除
    const prevUnsub = getWorkspaceUnsubscribe();
    if (typeof prevUnsub === 'function') prevUnsub();

    const unsubscribeWs = subscribeToWorkspaces(user.uid, (workspaces: any[]) => {
        updateWorkspaceDropdownUI(workspaces);
    });
    setWorkspaceUnsubscribe(unsubscribeWs);
}

/**
 * ログアウト時の処理
 */
function handleUserLogout(): void {
    const unsubWorkspaces = getWorkspaceUnsubscribe();
    if (typeof unsubWorkspaces === 'function') {
        unsubWorkspaces();
        setWorkspaceUnsubscribe(null);
    }

    // ワークスペース購読も止めるため true を指定
    stopDataSync(true);
    renderLoginState();

    // ログインフォーム再描画後にイベントリスナーを再設定
    setupAuthHandlers();
}
