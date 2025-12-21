// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: ワークスペースIDによるデータフィルタリングの追加と同期ロジックの堅牢化
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

// データキャッシュ（Firestoreから取得した生データ）
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
 * UI全体を更新する（ワークスペースによるフィルタリングを実施）
 */
export function updateUI() {
    if (updateTimer) return;
    
    updateTimer = requestAnimationFrame(() => {
        const workspaceId = getCurrentWorkspaceId();
        if (!workspaceId) {
            updateTimer = null;
            return;
        }

        // 現在のワークスペースに属するデータのみを抽出
        // ※Firestore側でフィルタリングされていても、メモリ上での最終チェックとして実施
        const filteredTasks = state.tasks.filter(t => t.workspaceId === workspaceId);
        const filteredProjects = state.projects.filter(p => p.workspaceId === workspaceId);
        const filteredLabels = state.labels.filter(l => l.workspaceId === workspaceId);
        
        // 描画系にフィルタリング済みのデータを渡す
        updateInboxCount(filteredTasks);
        renderProjects(filteredProjects, filteredTasks);
        renderLabels(filteredLabels, filteredTasks);
        renderTimeBlocks(filteredTasks);
        renderDurations(filteredTasks);
        
        // メインビューの更新
        updateView(filteredTasks, filteredProjects, filteredLabels);
        
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
    console.log('[DataSync] Start syncing workspace:', workspaceId);

    // 各データソースの購読
    // Store側の subscribe 関数が第2引数に workspaceId を受け取り、
    // クエリレベルでフィルタリングを行うことを期待する設計
    subscriptions.tasks = subscribeToTasks((data) => {
        state.tasks = data;
        updateUI();
    }, workspaceId);

    subscriptions.projects = subscribeToProjects((data) => {
        state.projects = data;
        updateUI();
    }, workspaceId);

    subscriptions.labels = subscribeToLabels((data) => {
        state.labels = data;
        updateUI();
    }, workspaceId);
    
    subscriptions.timeBlocks = subscribeToTimeBlocks((data) => {
        state.timeBlocks = data;
        updateUI();
    }, workspaceId);

    subscriptions.filters = subscribeToFilters((data) => {
        state.filters = data;
        updateUI();
    }, workspaceId);
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
    tasks: () => {
        const wsId = getCurrentWorkspaceId();
        return state.tasks.filter(t => t.workspaceId === wsId);
    },
    projects: () => {
        const wsId = getCurrentWorkspaceId();
        return state.projects.filter(p => p.workspaceId === wsId);
    },
    labels: () => {
        const wsId = getCurrentWorkspaceId();
        return state.labels.filter(l => l.workspaceId === wsId);
    },
    timeBlocks: () => state.timeBlocks,
    filters: () => state.filters,
    workspaceId: () => getCurrentWorkspaceId()
};

export function getWorkspaceUnsubscribe() { return subscriptions.workspaces; }
export function setWorkspaceUnsubscribe(unsub) { subscriptions.workspaces = unsub; }
export function isSyncing() { return isDataSyncing; }