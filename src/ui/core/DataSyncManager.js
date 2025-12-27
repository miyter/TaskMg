/**
 * 更新日: 2025-12-27
 * 内容: updateUI 内で updateSidebarCache に labels を含む全ステートを渡すように修正
 * これによりサイドバーのラベル名やプロジェクト名が空になる問題を解消
 */

import { auth } from '../../core/firebase.js';

// Store関連
// Store関連
import { subscribeToTasks } from '../../store/store.js';
import { subscribeToProjects } from '../../store/projects.js';
import { subscribeToLabels } from '../../store/labels.js';
import { subscribeToTimeBlocks, clearTimeBlocksCache } from '../../store/timeblocks.js';
import { subscribeToFilters, clearFiltersCache } from '../../store/filters.js';
import { getCurrentWorkspaceId } from '../../store/workspace.js';

// UI連携
// import { updateSidebarCache } from '../features/sidebar/sidebar.js'; // 削除
import { updateView } from '../layout/ui-view-manager.js';

// ... (omitted)

/**
 * UI全体を更新する（サイドバーキャッシュ更新 + メインビュー描画）
 */
export function updateUI() {
    if (updateTimer) return;

    updateTimer = requestAnimationFrame(() => {
        // state から全エンティティを抽出
        const { tasks, projects, labels } = state;

        // 1. サイドバーのキャッシュ更新は不要になった（自律的にプルするため）
        // updateSidebarCache({ tasks, labels, projects, filters, timeBlocks });

        // 2. メインビューの更新
        updateView(tasks, projects, labels);

        updateTimer = null;
    });
}

// ... (omitted)

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

    state = { tasks: [], projects: [], labels: [], timeBlocks: [], filters: [] };
    isDataSyncing = false;

    // キャッシュをリセットしてUIをクリア
    // updateSidebarCache(state); // 削除
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