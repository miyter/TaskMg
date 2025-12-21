/**
 * 更新日: 2025-12-21
 * 内容: サイドバーキャッシュ連携の追加、イベント発火によるUI同期の自動化
 */

import { auth } from '../../core/firebase.js';

// Store関連
import { subscribeToTasks } from '../../store/store.js';
import { subscribeToProjects } from '../../store/projects.js';
import { subscribeToLabels } from '../../store/labels.js';
import { subscribeToTimeBlocks, clearTimeBlocksCache } from '../../store/timeblocks.js';
import { subscribeToFilters, clearFiltersCache } from '../../store/filters.js';
import { getCurrentWorkspaceId } from '../../store/workspace.js';

// UI連携
import { updateSidebarCache } from '../sidebar.js';
import { updateView } from '../ui-view-manager.js';

// データキャッシュ
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
 * UI全体を更新する（サイドバーキャッシュ更新 + メインビュー描画）
 */
export function updateUI() {
    if (updateTimer) return;

    updateTimer = requestAnimationFrame(() => {
        const { tasks, projects, labels, filters } = state;

        // 1. サイドバーのキャッシュを物理的に更新
        updateSidebarCache({ tasks, labels, projects, filters });

        // 2. メインビューの更新
        updateView(tasks, projects, labels);

        updateTimer = null;
    });
}

/**
 * 特定のデータ種別が更新されたことを通知
 */
function notifyUpdate(eventType) {
    document.dispatchEvent(new CustomEvent(eventType));
    updateUI();
}

/**
 * 同期開始
 */
export function startAllSubscriptions() {
    if (!auth?.currentUser) return;

    stopDataSync(false);

    const workspaceId = getCurrentWorkspaceId();
    if (!workspaceId) {
        console.warn('[DataSync] No workspace selected.');
        return;
    }

    isDataSyncing = true;
    console.log('[DataSync] Start syncing workspace:', workspaceId);

    // --- 各データソースの購読 ---
    subscriptions.tasks = subscribeToTasks((data) => {
        state.tasks = data;
        notifyUpdate('tasks-updated');
    });

    subscriptions.projects = subscribeToProjects((data) => {
        state.projects = data;
        notifyUpdate('projects-updated');
    });

    subscriptions.labels = subscribeToLabels((data) => {
        state.labels = data;
        notifyUpdate('labels-updated');
    });

    subscriptions.timeBlocks = subscribeToTimeBlocks((data) => {
        state.timeBlocks = data;
        notifyUpdate('timeblocks-updated');
    });

    subscriptions.filters = subscribeToFilters((data) => {
        state.filters = data;
        notifyUpdate('filters-updated');
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

    // キャッシュを空にしてUI更新
    updateSidebarCache(state);
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