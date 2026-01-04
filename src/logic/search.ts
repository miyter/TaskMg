import { Task } from '../store/schema';
import { getStartOfWeek, isSameDay, toDate } from '../utils/date';
import { FilterConditions, parseFilterQuery } from './filter-parser';
import { sortTasks } from './sort';

type FilterCriteria = string | FilterConditions;

/**
 * 日付基準値を事前計算 (パフォーマンス最適化)
 */
function createDateBaselines() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const weekStart = getStartOfWeek(now);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const upcomingEnd = new Date(tomorrow);
    upcomingEnd.setDate(upcomingEnd.getDate() + 7);

    return { now, tomorrow, weekStart, weekEnd, upcomingEnd };
}

/**
 * 日付条件のマッチング (事前計算した基準値を使用)
 */
function matchesDateCondition(
    taskDate: Date,
    condition: string,
    baselines: ReturnType<typeof createDateBaselines>,
    taskStatus: string
): boolean {
    const { now, tomorrow, weekStart, weekEnd, upcomingEnd } = baselines;

    switch (condition) {
        case 'today':
            return isSameDay(taskDate, now) || (taskDate < now && taskStatus !== 'completed');
        case 'tomorrow':
            return isSameDay(taskDate, tomorrow);
        case 'week':
            return taskDate >= weekStart && taskDate < weekEnd;
        case 'upcoming':
            return taskDate >= tomorrow && taskDate < upcomingEnd;
        case 'overdue':
            return taskDate < now && taskStatus !== 'completed';
        default:
            return false;
    }
}

/**
 * 単一タスクが条件に一致するか判定
 */
export function matchesConditions(
    task: Task,
    conditions: FilterConditions,
    dateBaselines: ReturnType<typeof createDateBaselines> | null = null
): boolean {
    // 0. Date Baselines (Calculate if not provided and needed)
    if (!dateBaselines && conditions.dates.length > 0) {
        dateBaselines = createDateBaselines();
    }

    // 1. Status Check
    if (conditions.status.length > 0) {
        const status = task.status || 'todo';
        const isMatch = conditions.status.some(s => {
            if (s === 'active' && status === 'todo') return true;
            return s === status;
        });
        if (!isMatch) return false;
    }
    if (conditions.excludeStatus.length > 0) {
        const status = task.status || 'todo';
        const isMatch = conditions.excludeStatus.some(s => {
            if (s === 'active' && status === 'todo') return true;
            return s === status;
        });
        if (isMatch) return false;
    }

    // 1.5 Important Check
    if (conditions.isImportant === true && !task.isImportant) {
        return false;
    }
    if (conditions.isImportant === false && task.isImportant) {
        return false;
    }

    // 2. Project Check
    if (conditions.projects.length > 0) {
        const hasMatch = conditions.projects.some(p => {
            if (p === 'unassigned') {
                return !task.projectId || task.projectId === 'unassigned' || task.projectId === 'none';
            }
            return task.projectId === p;
        });
        if (!hasMatch) return false;
    }
    if (conditions.excludeProjects.length > 0) {
        if (conditions.excludeProjects.some(p => task.projectId === p)) return false;
    }

    // 3. Label Check
    if (conditions.labels.length > 0) {
        if (!task.labelIds || !conditions.labels.some(l => task.labelIds?.includes(l))) {
            return false;
        }
    }
    if (conditions.excludeLabels.length > 0) {
        if (task.labelIds && conditions.excludeLabels.some(l => task.labelIds?.includes(l))) return false;
    }

    // 4. TimeBlock Check
    if (conditions.timeBlocks.length > 0) {
        const hasMatch = conditions.timeBlocks.some(tb => {
            if (tb === 'unassigned') return !task.timeBlockId;
            return task.timeBlockId === tb;
        });
        if (!hasMatch) return false;
    }
    if (conditions.excludeTimeBlocks.length > 0) {
        if (conditions.excludeTimeBlocks.some(tb => task.timeBlockId === tb)) return false;
    }

    // 5. Duration Check (Number comparison)
    if (conditions.durations.length > 0) {
        const taskDur = task.duration || 0;
        if (!conditions.durations.includes(taskDur)) return false;
    }

    // 6. Date Check (Using pre-calculated baselines)
    if (conditions.dates.length > 0) {
        // Safe check for dateBaselines
        const baselines = dateBaselines || createDateBaselines();

        const taskDate = toDate(task.dueDate);
        if (!taskDate) return false;

        const isMatch = conditions.dates.some(d =>
            matchesDateCondition(taskDate, d, baselines, task.status || 'todo')
        );
        if (!isMatch) return false;
    }

    // 7. Keywords (Title/Description)
    const content = `${task.title} ${task.description || ''}`.toLowerCase();

    if (conditions.keywords.length > 0) {
        const matchesAll = conditions.keywords.every(kw => {
            // If kw is array, it's an OR group (matches ANY)
            if (Array.isArray(kw)) {
                return kw.some(k => content.includes(k));
            }
            // Else it's a standard keyword (must include)
            return content.includes(kw);
        });
        if (!matchesAll) return false;
    }

    if (conditions.excludeKeywords.length > 0) {
        const matchesAnyExclude = conditions.excludeKeywords.some(kw => content.includes(kw));
        if (matchesAnyExclude) return false;
    }

    return true;
}

/**
 * フィルター条件に基づいてタスクを絞り込む (Primary Engine)
 */
export function filterTasks(tasks: Task[], criteria: FilterCriteria): Task[] {
    if (!criteria) return tasks;

    const conditions = typeof criteria === 'string' ? parseFilterQuery(criteria) : criteria;

    // 日付基準値を事前計算 (タスクごとに再計算しない)
    const dateBaselines = conditions.dates.length > 0 ? createDateBaselines() : null;

    return tasks.filter(task => matchesConditions(task, conditions, dateBaselines));
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
 * SearchConfigからFilterConditionsを構築するヘルパー
 */
function buildFilterConditions(config: SearchConfig): FilterConditions {
    const { keyword, showCompleted, projectId, labelId, timeBlockId, duration, filterType } = config;

    // ベースとなる条件オブジェクトを作成
    const conditions: FilterConditions = keyword ? parseFilterQuery(keyword) : {
        keywords: [],
        excludeKeywords: [],
        projects: [],
        excludeProjects: [],
        labels: [],
        excludeLabels: [],
        timeBlocks: [],
        excludeTimeBlocks: [],
        durations: [],
        dates: [],
        status: [],
        excludeStatus: [],
        isImportant: undefined
    };

    // UI選択からの条件追加
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
    if (filterType === 'important') conditions.isImportant = true;

    // 完了表示設定
    if (!showCompleted) {
        // Only add 'active' if not already explicitly filtering status
        if (conditions.status.length === 0) {
            conditions.status.push('active');
        }
    }

    return conditions;
}

/**
 * UIの条件に基づいたタスクの抽出とソート (Unified implementation)
 * 
 * Note: This function is designed to be wrapped with useMemo at the component level
 * for optimal performance. The tasks and config should be memoized dependencies.
 */
export function getProcessedTasks(tasks: Task[], config: SearchConfig): Task[] {
    const { savedFilter, sortCriteria } = config;

    // 1. 条件構築 (extracted for clarity)
    const conditions = buildFilterConditions(config);

    // 2. フィルタリング実行
    let filtered = filterTasks(tasks, conditions);

    // 3. 保存済みフィルター（クエリ文字列）があれば更に追加で適用
    if (savedFilter && savedFilter.query) {
        filtered = filterTasks(filtered, savedFilter.query);
    }

    // 4. ソートの適用
    return sortTasks(filtered, sortCriteria || 'createdAt_desc');
}
