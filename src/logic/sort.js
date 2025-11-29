/**
 * タスクのソートロジック
 * @param {Array} tasks - タスク配列
 * @param {string} criteria - ソート基準
 * @returns {Array} ソート済みの新しい配列
 */
export function sortTasks(tasks, criteria) {
    // 元の配列を変更しないようコピーを作成
    const copied = [...tasks];
    
    return copied.sort((a, b) => {
        // Firestore Timestamp と Date オブジェクトの両方に対応
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        
        switch (criteria) {
            case 'createdAt_asc':
                return dateA - dateB;
                
            case 'dueDate_asc':
                // 期限なしは最後に配置
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                
                const dueA = a.dueDate.toDate ? a.dueDate.toDate() : new Date(a.dueDate);
                const dueB = b.dueDate.toDate ? b.dueDate.toDate() : new Date(b.dueDate);
                return dueA - dueB;
                
            case 'createdAt_desc':
            default:
                return dateB - dateA;
        }
    });
}