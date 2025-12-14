// @ts-nocheck
// アプリケーションの初期化ロジック

import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { auth, initializeFirebase } from '../../core/firebase.js';

// UI初期化関連
import { updateAuthUI } from '../auth.js';
import { renderLayout } from '../layout.js';
import { initTheme } from '../theme.js';
import { initTaskModal } from '../task-modal.js';
import { initSidebar } from '../sidebar.js';
import { initSettings } from '../settings.js';
import { setCurrentFilter, renderLoginState } from '../ui-view-manager.js';

// コアモジュール
import { startAllSubscriptions, stopDataSync, getWorkspaceUnsubscribe, setWorkspaceUnsubscribe, isSyncing } from './DataSyncManager.js';
import { setupGlobalEventListeners } from './EventManager.js';
import { subscribeToWorkspaces, getCurrentWorkspaceId } from '../../store/workspace.js';

/**
 * アプリケーションの初期化を実行する
 */
export function runInitialization() {
    // Firebase初期化
    try {
        initializeFirebase();
    } catch (e) {
        console.error("Critical Error: Failed to initialize Firebase.", e);
        return;
    }

    // UIコンポーネント初期化
    initTheme();
    renderLayout();
    initSettings();
    initTaskModal();
    
    // イベントリスナー設定
    setupGlobalEventListeners();
    
    // ページ状態の復元
    restorePageState();

    // 認証状態の監視開始
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
            setCurrentFilter({ type: 'inbox' }); // デフォルト
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
    // ログイン直後にサイドバーの基盤（DOM）を初期化
    initSidebar();

    // ワークスペース購読開始（未購読の場合）
    let unsubscribeWorkspaces = getWorkspaceUnsubscribe();
    
    if (!unsubscribeWorkspaces) {
        unsubscribeWorkspaces = subscribeToWorkspaces((workspaces) => {
            // ワークスペース一覧がロードされ、カレントIDが確定したらデータ同期開始
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