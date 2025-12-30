import React, { useMemo } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { getProcessedTasks } from '../../logic/search';
import { useFilterStore } from '../../store/ui/filter-store';
import { useSettingsStore } from '../../store/ui/settings-store';
import { cn } from '../../utils/cn';
import { AddTaskButton } from './AddTaskButton';
import { TaskItem } from './TaskItem';
import { TaskStats } from './TaskStats'; // New component

export const TaskList: React.FC = () => {
    const { tasks, loading } = useTasks();
    const { filterType, targetId, searchQuery } = useFilterStore();
    const { density } = useSettingsStore();

    // Memoize filter configuration
    const config = useMemo(() => {
        return {
            keyword: searchQuery,
            showCompleted: false, // Default false, could be connected to store/toggle
            projectId: filterType === 'inbox' ? 'unassigned' : (filterType === 'project' ? targetId : null),
            labelId: filterType === 'label' ? targetId : null,
            timeBlockId: filterType === 'timeblock' ? targetId : null,
            duration: filterType === 'duration' ? targetId : null,
            savedFilter: null, // Custom filters logic can be added later
            sortCriteria: 'createdAt_desc', // Could be connected to a sort store
            // title: handled by App Header
        };
    }, [filterType, targetId, searchQuery]);

    // Process tasks (filter & sort)
    const processedTasks = useMemo(() => {
        return getProcessedTasks(tasks, config);
    }, [tasks, config]);

    // Determine density class
    const densityClass = {
        compact: 'space-y-1',
        normal: 'space-y-2',
        comfortable: 'space-y-3',
        spacious: 'space-y-4'
    }[density];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-gray-400 text-sm animate-pulse">Loading tasks...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden relative">
            {/* Task List Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-1 pb-20">
                <div className="mb-4">
                    <AddTaskButton />
                </div>

                {processedTasks.length === 0 ? (
                    <div className="text-center text-gray-400 py-12 flex flex-col items-center justify-center h-[50vh]">
                        <svg className="w-16 h-16 text-gray-200 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                        <p className="text-sm font-medium">No tasks found</p>
                        <p className="text-xs mt-1 opacity-70">Create a new task to get started.</p>
                    </div>
                ) : (
                    <ul className={cn("transition-all duration-200", densityClass)}>
                        {processedTasks.map(task => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                    </ul>
                )}
            </div>

            {/* Stats Bar (Sticky Bottom Area) */}
            <div className="flex-none mt-auto pt-2 border-t border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur pb-2">
                <TaskStats tasks={processedTasks} timeBlockId={config.timeBlockId} />
            </div>
        </div>
    );
};
