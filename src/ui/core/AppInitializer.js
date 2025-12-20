// @ts-nocheck
// @miyter:20251221
// アプリケーション初期化のコアロジック

import { onAuthStateChanged } from '../../core/firebase-sdk.js';
import { auth, initializeFirebase } from '../../core/firebase.js';
import { updateAuthUI, setupAuthHandlers } from '../auth.js'; // ★修正: setupAuthHandlers を追加
import { renderLayout } from '../layout.js';
import { initTheme } from '../theme.js';
import { initTaskModal } from '../task-modal.js';
import { initSidebar } from '../sidebar.js';
import { initSettings } from '../settings.js';
import { setCurrentFilter, renderLoginState } from '../ui-view-manager.js';
import { initWorkspaceDropdown, updateWorkspaceDropdownUI } from '../components/WorkspaceDropdown.js';
import { stopDataSync, getWorkspaceUnsubscribe, setWorkspaceUnsubscribe } from './DataSyncManager.js';
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
    setupAuthHandlers(); // ★追加: ログインボタン等のイベントを登録
    setupGlobalEventListeners();
    restorePageState();
    setupAuthObserver();
}

/**
 * LocalStorageからのページ状態復元
 */
function restorePageState() {
    try {
        const saved = JSON.parse(localStorage.getItem('lastPage'));
        setCurrentFilter(saved ? { type: saved.page, id: saved.id || null } : { type: 'inbox' });
    } catch (e) {
        setCurrentFilter({ type: 'inbox' });
    }
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

    if (!getWorkspaceUnsubscribe()) {
        const unsubscribe = subscribeToWorkspaces((workspaces) => {
            updateWorkspaceDropdownUI(workspaces);
        });
        setWorkspaceUnsubscribe(unsubscribe);
    }
}

/**
 * ログアウト時の処理
 */
function handleUserLogout() {
    const unsubWorkspaces = getWorkspaceUnsubscribe();
    if (unsubWorkspaces) {
        unsubWorkspaces();
        setWorkspaceUnsubscribe(null);
    }
    
    stopDataSync(true); 
    renderLoginState();
}