import { Task } from '../store/schema';
import { getStartOfWeek, isSameDay, toDate } from '../utils/date';
import { FilterConditions, parseFilterQuery } from './filter-parser';
import { sortTasks } from './sort';

type FilterCriteria = string | FilterConditions;

export function filterTasks(tasks: Task[], criteria: FilterCriteria): Task[] {
    if (!criteria) return tasks;

    const conditions = typeof criteria === 'string' ? parseFilterQuery(criteria) : criteria;

    return tasks.filter(task => {
        // 1. Status Check
        if (conditions.status.length > 0) {
            const status = task.status || 'todo';
            const lookingForCompleted = conditions.status.includes('completed');
            if (lookingForCompleted && status !== 'completed') return false;
            // 'active' or 'todo' logic could be added here if needed
            // Assuming default excludes completed unless specified, or maybe status check overrides default?
            // Usually, search filters narrow down. If status:completed is specified, must be completed.
        }

        // 2. Project Check
        if (conditions.projects.length > 0) {
            if (!task.projectId || !conditions.projects.includes(task.projectId)) {
                // If project ID is specific, task must match.
                // Could be partial match if we supported name search, but IDs usually exact.
                // For now exact match on ID.
                return false;
            }
        }

        // 3. Label Check
        if (conditions.labels.length > 0) {
            if (!task.labelIds || !conditions.labels.some(l => task.labelIds?.includes(l))) {
                return false;
            }
        }

        // 4. TimeBlock Check
        if (conditions.timeBlocks.length > 0) {
            if (!task.timeBlockId || !conditions.timeBlocks.includes(task.timeBlockId)) {
                return false;
            }
        }

        // 5. Duration Check
        if (conditions.durations.length > 0) {
            // Simple string match for number or exact number match
            const dur = String(task.duration);
            if (!conditions.durations.includes(dur)) return false;
        }

        // 6. Date Check
        if (conditions.dates.length > 0) {
            const taskDate = toDate(task.dueDate);
            if (!taskDate) return false;

            const isMatch = conditions.dates.some(d => {
                const now = new Date();
                if (d === 'today') return isSameDay(taskDate, now);
                if (d === 'tomorrow') {
                    const tmrw = new Date(now);
                    tmrw.setDate(tmrw.getDate() + 1);
                    return isSameDay(taskDate, tmrw);
                }
                if (d === 'week') {
                    // This week? Or next 7 days? Usually means "within this week".
                    const start = getStartOfWeek(now);
                    const end = new Date(start);
                    end.setDate(end.getDate() + 7);
                    return taskDate >= start && taskDate < end;
                }
                if (d === 'overdue') {
                    const startOfToday = new Date(now);
                    startOfToday.setHours(0, 0, 0, 0);
                    return taskDate < startOfToday && task.status !== 'completed';
                }
                return false; // Unknown date keywords ignored or exact date string matching not implemented here yet
            });
            if (!isMatch) return false;
        }

        // 7. Keywords (Title/Description)
        if (conditions.keywords.length > 0) {
            const content = `${task.title} ${task.description || ''}`.toLowerCase();
            const matchesAll = conditions.keywords.every(kw => content.includes(kw));
            if (!matchesAll) return false;
        }

        return true;
    });
}

/**
 * UIの条件に基づいたタスクの抽出とソート
 */
export function getProcessedTasks(tasks: Task[], config: any): Task[] {
    const { keyword, showCompleted, projectId, labelId, timeBlockId, duration, savedFilter, sortCriteria } = config;

    let filtered = tasks;

    // キーワード検索
    if (keyword) {
        const k = keyword.toLowerCase();
        filtered = filtered.filter(t =>
            (t.title + (t.description || '')).toLowerCase().includes(k)
        );
    }

    // 完了済み表示設定
    if (!showCompleted) {
        filtered = filtered.filter(t => t.status !== 'completed');
    }

    // プロジェクト絞り込み
    if (projectId === 'unassigned') {
        filtered = filtered.filter(t => !t.projectId);
    } else if (projectId) {
        filtered = filtered.filter(t => t.projectId === projectId);
    }

    // ラベル絞り込み
    if (labelId) {
        filtered = filtered.filter(t => t.labelIds?.includes(labelId));
    }

    // 時間帯絞り込み
    if (timeBlockId === 'unassigned') {
        filtered = filtered.filter(t => !t.timeBlockId);
    } else if (timeBlockId) {
        filtered = filtered.filter(t => t.timeBlockId === timeBlockId);
    }

    // 所要時間絞り込み
    if (duration) {
        const dur = parseInt(duration, 10);
        if (!isNaN(dur)) {
            filtered = filtered.filter(t => t.duration === dur);
        }
    }

    // 保存済みフィルターの適用
    if (savedFilter && savedFilter.query) {
        filtered = filterTasks(filtered, savedFilter.query);
    }

    // ソートの適用
    return sortTasks(filtered, sortCriteria);
}

