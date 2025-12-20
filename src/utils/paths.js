// @miyter:20251221
// Firestoreのコレクションパスを一括管理するユーティリティ

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
    return `/artifacts/${getAppId()}/users/${userId}`;
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
    filters: (userId) => `${getUserBasePath(userId)}/filters`,
    labels: (userId) => `${getUserBasePath(userId)}/labels`,
    workspaces: (userId) => `${getUserBasePath(userId)}/workspaces`,
    
    // ワークスペース依存データ
    tasks: (userId, workspaceId) => `${getWorkspaceBasePath(userId, workspaceId)}/tasks`,
    projects: (userId, workspaceId) => `${getWorkspaceBasePath(userId, workspaceId)}/projects`,
};