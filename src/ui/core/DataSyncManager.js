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
        // ストアから直接最新データを取得（SSOT）
        const tasks = getData.tasks();
        const projects = getData.projects();
        const labels = getData.labels();
        const timeBlocks = getData.timeBlocks();
        const filters = getData.filters();

        updateView(tasks, projects, labels, timeBlocks, filters);
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

    // データはStore側でキャッシュされるため、ここでは受け取る必要はないが
    // コールバックは更新通知のために必要
    subscriptions.tasks = subscribeToTasks(workspaceId, () => notifyUpdate('tasks-updated'));
    subscriptions.projects = subscribeToProjects(workspaceId, () => notifyUpdate('projects-updated'));
    subscriptions.labels = subscribeToLabels(workspaceId, () => notifyUpdate('labels-updated'));
    subscriptions.timeBlocks = subscribeToTimeBlocks(workspaceId, () => notifyUpdate('timeblocks-updated'));
    subscriptions.filters = subscribeToFilters(workspaceId, () => notifyUpdate('filters-updated'));
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

    // キャッシュクリア（Store側のキャッシュクリアメソッドを呼ぶべきだが、現状の実装ではStoreの購読解除時に空配列をコールバックしているので
    // UI更新によって実質クリアされる。厳密にはStoreにclearCacheメソッドを作るのが良い）
    clearTimeBlocksCache();
    clearFiltersCache();

    isDataSyncing = false;
    updateUI();
}

// --- Getters (Storeへのプロキシ) ---
import { getTasks } from '../../store/store-raw.js';
import { getProjects } from '../../store/projects-raw.js';
import { getLabels } from '../../store/labels-raw.js';
import { getTimeBlocks } from '../../store/timeblocks.js';
import { getFilters } from '../../store/filters.js';

export const getData = {
    tasks: getTasks,
    projects: getProjects,
    labels: getLabels,
    timeBlocks: getTimeBlocks,
    filters: getFilters,
    workspaceId: () => getCurrentWorkspaceId()
};

export function getWorkspaceUnsubscribe() { return subscriptions.workspaces; }
export function setWorkspaceUnsubscribe(unsub) { subscriptions.workspaces = unsub; }
export function isSyncing() { return isDataSyncing; }