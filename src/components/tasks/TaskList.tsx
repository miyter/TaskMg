import React, { useMemo } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { getProcessedTasks } from '../../logic/search';
import { Task } from '../../store/schema';
import { useFilterStore } from '../../store/ui/filter-store';
import { useModalStore } from '../../store/ui/modal-store';
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
        setShowCompleted, setSortCriteria
    } = useFilterStore();
    const { density } = useSettingsStore();
    const { openModal } = useModalStore();

    // Memoize filter configuration
    const config = useMemo(() => {
        return {
            keyword: query,
            showCompleted: showCompleted,
            projectId: filterType === 'inbox' ? 'unassigned' : (filterType === 'project' ? targetId : null),
            labelId: filterType === 'label' ? targetId : null,
            timeBlockId: filterType === 'timeblock' ? targetId : null,
            duration: filterType === 'duration' ? targetId : null,
            filterType: filterType,
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
                <div className="text-gray-400 text-sm animate-pulse">タスクを読み込み中...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden relative">
            {/* Task List Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-1 pb-24">
                <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm pt-1 pb-4 mb-4 flex items-center gap-2">
                    <div className="flex-1">
                        <AddTaskButton initialValue={query} />
                    </div>

                    {/* Sort Options */}
                    <div className="flex items-center gap-2 px-1">
                        <select
                            value={sortCriteria}
                            onChange={(e) => setSortCriteria(e.target.value)}
                            className="text-xs bg-transparent border-none outline-none text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer font-medium"
                        >
                            <option value="createdAt_desc">作成日順</option>
                            <option value="dueDate_asc">期限が近い順</option>
                            <option value="important_desc">重要度順</option>
                            <option value="title_asc">名前順</option>
                        </select>
                    </div>

                    <button
                        onClick={() => setShowCompleted(!showCompleted)}
                        className={cn(
                            "px-3 py-2 rounded-lg text-xs font-medium border transition-colors shrink-0",
                            showCompleted
                                ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300"
                                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                        )}
                        title={showCompleted ? "Hide completed tasks" : "Show completed tasks"}
                    >
                        {showCompleted ? '完了を非表示' : '完了を表示'}
                    </button>
                </div>

                {processedTasks.length === 0 ? (
                    <div className="text-center py-20 flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="relative mb-8">
                            <div className="absolute -inset-4 bg-blue-500/10 dark:bg-blue-400/10 blur-3xl rounded-full" />
                            <div className="relative">
                                <svg className="w-24 h-24 text-blue-200 dark:text-blue-900/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">タスクが見つかりません</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-8">
                            {showCompleted ? "フィルタを変更するか、新しいタスクを作成して一日を始めましょう。" : "完了したタスクを表示するか、新しいタスクを追加してください。"}
                        </p>
                        <button
                            onClick={() => openModal('task-detail', { title: '' })}
                            className="btn-premium flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            新しいタスクを追加
                        </button>
                    </div>
                ) : (
                    <ul className={cn("transition-all duration-200", densityClass)}>
                        {processedTasks.map((task: Task) => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                    </ul>
                )}
            </div>

            {/* Stats Bar (Sticky Bottom Area) */}
            <div className="flex-none mt-auto pt-2 border-t border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
                <TaskStats tasks={processedTasks} timeBlockId={config.timeBlockId} />
            </div>
        </div>
    );
};
