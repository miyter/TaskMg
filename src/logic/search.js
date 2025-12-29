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
        duration,
        savedFilter // 追加
    } = criteria;

    return tasks.filter(task => {
        // 1. 完了状態
        if (!showCompleted && task.status === 'completed') return false;

        // 2. プロジェクト
        if (projectId) {
            if (projectId === 'unassigned') {
                if (task.projectId && task.projectId !== 'unassigned' && task.projectId !== 'null') return false;
            } else if (task.projectId !== projectId) {
                return false;
            }
        }

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

        if (keyword) {
            const lowerKeyword = keyword.toLowerCase();
            const matchTitle = task.title.toLowerCase().includes(lowerKeyword);
            const matchDesc = (task.description || "").toLowerCase().includes(lowerKeyword);
            if (!matchTitle && !matchDesc) return false;
        }

        // 7. 保存されたフィルター
        if (savedFilter && savedFilter.query) {
            if (!checkSavedFilter(task, savedFilter.query)) return false;
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

/**
 * 保存されたフィルターのクエリ評価
 */
function checkSavedFilter(task, queryStr) {
    const query = parseFilterQuery(queryStr);

    // 1. プロジェクト
    if (query.project && query.project.length > 0) {
        if (!query.project.includes(String(task.projectId || ''))) return false;
    }

    // 2. 時間帯
    if (query.timeblock && query.timeblock.length > 0) {
        const tid = (!task.timeBlockId || task.timeBlockId === 'null') ? 'none' : String(task.timeBlockId);
        // モーダル側で 'none' は 'null' として保存されているが、
        // parseFilterQuery で 'null' 文字列が来るか確認が必要
        // filter-modal.js では 'null' 文字列として保存している
        // map(v => v === UNASSIGNED_ID ? 'null' : v)
        // ここでの比較: task側が未定なら 'none' としたが、クエリ側が 'null' かもしれない

        const hasMatch = query.timeblock.some(q => {
            if (q === 'null' || q === 'none') {
                return tid === 'none' || tid === 'null' || !task.timeBlockId;
            }
            return q === tid;
        });
        if (!hasMatch) return false;
    }

    // 3. 所要時間
    if (query.duration && query.duration.length > 0) {
        if (!query.duration.includes(String(task.duration || ''))) return false;
    }

    // 4. 日付
    if (query.date && query.date.length > 0) {
        if (!task.dueDate) return false;

        const taskDate = new Date(task.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const isMatch = query.date.some(d => {
            if (d === 'today') {
                return isSameDay(taskDate, today);
            }
            if (d === 'tomorrow') {
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                return isSameDay(taskDate, tomorrow);
            }
            if (d === 'week') {
                // 明確な定義が必要だが、一旦「今日から7日間」あるいは「今週(日曜始まり)」など
                // filter-modal.jsには「今週」とある。
                // ここでは簡易的に「今日を含む今週(日曜〜土曜)」とする
                const start = new Date(today);
                start.setDate(today.getDate() - today.getDay()); // 今週の日曜
                const end = new Date(start);
                end.setDate(end.getDate() + 6); // 今週の土曜
                end.setHours(23, 59, 59, 999);
                return taskDate >= start && taskDate <= end;
            }
            if (d === 'next-week') {
                const start = new Date(today);
                start.setDate(today.getDate() - today.getDay() + 7); // 来週の日曜
                const end = new Date(start);
                end.setDate(end.getDate() + 6); // 来週の土曜
                end.setHours(23, 59, 59, 999);
                return taskDate >= start && taskDate <= end;
            }
            return false;
        });
        if (!isMatch) return false;
    }

    return true;
}

function parseFilterQuery(query) {
    const result = {};
    if (!query) return result;

    query.split(/\s+/).forEach(part => {
        if (!part.includes(':')) return;
        const [key, val] = part.split(':');
        result[key] = val.split(',');
    });
    return result;
}

function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}