import { Task } from '../store/schema';
import { toDate } from '../utils/date';

type SortCriteria = 'dueDate' | 'createdAt' | 'title' | 'duration' | 'dueDate_desc' | 'createdAt_desc' | 'title_desc' | 'duration_desc';

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
                valA = toDate(a.dueDate)?.getTime();
                valB = toDate(b.dueDate)?.getTime();
                break;
            case 'createdAt':
                valA = toDate(a.createdAt)?.getTime();
                valB = toDate(b.createdAt)?.getTime();
                break;
            case 'title':
                valA = a.title.toLowerCase();
                valB = b.title.toLowerCase();
                break;
            case 'duration':
                valA = a.duration || 0;
                valB = b.duration || 0;
                break;
            default:
                valA = 0;
                valB = 0;
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
