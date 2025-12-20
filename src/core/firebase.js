// @ts-nocheck
// @miyter:20251221
// タスク配列のソートロジック

/**
 * 指定された基準でタスクをソート
 * @param {Array} tasks - タスク配列
 * @param {string} criteria - ソートキー
 */
export function sortTasks(tasks, criteria = 'createdAt_desc') {
    if (!Array.isArray(tasks)) return [];
    
    return [...tasks].sort((a, b) => {
        switch (criteria) {
            case 'createdAt_asc':
                return compareDates(a.createdAt, b.createdAt);
            
            case 'createdAt_desc':
                return compareDates(b.createdAt, a.createdAt);

            case 'dueDate_asc':
                // 期限なし(null)は最後に配置
                return compareNullable(a.dueDate, b.dueDate, (d1, d2) => compareDates(d1, d2));

            case 'timeBlockId_asc':
                // 未定を最後に
                return compareNullable(a.timeBlockId, b.timeBlockId, (v1, v2) => String(v1).localeCompare(String(v2)));

            case 'projectId_asc':
                return compareNullable(a.projectId, b.projectId, (v1, v2) => String(v1).localeCompare(String(v2)));

            case 'title_asc':
                return (a.title || '').localeCompare(b.title || '', 'ja');

            default:
                return 0;
        }
    });
}

/**
 * 内部ヘルパー: 日付/Timestampの比較
 */
function compareDates(valA, valB) {
    const getTime = (v) => {
        if (!v) return 0;
        if (v.toDate) return v.toDate().getTime();
        if (v instanceof Date) return v.getTime();
        return new Date(v).getTime() || 0;
    };
    return getTime(valA) - getTime(valB);
}

/**
 * 内部ヘルパー: null値を考慮した比較（nullを常に後ろに持っていく）
 */
function compareNullable(a, b, comparator) {
    if (a === b) return 0;
    if (a == null || a === 'null') return 1;
    if (b == null || b === 'null') return -1;
    return comparator(a, b);
}