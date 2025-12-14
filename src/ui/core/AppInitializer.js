// @ts-nocheck
// アプリケーションの初期化ロジック

// 修正: SDKラッパー経由
import { onAuthStateChanged } from '../../core/firebase-sdk.js';
import { auth, initializeFirebase } from '../../core/firebase.js';

// UI初期化関連
import { updateAuthUI } from '../auth.js';
import { renderLayout } from '../layout.js';
import { initTheme } from '../theme.js';
import { initTaskModal } from '../task-modal.js';
import { initSidebar } from '../sidebar.js';
import { initSettings } from '../settings.js';
import { setCurrentFilter, renderLoginState } from '../ui-view-manager.js';
import { updateWorkspaceDropdownUI } from '../components/WorkspaceDropdown.js'; // 追加

// コアモジュール
import { startAllSubscriptions, stopDataSync, getWorkspaceUnsubscribe, setWorkspaceUnsubscribe, isSyncing } from './DataSyncManager.js';
import { setupGlobalEventListeners } from './EventManager.js';
import { subscribeToWorkspaces, getCurrentWorkspaceId } from '../../store/workspace.js';

/**
 * アプリケーションの初期化を実行する
 */
export function runInitialization() {
    try {
        initializeFirebase();
    } catch (e) {
        console.error("Critical Error: Failed to initialize Firebase.", e);
        return;
    }

    initTheme();
    renderLayout();
    initSettings();
    initTaskModal();
    setupGlobalEventListeners();
    restorePageState();
    setupAuthObserver();
}

/**
 * ページ状態（フィルター等）をLocalStorageから復元
 */
function restorePageState() {
    try {
        const saved = localStorage.getItem('lastPage');
        if (saved) {
            const { page, id } = JSON.parse(saved);
            setCurrentFilter({ type: page, id: id || null });
        } else {
            setCurrentFilter({ type: 'inbox' });
        }
    } catch (e) {
        console.error('Failed to restore page state:', e);
        setCurrentFilter({ type: 'inbox' });
    }
}

/**
 * 認証状態の監視とデータ同期の制御
 */
function setupAuthObserver() {
    if (!auth) {
        console.error("Auth object is not available.");
        return;
    }

    onAuthStateChanged(auth, (user) => {
        updateAuthUI(user);
        
        if (user) {
            handleUserLogin();
        } else {
            handleUserLogout();
        }
    });
}

function handleUserLogin() {
    if (!auth.currentUser) {
        setTimeout(handleUserLogin, 100);
        return;
    }

    // ログイン直後にサイドバーの基盤（DOM）を初期化
    initSidebar();

    // ワークスペース購読開始（未購読の場合）
    let unsubscribeWorkspaces = getWorkspaceUnsubscribe();
    
    if (!unsubscribeWorkspaces) {
        // ここで認証済みユーザーとして安全に購読開始
        unsubscribeWorkspaces = subscribeToWorkspaces((workspaces) => {
            // UI更新: WorkspaceDropdownにデータを渡す
            updateWorkspaceDropdownUI(workspaces);

            // データ同期開始チェック
            const currentWorkspaceId = getCurrentWorkspaceId();
            if (currentWorkspaceId && !isSyncing()) {
                console.log('Workspace ready, starting data sync:', currentWorkspaceId);
                startAllSubscriptions();
            }
        });
        setWorkspaceUnsubscribe(unsubscribeWorkspaces);
    }
}

function handleUserLogout() {
    // ワークスペース購読解除
    let unsubscribeWorkspaces = getWorkspaceUnsubscribe();
    if (unsubscribeWorkspaces) {
        unsubscribeWorkspaces();
        setWorkspaceUnsubscribe(null);
    }
    
    // データ同期停止 & UIリセット
    stopDataSync();
    renderLoginState();
}