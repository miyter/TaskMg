// @ts-nocheck
// データ同期、キャッシュ管理、UI更新の一元管理

// 追加: 認証チェック用
import { auth } from '../../core/firebase.js';

// Store関連
import { subscribeToTasks } from '../../store/store.js';
import { subscribeToProjects } from '../../store/projects.js';
import { subscribeToLabels } from '../../store/labels.js';
import { subscribeToTimeBlocks, clearTimeBlocksCache } from '../../store/timeblocks.js';
import { subscribeToFilters, clearFiltersCache } from '../../store/filters.js';
import { subscribeToWorkspaces, getCurrentWorkspaceId } from '../../store/workspace.js';

// UI描画関連
import { renderProjects, renderLabels, updateInboxCount } from '../sidebar.js';
import { renderTimeBlocks, renderDurations } from '../sidebar-renderer.js';
import { updateView } from '../ui-view-manager.js';
import { initSidebar } from '../sidebar.js';

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

/**
 * ワークスペース内の全データのリアルタイム購読を開始する
 */
export function startAllSubscriptions() {
    // 🚨 認証チェックを追加: 認証されていない場合は購読を開始しない
    // これにより、起動時の User not authenticated エラーや permission-denied を防ぐ
    if (!auth || !auth.currentUser) {
        console.warn('Cannot start sync: User not authenticated. Aborting subscriptions.');
        return;
    }

    // 念のため一度停止してクリーンにする
    stopDataSync(false); // false = workspaceの購読は止めない
    
    const workspaceId = getCurrentWorkspaceId();
    if (!workspaceId) {
        console.error('Cannot start sync: No workspace selected');
        return;
    }

    // ★追加: 購読開始前に、すべての解除関数を null にリセット
    // これにより、購読開始失敗時などに古い解除関数が残るのを防ぐ
    unsubscribeTasks = null;
    unsubscribeProjects = null;
    unsubscribeLabels = null;
    unsubscribeTimeBlocks = null;
    unsubscribeFilters = null;

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
export function stopDataSync(stopWorkspaceSync = false) {
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
export function updateUI() {
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

// ワークスペース購読管理用のゲッター/セッター（必要に応じて）
export function getWorkspaceUnsubscribe() {
    return unsubscribeWorkspaces;
}

export function setWorkspaceUnsubscribe(unsub) {
    unsubscribeWorkspaces = unsub;
}

export function isSyncing() {
    return isDataSyncing;
}