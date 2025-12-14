// @ts-nocheck
// @miyter:20251129

import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { auth } from '../core/firebase.js';

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
import { subscribeToTimeBlocks, clearTimeBlocksCache } from '../store/timeblocks.js'; // 追加: キャッシュクリア関数
import { subscribeToFilters, clearFiltersCache } from '../store/filters.js'; // 追加: キャッシュクリア関数
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
let allTimeBlocks = []; // 追加: キャッシュ用
let allFilters = [];    // 追加: キャッシュ用

// 購読解除関数
let unsubscribeTasks, unsubscribeProjects, unsubscribeLabels, unsubscribeTimeBlocks, unsubscribeFilters, unsubscribeWorkspaces;

// アプリの同期状態フラグ
let isDataSyncing = false;

export function initializeApp() {
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
    onAuthStateChanged(auth, (user) => {
        updateAuthUI(user);
        
        if (user) {
            // ★変更: ログイン直後にサイドバーの基盤（DOM）を初期化
            // データはまだ空だが、イベントリスナーやドロップダウンの準備を行う
            initSidebar();

            // ログイン時: まずワークスペースを購読
            if (!unsubscribeWorkspaces) {
                unsubscribeWorkspaces = subscribeToWorkspaces((workspaces) => {
                    // ワークスペース一覧がロードされ、カレントIDが確定したらデータ同期開始
                    // (workspace.js側で初期化やデフォルト作成が行われる)
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
}

/**
 * ワークスペース内の全データのリアルタイム購読を開始する
 * (旧 startDataSync を改名・強化)
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
    
    // 読み込み開始ログ
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
    
    // 4. 時間帯ブロック購読 (追加)
    unsubscribeTimeBlocks = subscribeToTimeBlocks((timeBlocks) => {
        allTimeBlocks = timeBlocks;
        // 時間帯定義が変わったら再計算が必要
        renderTimeBlocks(allTasks); 
        updateUI();
    });

    // 5. フィルター購読 (追加)
    unsubscribeFilters = subscribeToFilters((filters) => {
        allFilters = filters;
        // サイドバーのフィルターリスト更新は sidebar.js 内で購読しているが、
        // ここでもデータを保持しておくとビュー更新に使える
        updateUI();
    });
    
    // ★変更: initSidebar の呼び出しは削除 (initializeAppで実行済み)
    // ここでデータを流し込みたい場合は updateUI がその役割を担う
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
    
    // ★追加: ストア側のキャッシュもクリア (保守性向上)
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
    // サイドバーの更新
    updateInboxCount(allTasks);
    
    // プロジェクト一覧更新 (データロード済みの場合)
    if (allProjects.length || allTasks.length) {
        renderProjects(allProjects, allTasks);
    }
    
    if (allLabels.length || allTasks.length) {
        renderLabels(allLabels, allTasks);
    }
    
    // 時間帯と所要時間のカウントを更新
    renderTimeBlocks(allTasks);
    renderDurations(allTasks);
    
    // ビューのレンダリングと切り替えを委譲
    updateView(allTasks, allProjects, allLabels);
}


function setupGlobalEventListeners() {
    // ワークスペース切り替えイベント (追加)
    document.addEventListener('workspace-changed', (e) => {
        const newWorkspaceId = e.detail.workspaceId;
        console.log('Workspace changed to:', newWorkspaceId);
        
        // UIに読み込み中状態を表示（オプション）
        const headerTitle = document.getElementById('header-title');
        if (headerTitle) headerTitle.textContent = '読み込み中...';
        
        if (auth.currentUser) {
            // 一度同期を止めて、キャッシュをクリアしてから再開
            stopDataSync(false); // workspaceの購読は維持
            startAllSubscriptions();
            updateUI(); // 即時反映
        }
    });

    // サイドバーからのルーティング変更イベント
    document.addEventListener('route-change', (e) => {
        setCurrentFilter({ type: e.detail.page, id: e.detail.id });
        
        // ページ切り替え時に状態を保存
        localStorage.setItem('lastPage', JSON.stringify({ 
            page: e.detail.page, 
            id: e.detail.id || null 
        }));

        updateUI();
    });
    
    // 検索、トグル、ソートの変更イベント
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
    
    // --- メニュー開閉ロジック ---
    
    const closeMenu = (e) => {
        // メニュー内クリックまたはトリガークリックでない場合のみ閉じる
        if (e && (menu.contains(e.target) || trigger.contains(e.target))) {
            return;
        }
        toggleMenu(false);
    };
    
    const toggleMenu = (open) => {
        if (open) {
            // 開く
            menu.classList.replace('opacity-0', 'opacity-100');
            menu.classList.replace('invisible', 'visible');
            menu.classList.replace('scale-95', 'scale-100');
            menu.classList.replace('pointer-events-none', 'pointer-events-auto');
            document.addEventListener('click', closeMenu); 
        } else {
            // 閉じる
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
    
    // --- 選択処理 ---
    options.forEach(option => {
        option.addEventListener('click', (e) => {
            const value = option.dataset.value;
            const text = option.textContent;
            
            // 1. UI更新
            label.textContent = text;
            
            // 2. ソート値をトリガーボタンのdata属性に保存
            trigger.dataset.value = value;
            
            // 3. ソートイベント発火 (updateUIを呼び出す)
            updateUI(); 

            // 4. メニュー閉じる
            toggleMenu(false);
        });
    });

    // 初期ソート値のセットアップ
    if (!trigger.dataset.value) {
        trigger.dataset.value = 'createdAt_desc';
        label.textContent = "作成日(新しい順)";
    }
}