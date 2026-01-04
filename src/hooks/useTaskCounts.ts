import { useMemo } from 'react';
import { parseFilterQuery } from '../logic/filter-parser';
import { matchesConditions } from '../logic/search';
import { useFilterStore } from '../store/ui/filter-store';
import { isToday, isUpcoming, toDate } from '../utils/date';
import { useFilters } from './useFilters';
import { useTasks } from './useTasks';

export type TaskCounts = {
    inbox: number;
    today: number;
    upcoming: number;
    important: number;
    all: number;
    search: number;
    projects: Record<string, number>;
    customFilters: Record<string, number>;
};

export function useTaskCounts() {
    const { tasks } = useTasks();
    const { filters } = useFilters();
    const { showCompleted, query: searchQuery } = useFilterStore();

    // Future Improvement: Move aggregation to Firestore (server-side counters)
    // Currently computing efficiently on client-side on tasks updates.
    const counts = useMemo(() => {
        const acc: TaskCounts = {
            inbox: 0,
            today: 0,
            upcoming: 0,
            important: 0,
            all: 0,
            search: 0,
            projects: {},
            customFilters: {}
        };

        // Pre-compute lowercase search query if exists
        const normalizedQuery = searchQuery ? searchQuery.toLowerCase().trim() : '';

        // Pre-parse custom filter queries
        const activeFilters = filters.map(f => ({
            id: f.id!,
            conditions: parseFilterQuery(f.query)
        }));

        for (const task of tasks) {
            // Count search matches regardless of status filters? 
            // Usually search results include completed if showCompleted is true, but count needs to match filtered view.
            // Here we count all matches or filtered? 
            // count is undefined or 0 if matched only
            // But if query exists, we need to decide if matched count respects completed/archived?
            // Usually 'Search' view shows completed tasks too if settings allow.
            // But 'Active' tasks search?
            // Count search matches: include title and description for consistency with SearchView
            if (normalizedQuery) {
                const titleMatch = task.title?.toLowerCase().includes(normalizedQuery);
                const descMatch = task.description?.toLowerCase().includes(normalizedQuery);
                if (titleMatch || descMatch) {
                    acc.search++;
                }
            }

            // Exclude archived/trash from main counters
            if (task.status === 'archived') continue;

            const isCompleted = task.status === 'completed';

            // Custom Filters Counting (Active Only)
            // We count custom filters EVEN if completed, IF the filter allows it?
            // Sidebar badges usually imply "Active Count". To keep it simple and consistent:
            // Report matches that are NOT completed.
            if (!isCompleted) {
                for (const { id, conditions } of activeFilters) {
                    if (matchesConditions(task, conditions)) {
                        acc.customFilters[id] = (acc.customFilters[id] || 0) + 1;
                    }
                }
            }

            // Issue #8: Search badge vs Filter view inconsistency
            // 'Today', 'Upcoming', 'Inbox', 'Important' badges usually show ACTIVE tasks count only.
            // If we include completed, the badge is confusing (e.g. 'Today: 5' but all done).
            if (isCompleted) {
                continue;
            }

            // --- Active Tasks Only Below ---

            acc.all++;

            // Project Count
            if (task.projectId) {
                acc.projects[task.projectId] = (acc.projects[task.projectId] || 0) + 1;
            }

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
                const dateObj = toDate(task.dueDate);
                if (dateObj) {
                    const todayStart = new Date();
                    todayStart.setHours(0, 0, 0, 0);

                    if (dateObj < todayStart) {
                        acc.today++; // Overdue counts as today
                    } else if (isToday(dateObj)) {
                        acc.today++;
                    } else if (isUpcoming(dateObj)) {
                        acc.upcoming++;
                    }
                }
            }
        }

        return acc;
    }, [tasks, searchQuery, filters]); // showCompleted dependency removed: badges count active tasks usually

    return counts;
}
