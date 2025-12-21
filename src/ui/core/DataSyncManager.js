// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: プロジェクト購読時の引数を削除し、他のStore呼び出しと統一（Grok指摘対応）
 */

import { auth } from '../../core/firebase.js';

// Store関連
import { subscribeToTasks } from '../../store/store.js';
import { subscribeToProjects } from '../../store/projects.js';
import { subscribeToLabels } from '../../store/labels.js';
import { subscribeToTimeBlocks, clearTimeBlocksCache } from '../../store/timeblocks.js';
import { subscribeToFilters, clearFiltersCache } from '../../store/filters.js';
import { getCurrentWorkspaceId } from '../../store/workspace.js';

// UI描画関連
import { renderProjects, renderLabels, updateInboxCount } from '../sidebar.js';
import { renderTimeBlocks, renderDurations } from '../sidebar-renderer.js';
import { updateView } from '../ui-view-manager.js';

// データキャッシュ（UI更新用の一時ストア）
let state = {
    tasks: [],
    projects: [],
    labels: [],
    timeBlocks: [],
    filters: []
};

// 購読解除関数保持用
let subscriptions = {
    tasks: null,
    projects: null,
    labels: null,
    timeBlocks: null,
    filters: null,
    workspaces: null
};

let isDataSyncing = false;
let updateTimer = null;

/**
 * UI全体を更新する（デバウンス処理付き）
 */
export function updateUI() {
    if (updateTimer) return;
    
    updateTimer = requestAnimationFrame(() => {
        const { tasks, projects, labels } = state;
        
        // 描画系にデータを渡す
        updateInboxCount(tasks);
        renderProjects(projects, tasks);
        renderLabels(labels, tasks);
        renderTimeBlocks(tasks);
        renderDurations(tasks);
        
        // メインビューの更新
        updateView(tasks, projects, labels);
        
        updateTimer = null;
    });
}

/**
 * 同期開始
 */
export function startAllSubscriptions() {
    if (!auth?.currentUser) {
        return;
    }

    // 既存の購読があれば停止
    stopDataSync(false);
    
    const workspaceId = getCurrentWorkspaceId();
    if (!workspaceId) {
        console.warn('[DataSync] No workspace selected.');
        return;
    }

    isDataSyncing = true;
    console.log('[DataSync] Start syncing workspace:', workspaceId);

    // --- 各データソースの購読 ---
    // Store側の subscribe 関数は内部で getCurrentWorkspaceId() を使用してパスを解決する

    subscriptions.tasks = subscribeToTasks((data) => {
        state.tasks = data;
        updateUI();
    });

    subscriptions.projects = subscribeToProjects((data) => {
        state.projects = data;
        updateUI();
    });

    subscriptions.labels = subscribeToLabels((data) => {
        state.labels = data;
        updateUI();
    });
    
    subscriptions.timeBlocks = subscribeToTimeBlocks((data) => {
        state.timeBlocks = data;
        updateUI();
    });

    subscriptions.filters = subscribeToFilters((data) => {
        state.filters = data;
        updateUI();
    });
}

/**
 * 同期停止
 */
export function stopDataSync(stopWorkspaceSync = false) {
    Object.keys(subscriptions).forEach(key => {
        if (key === 'workspaces' && !stopWorkspaceSync) return;
        if (subscriptions[key]) {
            subscriptions[key]();
            subscriptions[key] = null;
        }
    });
    
    clearTimeBlocksCache();
    clearFiltersCache();
    
    state = { tasks: [], projects: [], labels: [], timeBlocks: [], filters: [] };
    isDataSyncing = false;
    
    // クリア状態でUI更新
    updateUI();
}

// --- Getters ---
export const getData = {
    tasks: () => state.tasks,
    projects: () => state.projects,
    labels: () => state.labels,
    timeBlocks: () => state.timeBlocks,
    filters: () => state.filters,
    workspaceId: () => getCurrentWorkspaceId()
};

export function getWorkspaceUnsubscribe() { return subscriptions.workspaces; }
export function setWorkspaceUnsubscribe(unsub) { subscriptions.workspaces = unsub; }
export function isSyncing() { return isDataSyncing; }