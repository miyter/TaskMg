/**
 * 更新日: 2025-12-27
 * 内容: ReferenceError対策のため変数をトップレベルで確実に定義し、
 * データ同期ロジックを再構築
 * TypeScript化: 2025-12-29
 */

import { APP_EVENTS } from '../../core/event-constants';
import { auth } from '../../core/firebase';
import { clearFiltersCache, getFilters, subscribeToFilters } from '../../store/filters';
import { subscribeToLabels } from '../../store/labels';
import { getLabels } from '../../store/labels-raw.js';
import { subscribeToProjects } from '../../store/projects';
import { getProjects } from '../../store/projects-raw.js';
import { subscribeToTasks } from '../../store/store';
import { getTasks } from '../../store/store-raw.js';
import { clearTimeBlocksCache, getTimeBlocks, subscribeToTimeBlocks } from '../../store/timeblocks';
import { getCurrentWorkspaceId } from '../../store/workspace';
import { updateView } from '../layout/ui-view-manager';

type Unsubscribe = (() => void) | null;

interface Subscriptions {
    tasks: Unsubscribe;
    projects: Unsubscribe;
    labels: Unsubscribe;
    timeBlocks: Unsubscribe;
    filters: Unsubscribe;
    workspaces: Unsubscribe;
    [key: string]: Unsubscribe;
}

// 変数宣言
const subscriptions: Subscriptions = {
    tasks: null,
    projects: null,
    labels: null,
    timeBlocks: null,
    filters: null,
    workspaces: null
};

let isDataSyncing = false;
let updateTimer: number | null = null;

/**
 * UI全体を更新する
 */
export function updateUI(): void {
    if (updateTimer) return;

    updateTimer = requestAnimationFrame(() => {
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
function notifyUpdate(eventType: string): void {
    document.dispatchEvent(new CustomEvent(eventType));
    updateUI();
}

/**
 * 同期開始
 */
export function startAllSubscriptions(userId?: string): void {
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

    subscriptions.tasks = subscribeToTasks(workspaceId, () => notifyUpdate(APP_EVENTS.TASKS_UPDATED));
    subscriptions.projects = subscribeToProjects(workspaceId, () => notifyUpdate(APP_EVENTS.PROJECTS_UPDATED));
    subscriptions.labels = subscribeToLabels(workspaceId, () => notifyUpdate(APP_EVENTS.LABELS_UPDATED));
    subscriptions.timeBlocks = subscribeToTimeBlocks(workspaceId, () => notifyUpdate(APP_EVENTS.TIMEBLOCKS_UPDATED));
    subscriptions.filters = subscribeToFilters(workspaceId, () => notifyUpdate(APP_EVENTS.FILTERS_UPDATED));
}

/**
 * 同期停止
 */
export function stopDataSync(stopWorkspaceSync = false): void {
    if (isDataSyncing || stopWorkspaceSync) {
        console.log('[DataSync] Stopping data sync...');
    }

    Object.keys(subscriptions).forEach(key => {
        if (key === 'workspaces' && !stopWorkspaceSync) return;
        if (typeof subscriptions[key] === 'function') {
            subscriptions[key]!();
            subscriptions[key] = null;
        }
    });

    clearTimeBlocksCache();
    clearFiltersCache();

    isDataSyncing = false;
    updateUI();
}

// --- Getters (Storeへのプロキシ) ---
export const getData = {
    tasks: getTasks,
    projects: getProjects,
    labels: getLabels,
    timeBlocks: getTimeBlocks,
    filters: getFilters,
    workspaceId: () => getCurrentWorkspaceId()
};

export function getWorkspaceUnsubscribe(): Unsubscribe { return subscriptions.workspaces; }
export function setWorkspaceUnsubscribe(unsub: Unsubscribe): void { subscriptions.workspaces = unsub; }
export function isSyncing(): boolean { return isDataSyncing; }
