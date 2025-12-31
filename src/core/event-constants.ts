/**
 * アプリケーション全体で使用するイベント名の定数定義
 * Store層とUI層の両方から参照されるため、src/core/に配置して依存関係を整理する。
 */
import { Workspace } from '../store/schema';

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

export interface WorkspaceChangedDetail {
    workspaceId: string;
    workspaces?: Workspace[];
}

export interface RouteChangeDetail {
    page: string;
    id?: string | null;
}

// 統一されたイベント詳細型
export type AppEventDetailMap = {
    [APP_EVENTS.WORKSPACE_CHANGED]: WorkspaceChangedDetail;
    [APP_EVENTS.ROUTE_CHANGE]: RouteChangeDetail;
    [APP_EVENTS.TASKS_UPDATED]: void;
    [APP_EVENTS.PROJECTS_UPDATED]: void;
    [APP_EVENTS.LABELS_UPDATED]: void;
    [APP_EVENTS.TIMEBLOCKS_UPDATED]: void;
    [APP_EVENTS.FILTERS_UPDATED]: void;
    [APP_EVENTS.SIDEBAR_SETTINGS_UPDATED]: void;
    [APP_EVENTS.UI_SETTINGS_CHANGED]: void;
    [APP_EVENTS.UI_UPDATED]: void;
    [APP_EVENTS.THEME_CHANGED]: void;
};

