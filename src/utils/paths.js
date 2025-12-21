// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: timeblocksのパス定義を追加
 */

/**
 * グローバルなApp IDを取得する
 */
export function getAppId() {
    return (typeof window !== 'undefined' && window.GLOBAL_APP_ID) 
        ? window.GLOBAL_APP_ID 
        : (typeof __app_id !== 'undefined' ? __app_id : 'default-app-id');
}

/**
 * ユーザー配下のベースパスを取得
 */
function getUserBasePath(userId) {
    return `artifacts/${getAppId()}/users/${userId}`;
}

/**
 * ワークスペース配下のベースパスを取得
 */
function getWorkspaceBasePath(userId, workspaceId) {
    return `${getUserBasePath(userId)}/workspaces/${workspaceId}`;
}

/**
 * 各種コレクションへのパスを生成する
 */
export const paths = {
    // ユーザー共通データ
    users: (userId) => getUserBasePath(userId),
    filters: (userId) => `${getUserBasePath(userId)}/filters`,
    labels: (userId) => `${getUserBasePath(userId)}/labels`,
    workspaces: (userId) => `${getUserBasePath(userId)}/workspaces`,
    timeblocks: (userId) => `${getUserBasePath(userId)}/timeblocks`, // 追加
    
    // ワークスペース依存データ
    tasks: (userId, workspaceId) => `${getWorkspaceBasePath(userId, workspaceId)}/tasks`,
    projects: (userId, workspaceId) => `${getWorkspaceBasePath(userId, workspaceId)}/projects`,
};