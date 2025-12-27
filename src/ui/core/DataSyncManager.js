/**
 * 更新日: 2025-12-27
 * 内容: ReferenceError対策のため変数をトップレベルで確実に定義し、
 * データ同期ロジックを再構築
 */

import { auth } from '../../core/firebase.js';
import { subscribeToTasks } from '../../store/store.js';
import { subscribeToProjects } from '../../store/projects.js';
import { subscribeToLabels } from '../../store/labels.js';
import { subscribeToTimeBlocks, clearTimeBlocksCache } from '../../store/timeblocks.js';
import { subscribeToFilters, clearFiltersCache } from '../../store/filters.js';
import { getCurrentWorkspaceId } from '../../store/workspace.js';
import { updateView } from '../layout/ui-view-manager.js';

// 変数宣言（巻き上げ対策として const/let を明示的にトップレベル配置）
const state = {
    tasks: [],
    projects: [],
    labels: [],
    timeBlocks: [],
    filters: []
};

const subscriptions = {
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
 * UI全体を更新する
 */
export function updateUI() {
    if (updateTimer) return;

    updateTimer = requestAnimationFrame(() => {
        const { tasks, projects, labels } = state;
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
export function startAllSubscriptions(userId) {
    if (!auth?.currentUser) {
        console.warn('[DataSync] No authenticated user. Cannot start subscriptions.');
        return;
    }

    stopDataSync(false);

    const workspaceId = getCurrentWorkspaceId();
    if (!workspaceId) {
        console.warn('[DataSync] No workspace selected. Waiting for workspace selection...');
        return;
    }

    isDataSyncing = true;
    console.log('[DataSync] Starting subscriptions for workspace:', workspaceId);

    subscriptions.tasks = subscribeToTasks(workspaceId, (data) => {
        state.tasks = data;
        notifyUpdate('tasks-updated');
    });

    subscriptions.projects = subscribeToProjects(workspaceId, (data) => {
        state.projects = data;
        notifyUpdate('projects-updated');
    });

    subscriptions.labels = subscribeToLabels(workspaceId, (data) => {
        state.labels = data;
        notifyUpdate('labels-updated');
    });

    subscriptions.timeBlocks = subscribeToTimeBlocks(workspaceId, (data) => {
        state.timeBlocks = data;
        notifyUpdate('timeblocks-updated');
    });

    subscriptions.filters = subscribeToFilters(workspaceId, (data) => {
        state.filters = data;
        notifyUpdate('filters-updated');
    });
}

/**
 * 同期停止
 */
export function stopDataSync(stopWorkspaceSync = false) {
    if (isDataSyncing || stopWorkspaceSync) {
        console.log('[DataSync] Stopping data sync...');
    }

    Object.keys(subscriptions).forEach(key => {
        if (key === 'workspaces' && !stopWorkspaceSync) return;
        if (typeof subscriptions[key] === 'function') {
            subscriptions[key]();
            subscriptions[key] = null;
        }
    });

    clearTimeBlocksCache();
    clearFiltersCache();

    // 状態リセット（オブジェクトの参照を維持しつつ中身を空にする場合はこちら、
    // しかし今回は再代入不可のconstではなくプロパティ操作でリセット推奨だが、
    // ここでは単純化のため配列長0にする）
    state.tasks = [];
    state.projects = [];
    state.labels = [];
    state.timeBlocks = [];
    state.filters = [];

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