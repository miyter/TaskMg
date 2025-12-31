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
    const { showCompleted } = useFilterStore();

    const counts = useMemo(() => {
        const acc = {
            inbox: 0,
            today: 0,
            upcoming: 0,
            important: 0,
            all: 0,
            search: 0
        };

        tasks.forEach(task => {
            // Check completion status
            if (task.status === 'completed' && !showCompleted) return;
            if (task.status === 'archived') return;

            // All Tasks
            acc.all++;

            // Inbox (unassigned project)
            if (!task.projectId || task.projectId === 'unassigned' || task.projectId === 'none') {
                acc.inbox++;
            }

            // Important
            if (task.isImportant) {
                acc.important++;
            }

            // Date processing
            if (task.dueDate) {
                if (isToday(task.dueDate)) {
                    acc.today++;
                } else if (isUpcoming(task.dueDate)) {
                    acc.upcoming++;
                }
            }
        });

        return acc;
    }, [tasks, showCompleted]);

    return counts;
}
