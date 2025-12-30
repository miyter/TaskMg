import { Task } from '../store/schema';
import { getStartOfWeek, isSameDay, toDate } from '../utils/date';
import { FilterConditions, parseFilterQuery } from './filter-parser';
import { sortTasks } from './sort';

type FilterCriteria = string | FilterConditions;

/**
 * フィルター条件に基づいてタスクを絞り込む (Primary Engine)
 */
export function filterTasks(tasks: Task[], criteria: FilterCriteria): Task[] {
    if (!criteria) return tasks;

    const conditions = typeof criteria === 'string' ? parseFilterQuery(criteria) : criteria;

    return tasks.filter(task => {
        // 1. Status Check
        if (conditions.status.length > 0) {
            const status = task.status || 'todo';
            // "completed" が条件に含まれている場合、タスクも "completed" である必要がある
            if (conditions.status.includes('completed') && status !== 'completed') return false;
            // "active" (等) が条件に含まれている場合、タスクは "completed" 以外である必要がある
            if (conditions.status.includes('active') && status === 'completed') return false;
            // "important" が条件に含まれている場合、タスクの isImportant フラグをチェック
            if (conditions.status.includes('important') && !task.isImportant) return false;
        }

        // 2. Project Check
        if (conditions.projects.length > 0) {
            const hasMatch = conditions.projects.some(p => {
                if (p === 'unassigned') return !task.projectId;
                return task.projectId === p;
            });
            if (!hasMatch) return false;
        }

        // 3. Label Check
        if (conditions.labels.length > 0) {
            if (!task.labelIds || !conditions.labels.some(l => task.labelIds?.includes(l))) {
                return false;
            }
        }

        // 4. TimeBlock Check
        if (conditions.timeBlocks.length > 0) {
            const hasMatch = conditions.timeBlocks.some(tb => {
                if (tb === 'unassigned') return !task.timeBlockId;
                return task.timeBlockId === tb;
            });
            if (!hasMatch) return false;
        }

        // 5. Duration Check (Number comparison)
        if (conditions.durations.length > 0) {
            const taskDur = task.duration || 0;
            if (!conditions.durations.includes(taskDur)) return false;
        }

        // 6. Date Check
        if (conditions.dates.length > 0) {
            const taskDate = toDate(task.dueDate);
            if (!taskDate) return false;

            const isMatch = conditions.dates.some(d => {
                const now = new Date();
                now.setHours(0, 0, 0, 0);

                if (d === 'today') return isSameDay(taskDate, now);
                if (d === 'tomorrow') {
                    const tmrw = new Date(now);
                    tmrw.setDate(tmrw.getDate() + 1);
                    return isSameDay(taskDate, tmrw);
                }
                if (d === 'week') {
                    const start = getStartOfWeek(now);
                    const end = new Date(start);
                    end.setDate(end.getDate() + 7);
                    return taskDate >= start && taskDate < end;
                }
                if (d === 'upcoming') {
                    // 明日以降の7日間
                    const tmrw = new Date(now);
                    tmrw.setDate(tmrw.getDate() + 1);
                    const nextWeek = new Date(tmrw);
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    return taskDate >= tmrw && taskDate < nextWeek;
                }
                if (d === 'overdue') {
                    return taskDate < now && task.status !== 'completed';
                }
                return false;
            });
            if (!isMatch) return false;
        }

        // 7. Keywords (Title/Description) - AND search
        if (conditions.keywords.length > 0) {
            const content = `${task.title} ${task.description || ''}`.toLowerCase();
            const matchesAll = conditions.keywords.every(kw => content.includes(kw.toLowerCase()));
            if (!matchesAll) return false;
        }

        return true;
    });
}

export interface SearchConfig {
    keyword?: string | null;
    showCompleted?: boolean;
    projectId?: string | 'unassigned' | null;
    labelId?: string | null;
    timeBlockId?: string | 'unassigned' | null;
    duration?: string | number | null;
    savedFilter?: { query: string } | null;
    sortCriteria?: string;
    filterType?: string | null;
}

/**
 * UIの条件に基づいたタスクの抽出とソート (Unified implementation)
 */
export function getProcessedTasks(tasks: Task[], config: SearchConfig): Task[] {
    const {
        keyword, showCompleted, projectId, labelId,
        timeBlockId, duration, savedFilter, sortCriteria, filterType
    } = config;

    // 1. ベースとなる条件オブジェクトを作成 (キーワードがあればパース、なければ空)
    const conditions: FilterConditions = keyword ? parseFilterQuery(keyword) : {
        keywords: [],
        projects: [],
        labels: [],
        timeBlocks: [],
        durations: [],
        dates: [],
        status: []
    };

    // 2. config から追加の条件（サイドバークリック等）をマッピング
    if (projectId) conditions.projects.push(projectId);
    if (labelId) conditions.labels.push(labelId);
    if (timeBlockId) conditions.timeBlocks.push(timeBlockId);

    if (duration) {
        const d = typeof duration === 'number' ? duration : parseInt(duration, 10);
        if (!isNaN(d)) conditions.durations.push(d);
    }

    // filterType (today, upcoming, important) の処理
    if (filterType === 'today') conditions.dates.push('today');
    if (filterType === 'upcoming') conditions.dates.push('upcoming');
    if (filterType === 'important') conditions.status.push('important'); // 特殊なステータス扱いとして条件に追加

    // 完了表示設定
    if (!showCompleted) {
        conditions.status.push('active');
    }

    // 3. フィルタリング実行
    let filtered = filterTasks(tasks, conditions);

    // 4. 保存済みフィルター（クエリ文字列）があれば更に追加で適用
    if (savedFilter && savedFilter.query) {
        filtered = filterTasks(filtered, savedFilter.query);
    }

    // 5. ソートの適用
    return sortTasks(filtered, sortCriteria || 'createdAt_desc');
}

