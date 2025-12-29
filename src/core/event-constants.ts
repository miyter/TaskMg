/**
 * アプリケーション全体で使用するイベント名の定数定義
 * Store層とUI層の両方から参照されるため、src/core/に配置して依存関係を整理する。
 */
export const APP_EVENTS = {
    // ワークスペース
    WORKSPACE_CHANGED: 'workspace-changed',

    // ルーティング
    ROUTE_CHANGE: 'route-change',

    // データ更新通知 (Store -> UI)
    TASKS_UPDATED: 'tasks-updated',
    PROJECTS_UPDATED: 'projects-updated',
    LABELS_UPDATED: 'labels-updated',
    TIMEBLOCKS_UPDATED: 'timeblocks-updated',
    FILTERS_UPDATED: 'filters-updated',

    // UI設定関連
    SIDEBAR_SETTINGS_UPDATED: 'sidebar-settings-updated',
    UI_SETTINGS_CHANGED: 'ui-settings-changed',

    // その他UIイベント
    UI_UPDATED: 'ui-updated',
    THEME_CHANGED: 'theme-changed'
} as const;

export type AppEventName = typeof APP_EVENTS[keyof typeof APP_EVENTS];

/**
 * @typedef {object} WorkspaceChangedDetail
 * @property {string} workspaceId
 * @property {Array<object>} [workspaces]
 */
export interface WorkspaceChangedDetail {
    workspaceId: string;
    workspaces?: any[]; // 具体的な型は後ほど定義
}

/**
 * @typedef {object} RouteChangeDetail
 * @property {string} page
 * @property {string|null} [id]
 */
export interface RouteChangeDetail {
    page: string;
    id?: string | null;
}
