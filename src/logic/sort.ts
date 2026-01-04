import { Task } from '../store/schema';
import { ensureDate } from '../utils/date-tz';

export type SortCriteria = 'dueDate' | 'createdAt' | 'title' | 'duration' | 'dueDate_desc' | 'createdAt_desc' | 'title_desc' | 'duration_desc' | string;

export function sortTasks(tasks: Task[], criteria: SortCriteria = 'createdAt_desc'): Task[] {
    if (!Array.isArray(tasks)) return [];

    const [field, direction] = criteria.split('_') as [string, string | undefined];
    const isDesc = direction === 'desc';
    const multiplier = isDesc ? -1 : 1;

    return [...tasks].sort((a, b) => {
        let valA: any;
        let valB: any;

        switch (field) {
            case 'dueDate':
                valA = ensureDate(a.dueDate)?.getTime();
                valB = ensureDate(b.dueDate)?.getTime();
                break;
            case 'createdAt':
                valA = ensureDate(a.createdAt)?.getTime();
                valB = ensureDate(b.createdAt)?.getTime();
                break;
            case 'title':
                valA = a.title.toLowerCase();
                valB = b.title.toLowerCase();
                break;
            case 'duration':
                valA = a.duration || 0;
                valB = b.duration || 0;
                break;
            case 'important':
                valA = a.isImportant ? 1 : 0;
                valB = b.isImportant ? 1 : 0;
                break;
            case 'manual':
                // order is ascending (smaller first)
                valA = a.order !== undefined ? a.order : Number.MAX_SAFE_INTEGER;
                valB = b.order !== undefined ? b.order : Number.MAX_SAFE_INTEGER;
                break;
            default:
                // 不明な criteria の場合は createdAt にフォールバック
                // console.debug(`[sortTasks] Unknown criteria: ${field}, falling back to createdAt`);
                valA = ensureDate(a.createdAt)?.getTime();
                valB = ensureDate(b.createdAt)?.getTime();
        }

        return compareNullable(valA, valB) * multiplier;
    });
}

function compareNullable(a: any, b: any): number {
    if (a === b) return 0;
    // Nulls last usually? Or first?
    // Let's say nulls last for ASC, so big value.
    if (a === null || a === undefined) return 1;
    if (b === null || b === undefined) return -1;

    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
}
