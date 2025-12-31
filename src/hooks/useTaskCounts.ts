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
            // Let's count filtered-like logic for search badge if query exists and matches
            if (normalizedQuery && task.title?.toLowerCase().includes(normalizedQuery)) {
                acc.search++;
            }

            // Exclude archived/trash from main counters
            if (task.status === 'archived') continue;

            const isCompleted = task.status === 'completed';

            // "All Tasks" count usually includes completed? Or just active?
            // "Inbox" usually implies active tasks?
            // Let's stick to Active tasks for sidebar badges unless specified otherwise

            if (isCompleted) {
                // If we want badges to show ONLY active tasks implies skipping completed
                // but let's assume badges count Active tasks only.
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
