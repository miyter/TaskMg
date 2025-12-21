/**
 * 更新日: 2025-12-21
 * 内容: renderLoginState のインポート元修正、認証監視ロジックの堅牢化
 */

import { onAuthStateChanged } from '../../core/firebase-sdk.js';
import { initializeFirebase, auth } from '../../core/firebase.js';
import { updateAuthUI, setupAuthHandlers } from '../auth.js';
import { renderLayout } from '../layout.js';
import { initTheme } from '../theme.js';
import { initTaskModal } from '../task-modal.js';
import { initSidebar } from '../sidebar.js';
import { initSettings } from '../settings.js';
import { setCurrentFilter } from '../ui-view-manager.js';
import { renderLoginState } from '../ui-view-utils.js'; 
import { initWorkspaceDropdown, updateWorkspaceDropdownUI } from '../components/WorkspaceDropdown.js';
import { 
    startAllSubscriptions, 
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

    // ワークスペース購読
    const prevUnsub = getWorkspaceUnsubscribe();
    if (prevUnsub) prevUnsub();

    const unsubscribeWs = subscribeToWorkspaces(user.uid, (workspaces) => {
        updateWorkspaceDropdownUI(workspaces);
    });
    setWorkspaceUnsubscribe(unsubscribeWs);

    // データ同期開始
    startAllSubscriptions(user.uid);
    
    // ページ状態を復元
    restorePageState();
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