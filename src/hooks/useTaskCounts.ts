import { useMemo } from 'react';
import { useFilterStore } from '../store/ui/filter-store';
import { isToday, isUpcoming } from '../utils/date';
import { useTasks } from './useTasks';

export type TaskCounts = {
    inbox: number;
    today: number;
    upcoming: number;
    important: number;
    all: number;
    search: number;
};

export function useTaskCounts() {
    const { tasks } = useTasks();
    const { showCompleted, query: searchQuery } = useFilterStore();

    // Future Improvement: Move aggregation to Firestore (server-side counters)
    // Currently computing efficiently on client-side on tasks updates.
    const counts = useMemo(() => {
        const acc = {
            inbox: 0,
            today: 0,
            upcoming: 0,
            important: 0,
            all: 0,
            search: 0
        };

        // Pre-compute lowercase search query if exists
        const normalizedQuery = searchQuery ? searchQuery.toLowerCase().trim() : '';

        for (const task of tasks) {
            // Count search matches regardless of status filters? 
            // Usually search results include completed if showCompleted is true, but count needs to match filtered view.
            // Here we count all matches or filtered? 
            // count is undefined or 0 if matched only
            // But if query exists, we need to decide if matched count respects completed/archived?
            // Usually 'Search' view shows completed tasks too if settings allow.
            // But 'Active' tasks search?
            // Let's count matches of all non-archived for search badge
            if (normalizedQuery && task.title?.toLowerCase().includes(normalizedQuery)) {
                acc.search++;
            }

            // Exclude archived/trash from main counters
            if (task.status === 'archived') continue;

            const isCompleted = task.status === 'completed';

            // Issue #8: Search badge vs Filter view inconsistency
            // 'Today', 'Upcoming', 'Inbox', 'Important' badges usually show ACTIVE tasks count only.
            // If we include completed, the badge is confusing (e.g. 'Today: 5' but all done).
            if (isCompleted) {
                continue;
            }

            // --- Active Tasks Only Below ---

            acc.all++;


            // Inbox: No Project or 'unassigned'
            if (!task.projectId || task.projectId === 'unassigned' || task.projectId === 'none') {
                acc.inbox++;
            }

            // Important
            if (task.isImportant) {
                acc.important++;
            }

            // Date
            if (task.dueDate) {
                if (isToday(task.dueDate)) {
                    acc.today++;
                } else if (isUpcoming(task.dueDate)) {
                    acc.upcoming++;
                }
            }
        }

        return acc;
    }, [tasks, searchQuery]); // showCompleted dependency removed: badges count active tasks usually

    return counts;
}
