// @ts-nocheck
// @miyter:20251221
// データ同期、キャッシュ管理、UI更新の一元管理

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

// データキャッシュ
let state = {
    tasks: [],
    projects: [],
    labels: [],
    timeBlocks: [],
    filters: []
};

// 購読解除関数
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
    
    // 同一フレーム内での過剰な再描画を防止
    updateTimer = requestAnimationFrame(() => {
        const { tasks, projects, labels } = state;
        
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
        console.warn('Cannot start sync: User not authenticated.');
        return;
    }

    stopDataSync(false);
    
    const workspaceId = getCurrentWorkspaceId();
    if (!workspaceId) return;

    isDataSyncing = true;
    console.log('Syncing workspace:', workspaceId);

    // 各データソースの購読
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