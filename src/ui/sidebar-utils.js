// @ts-nocheck
// @miyter:20251129
// サイドバー関連のユーティリティ関数とマップを保持

let labelMap = {};

export function getLabelDetails(labelId) {
    return labelMap[labelId];
}

export function setLabelMap(labels) {
    // renderLabelsから呼び出され、内部のlabelMapを更新する
    labelMap = {};
    labels.forEach(l => labelMap[l.id] = l);
}

/**
 * プロジェクトIDからプロジェクト名を取得する
 * @param {string | null} projectId - 取得したいプロジェクトID
 * @param {Array<object>} allProjects - 全プロジェクトのリスト
 * @returns {string} プロジェクト名 ('インボックス' or '未分類'を含む)
 */
export function getProjectName(projectId, allProjects = []) {
    if (!projectId || projectId === 'inbox' || projectId === 'INBOX') return 'インボックス';
    if (!allProjects || !Array.isArray(allProjects)) return '未分類';
    const project = allProjects.find(p => p.id === projectId);
    return project ? project.name : '未分類';
}

/**
 * ランダムなカラーコードを生成
 * @returns {string} HEXカラーコード
 */
export function getRandomColor() {
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6'];
    return colors[Math.floor(Math.random() * colors.length)];
}