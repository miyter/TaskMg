// --- 検索・ソート・フィルタロジック ---

export function filterTasks(tasks, criteria) {
    const { keyword, projectId, labelId, showCompleted } = criteria;
    
    return tasks.filter(task => {
        // 完了状態フィルタ
        if (!showCompleted && task.status === 'completed') return false;

        // プロジェクトフィルタ
        if (projectId && task.projectId !== projectId) return false;

        // ラベルフィルタ
        if (labelId && (!task.labelIds || !task.labelIds.includes(labelId))) return false;

        // キーワード検索
        if (keyword) {
            const lowerKeyword = keyword.toLowerCase();
            const matchTitle = task.title.toLowerCase().includes(lowerKeyword);
            const matchDesc = (task.description || "").toLowerCase().includes(lowerKeyword);
            if (!matchTitle && !matchDesc) return false;
        }

        return true;
    });
}

export function sortTasks(tasks, sortType) {
    return [...tasks].sort((a, b) => {
        switch (sortType) {
            case 'created_desc':
                return b.createdAt - a.createdAt;
            case 'created_asc':
                return a.createdAt - b.createdAt;
            case 'due_asc':
                // 期限なしは最後に
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