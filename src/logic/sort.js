// @ts-nocheck
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

        // 文字列やnull/undefinedの比較ヘルパー
        const compareStrings = (valA, valB, direction = 'asc') => {
            const strA = (valA || '').toString().toLowerCase();
            const strB = (valB || '').toString().toLowerCase();
            let result = 0;

            if (strA < strB) {
                result = -1;
            } else if (strA > strB) {
                result = 1;
            }
            
            return direction === 'asc' ? result : -result;
        };
        
        // null/undefinedをソート対象の最後に配置するヘルパー
        const compareNullable = (valA, valB, comparator) => {
            if (valA == null) return 1;
            if (valB == null) return -1;
            return comparator(valA, valB);
        };
        
        switch (criteria) {
            case 'timeBlockId_asc':
                // null/undefined (時間帯未定) を最後に配置し、それ以外をIDで比較
                return compareNullable(a.timeBlockId, b.timeBlockId, (idA, idB) => {
                    // IDは文字列なので、文字列比較を行う
                    return compareStrings(idA, idB, 'asc');
                });
                
            case 'projectId_asc':
                // null/undefined (プロジェクト未定) を最後に配置し、それ以外をIDで比較
                return compareNullable(a.projectId, b.projectId, (idA, idB) => {
                    return compareStrings(idA, idB, 'asc');
                });
                
            case 'title_asc':
                // タスク名を昇順（A→Z）で比較
                return compareStrings(a.title, b.title, 'asc');

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