/**
 * 更新日: 2025-12-29
 * 内容: TypeScript化
 */

// グローバル変数の宣言
declare global {
    interface Window {
        GLOBAL_APP_ID?: string;
    }
}
declare const __app_id: string | undefined;

/**
 * グローバルなApp IDを取得する
 */
export function getAppId(): string {
    if (typeof window !== 'undefined' && window.GLOBAL_APP_ID) {
        return window.GLOBAL_APP_ID;
    }
    // @ts-ignore
    return (typeof __app_id !== 'undefined' ? __app_id : 'default-app-id');
}

/**
 * ユーザー配下のベースパスを取得
 */
function getUserBasePath(userId: string): string {
    return `artifacts/${getAppId()}/users/${userId}`;
}

/**
 * ワークスペース配下のベースパスを取得
 */
function getWorkspaceBasePath(userId: string, workspaceId: string): string {
    return `${getUserBasePath(userId)}/workspaces/${workspaceId}`;
}

/**
 * 各種コレクションへのパスを生成する
 */
export const paths = {
    users: (userId: string) => getUserBasePath(userId),
    workspaces: (userId: string) => `${getUserBasePath(userId)}/workspaces`,

    // ワークスペース依存データ
    filters: (userId: string, workspaceId: string) => `${getWorkspaceBasePath(userId, workspaceId)}/filters`,
    labels: (userId: string, workspaceId: string) => `${getWorkspaceBasePath(userId, workspaceId)}/labels`,
    timeblocks: (userId: string, workspaceId: string) => `${getWorkspaceBasePath(userId, workspaceId)}/timeblocks`,
    tasks: (userId: string, workspaceId: string) => `${getWorkspaceBasePath(userId, workspaceId)}/tasks`,
    projects: (userId: string, workspaceId: string) => `${getWorkspaceBasePath(userId, workspaceId)}/projects`,
    targets: (userId: string, workspaceId: string) => `${getWorkspaceBasePath(userId, workspaceId)}/targets`,
};
