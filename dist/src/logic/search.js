// @miyter:20251125
// --- 検索・ソート・フィルタロジック ---

export function filterTasks(tasks, criteria) {
    const { keyword, projectId, labelId, showCompleted } = criteria;
    
    return tasks.filter(task => {
        // 完了状態フィルタ
        if (!showCompleted && task.status === 'completed') return false;

        // プロジェクトフィルタ
        // projectIdが設定されていて、タスクのprojectIdが一致しない場合
        if (projectId && task.projectId !== projectId) return false;

        // ラベルフィルタ
        // labelIdが設定されていて、タスクにそのラベルIDが含まれていない場合
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
    // 元の配列を変更しないようにコピー
    return [...tasks].sort((a, b) => {
        switch (sortType) {
            case 'created_desc':
                // 作成日：降順 (新しいものが上)
                return b.createdAt - a.createdAt;
            case 'created_asc':
                // 作成日：昇順 (古いものが上)
                return a.createdAt - b.createdAt;
            case 'due_asc':
                // 期限日：昇順 (期限なしは最後に)
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return a.dueDate - b.dueDate;
            case 'project_asc':
                // プロジェクト名：昇順 (文字列比較)
                return (a.projectId || "").localeCompare(b.projectId || "");
            default:
                return 0;
        }
    });
}