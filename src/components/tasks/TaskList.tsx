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
    const {
        filterType, targetId, query,
        showCompleted, sortCriteria,
        setShowCompleted
    } = useFilterStore();
    const { density } = useSettingsStore();

    // Memoize filter configuration
    const config = useMemo(() => {
        return {
            keyword: query,
            showCompleted: showCompleted,
            projectId: filterType === 'inbox' ? 'unassigned' : (filterType === 'project' ? targetId : null),
            labelId: filterType === 'label' ? targetId : null,
            timeBlockId: filterType === 'timeblock' ? targetId : null,
            duration: filterType === 'duration' ? targetId : null,
            savedFilter: null, // Custom filters logic can be added later
            sortCriteria: sortCriteria,
        };
    }, [filterType, targetId, query, showCompleted, sortCriteria]);

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
                <div className="mb-4 flex items-center gap-2">
                    <div className="flex-1">
                        <AddTaskButton />
                    </div>
                    {/* View Options Toggle (Simple version) */}
                    <button
                        onClick={() => setShowCompleted(!showCompleted)}
                        className={cn(
                            "px-3 py-2 rounded-lg text-xs font-medium border transition-colors",
                            showCompleted
                                ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300"
                                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                        )}
                        title={showCompleted ? "Hide completed tasks" : "Show completed tasks"}
                    >
                        {showCompleted ? '完了を隠す' : '完了を表示'}
                    </button>
                    {/* Sort is currently fixed to createdAt_desc in UI but store supports it. Future refactor to add dropdown */}
                </div>

                {processedTasks.length === 0 ? (
                    <div className="text-center text-gray-400 py-12 flex flex-col items-center justify-center h-[50vh]">
                        <svg className="w-16 h-16 text-gray-200 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                        <p className="text-sm font-medium">No tasks found</p>
                        <p className="text-xs mt-1 opacity-70">
                            {showCompleted ? "Try changing filters." : "Create a new task or show completed to see history."}
                        </p>
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
