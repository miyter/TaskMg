// @ts-nocheck
// @miyter:20251221
// 検索・フィルタリング・ソートロジックの集約

/**
 * タスクをフィルタリング・ソートするメイン関数
 */
export function getProcessedTasks(tasks, config) {
    let filtered = filterTasks(tasks, config);
    return sortTasks(filtered, config.sortCriteria);
}

/**
 * フィルタリングロジック
 */
export function filterTasks(tasks, criteria) {
    const { 
        keyword, 
        projectId, 
        labelId, 
        showCompleted, 
        timeBlockId, 
        duration 
    } = criteria;
    
    return tasks.filter(task => {
        // 1. 完了状態
        if (!showCompleted && task.status === 'completed') return false;

        // 2. プロジェクト
        if (projectId && task.projectId !== projectId) return false;

        // 3. ラベル
        if (labelId && (!task.labelIds || !task.labelIds.includes(labelId))) return false;

        // 4. 時間ブロック (ui-view-managerから移動)
        if (timeBlockId) {
            if (timeBlockId === 'unassigned') {
                if (task.timeBlockId && task.timeBlockId !== 'null') return false;
            } else if (String(task.timeBlockId) !== String(timeBlockId)) {
                return false;
            }
        }

        // 5. 所要時間 (ui-view-managerから移動)
        if (duration && Number(task.duration) !== Number(duration)) return false;

        // 6. キーワード検索
        if (keyword) {
            const lowerKeyword = keyword.toLowerCase();
            const matchTitle = task.title.toLowerCase().includes(lowerKeyword);
            const matchDesc = (task.description || "").toLowerCase().includes(lowerKeyword);
            if (!matchTitle && !matchDesc) return false;
        }

        return true;
    });
}

/**
 * ソートロジック
 */
export function sortTasks(tasks, sortType = 'createdAt_desc') {
    return [...tasks].sort((a, b) => {
        switch (sortType) {
            case 'createdAt_desc':
                return (b.createdAt || 0) - (a.createdAt || 0);
            case 'createdAt_asc':
                return (a.createdAt || 0) - (b.createdAt || 0);
            case 'dueDate_asc':
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return a.dueDate - b.dueDate;
            case 'project_asc':
                return (a.projectId || "").localeCompare(b.projectId || "");
            default:
                return 0;
        }
    });
}