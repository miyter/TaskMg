// @ts-nocheck
// @miyter:20251129

import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { auth, initializeFirebase } from '../core/firebase.js'; // 修正: initializeFirebaseを追加

// UI関連
import { updateAuthUI } from './auth.js';
import { renderLayout } from './layout.js';
import { initTheme } from './theme.js';
import { initTaskModal } from './task-modal.js';
import { initSidebar, renderProjects, renderLabels, updateInboxCount } from './sidebar.js';
import { renderTimeBlocks, renderDurations } from './sidebar-renderer.js';
import { initSettings } from './settings.js';

// Store関連
import { subscribeToTasks } from '../store/store.js';
import { subscribeToProjects } from '../store/projects.js';
import { subscribeToLabels } from '../store/labels.js';
import { subscribeToTimeBlocks, clearTimeBlocksCache } from '../store/timeblocks.js';
import { subscribeToFilters, clearFiltersCache } from '../store/filters.js';
import { subscribeToWorkspaces, getCurrentWorkspaceId } from '../store/workspace.js';

// ビュー制御
import { 
    updateView, 
    setCurrentFilter, 
    renderLoginState 
} from './ui-view-manager.js';

// データキャッシュ
let allTasks = [];
let allProjects = [];
let allLabels = [];
let allTimeBlocks = [];
let allFilters = [];

// 購読解除関数
let unsubscribeTasks, unsubscribeProjects, unsubscribeLabels, unsubscribeTimeBlocks, unsubscribeFilters, unsubscribeWorkspaces;

// アプリの同期状態フラグ
let isDataSyncing = false;

export function initializeApp() {
    // ★追加: Firebaseを明示的に初期化
    // これにより window.GLOBAL_FIREBASE_CONFIG が確実に存在する状態で初期化される
    try {
        initializeFirebase();
    } catch (e) {
        console.error("Critical Error: Failed to initialize Firebase.", e);
        // 必要に応じてエラー画面を表示する処理などをここに追加
        return;
    }

    initTheme();
    renderLayout();
    initSettings();
    initTaskModal();
    setupGlobalEventListeners();
    
    // ページ状態の復元 (リロード対策)
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

    // 認証状態の監視
    // initializeFirebase()実行後なので auth オブジェクトは利用可能
    if (auth) {
        onAuthStateChanged(auth, (user) => {
            updateAuthUI(user);
            
            if (user) {
                // ログイン直後にサイドバーの基盤（DOM）を初期化
                initSidebar();

                // ログイン時: まずワークスペースを購読
                if (!unsubscribeWorkspaces) {
                    unsubscribeWorkspaces = subscribeToWorkspaces((workspaces) => {
                        // ワークスペース一覧がロードされ、カレントIDが確定したらデータ同期開始
                        const currentWorkspaceId = getCurrentWorkspaceId();
                        
                        if (currentWorkspaceId && !isDataSyncing) {
                            console.log('Workspace ready, starting data sync:', currentWorkspaceId);
                            startAllSubscriptions();
                        }
                    });
                }
            } else {
                // ログアウト時: 全停止
                if (unsubscribeWorkspaces) {
                    unsubscribeWorkspaces();
                    unsubscribeWorkspaces = null;
                }
                stopDataSync();
                renderLoginState();
            }
        });
    } else {
        console.error("Auth object is not available.");
    }
}

/**
 * ワークスペース内の全データのリアルタイム購読を開始する
 */
function startAllSubscriptions() {
    // 念のため一度停止してクリーンにする
    stopDataSync(false); // false = workspaceの購読は止めない
    
    const workspaceId = getCurrentWorkspaceId();
    if (!workspaceId) {
        console.error('Cannot start sync: No workspace selected');
        return;
    }

    isDataSyncing = true;
    console.log('Starting subscriptions for workspace:', workspaceId);

    // 1. タスク購読
    unsubscribeTasks = subscribeToTasks((snap) => {
        allTasks = snap.map(doc => ({ id: doc.id, ...doc }));
        updateUI(); 
    });

    // 2. プロジェクト購読
    unsubscribeProjects = subscribeToProjects((projects) => {
        allProjects = projects;
        renderProjects(allProjects, allTasks);
        updateUI(); 
    });

    // 3. ラベル購読
    unsubscribeLabels = subscribeToLabels((labels) => {
        allLabels = labels;
        renderLabels(allLabels, allTasks);
        updateUI();
    });
    
    // 4. 時間帯ブロック購読
    unsubscribeTimeBlocks = subscribeToTimeBlocks((timeBlocks) => {
        allTimeBlocks = timeBlocks;
        renderTimeBlocks(allTasks); 
        updateUI();
    });

    // 5. フィルター購読
    unsubscribeFilters = subscribeToFilters((filters) => {
        allFilters = filters;
        updateUI();
    });
}

/**
 * データ同期を停止し、キャッシュをクリアする
 * @param {boolean} stopWorkspaceSync - ワークスペース自体の購読も止めるかどうか
 */
function stopDataSync(stopWorkspaceSync = false) {
    if (unsubscribeTasks) unsubscribeTasks();
    if (unsubscribeProjects) unsubscribeProjects();
    if (unsubscribeLabels) unsubscribeLabels();
    if (unsubscribeTimeBlocks) unsubscribeTimeBlocks();
    if (unsubscribeFilters) unsubscribeFilters();
    
    if (stopWorkspaceSync && unsubscribeWorkspaces) {
        unsubscribeWorkspaces();
        unsubscribeWorkspaces = null;
    }
    
    // ストア側のキャッシュもクリア
    clearTimeBlocksCache();
    clearFiltersCache();
    
    // ローカルキャッシュクリア
    allTasks = []; 
    allProjects = []; 
    allLabels = [];
    allTimeBlocks = [];
    allFilters = [];
    
    isDataSyncing = false;
    
    // UIを更新 (空の状態にする)
    updateUI();
}

/**
 * UI全体を最新のデータとフィルターに基づいて更新するメイン関数
 */
function updateUI() {
    updateInboxCount(allTasks);
    
    if (allProjects.length || allTasks.length) {
        renderProjects(allProjects, allTasks);
    }
    
    if (allLabels.length || allTasks.length) {
        renderLabels(allLabels, allTasks);
    }
    
    renderTimeBlocks(allTasks);
    renderDurations(allTasks);
    
    updateView(allTasks, allProjects, allLabels);
}


function setupGlobalEventListeners() {
    // ワークスペース切り替えイベント
    document.addEventListener('workspace-changed', (e) => {
        const newWorkspaceId = e.detail.workspaceId;
        console.log('Workspace changed to:', newWorkspaceId);
        
        const headerTitle = document.getElementById('header-title');
        if (headerTitle) headerTitle.textContent = '読み込み中...';
        
        if (auth && auth.currentUser) {
            stopDataSync(false); // workspaceの購読は維持
            startAllSubscriptions();
            updateUI();
        }
    });

    // サイドバーからのルーティング変更イベント
    document.addEventListener('route-change', (e) => {
        setCurrentFilter({ type: e.detail.page, id: e.detail.id });
        
        localStorage.setItem('lastPage', JSON.stringify({ 
            page: e.detail.page, 
            id: e.detail.id || null 
        }));

        updateUI();
    });
    
    document.getElementById('search-input')?.addEventListener('input', updateUI);
    
    document.getElementById('toggle-completed-btn')?.addEventListener('click', (e) => {
        e.currentTarget.classList.toggle('text-blue-500');
        updateUI();
    });
    
    setupCustomSortDropdown();
}

/**
 * カスタムソートドロップダウンのイベントロジックを設定する
 */
function setupCustomSortDropdown() {
    const trigger = document.getElementById('sort-trigger');
    const menu = document.getElementById('sort-menu');
    const label = document.getElementById('sort-label');
    const options = document.querySelectorAll('.sort-option');

    if (!trigger || !menu || !label) return;
    
    const closeMenu = (e) => {
        if (e && (menu.contains(e.target) || trigger.contains(e.target))) {
            return;
        }
        toggleMenu(false);
    };
    
    const toggleMenu = (open) => {
        if (open) {
            menu.classList.replace('opacity-0', 'opacity-100');
            menu.classList.replace('invisible', 'visible');
            menu.classList.replace('scale-95', 'scale-100');
            menu.classList.replace('pointer-events-none', 'pointer-events-auto');
            document.addEventListener('click', closeMenu); 
        } else {
            menu.classList.replace('opacity-100', 'opacity-0');
            menu.classList.replace('visible', 'invisible');
            menu.classList.replace('scale-100', 'scale-95');
            menu.classList.replace('pointer-events-auto', 'pointer-events-none');
            document.removeEventListener('click', closeMenu);
        }
    };

    trigger.addEventListener('click', (e) => {
        e.stopPropagation(); 
        const isOpen = menu.classList.contains('opacity-100');
        toggleMenu(!isOpen);
    });
    
    options.forEach(option => {
        option.addEventListener('click', (e) => {
            const value = option.dataset.value;
            const text = option.textContent;
            label.textContent = text;
            trigger.dataset.value = value;
            updateUI(); 
            toggleMenu(false);
        });
    });

    if (!trigger.dataset.value) {
        trigger.dataset.value = 'createdAt_desc';
        label.textContent = "作成日(新しい順)";
    }
}