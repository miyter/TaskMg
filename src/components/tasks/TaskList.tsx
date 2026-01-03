import {
    DragEndEvent,
    useDndMonitor
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useMemo } from 'react';
import { useTranslation } from '../../core/translations';
import { UI_CONFIG } from '../../core/ui-constants';
import { useTasks } from '../../hooks/useTasks';
import { getProcessedTasks } from '../../logic/search';
import { reorderTasks } from '../../store';
import { Task } from '../../store/schema';
import { useFilterStore } from '../../store/ui/filter-store';
import { useModalStore } from '../../store/ui/modal-store';
import { useSettingsStore } from '../../store/ui/settings-store';
import { cn } from '../../utils/cn';
import { IconCheck, IconPlus, IconSearch } from '../common/Icons';
import { TaskItem } from './TaskItem';
import { TaskStats } from './TaskStats';

// --- Sortable Item Wrapper ---
const SortableTaskItem = ({ task, className }: { task: Task; className?: string }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: `${UI_CONFIG.DND.PREFIX_TASK}${task.id || ''}`,
        data: {
            type: 'task',
            task: task // Pass full task object if needed, but type check relies on prefix/data
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        position: 'relative' as const,
    };

    return (
        <div ref={setNodeRef} style={style} className="touch-manipulation">
            <TaskItem
                task={task}
                className={cn(className, isDragging && "opacity-80 shadow-lg border-blue-400 bg-blue-50/50")}
                dragHandleProps={{ ...attributes, ...listeners }}
            />
        </div>
    );
};

export const TaskList: React.FC = () => {
    const { t } = useTranslation();
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
        // Global search mode: ignore current filter context
        if (query && query.trim().length > 0) {
            return {
                keyword: query,
                showCompleted: showCompleted,
                projectId: null,
                labelId: null,
                timeBlockId: null,
                duration: null,
                filterType: 'all_tasks', // Force global context
                savedFilter: null,
                sortCriteria: sortCriteria,
            };
        }

        return {
            keyword: query,
            showCompleted: showCompleted,
            projectId: filterType === 'inbox' ? 'unassigned' : (filterType === 'project' ? targetId : null),
            labelId: filterType === 'label' ? targetId : null,
            timeBlockId: filterType === 'timeblock' ? targetId : null,
            duration: filterType === 'duration' ? targetId : null,
            filterType: filterType,
            savedFilter: null,
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

    // Handle Drag End for Task Reordering (Local) via Monitor
    useDndMonitor({
        onDragEnd: async (event: DragEndEvent) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;

            const activeIdStr = String(active.id);
            const overIdStr = String(over.id);

            // Ensure both are tasks
            if (!activeIdStr.startsWith(UI_CONFIG.DND.PREFIX_TASK) || !overIdStr.startsWith(UI_CONFIG.DND.PREFIX_TASK)) {
                return;
            }

            const activeTaskId = activeIdStr.replace(UI_CONFIG.DND.PREFIX_TASK, '');
            const overTaskId = overIdStr.replace(UI_CONFIG.DND.PREFIX_TASK, '');

            // Only allow reordering if we are in manual sort mode
            if (sortCriteria !== 'manual') return;

            const oldIndex = processedTasks.findIndex(t => t.id === activeTaskId);
            const newIndex = processedTasks.findIndex(t => t.id === overTaskId);

            if (oldIndex !== -1 && newIndex !== -1) {
                // Optimistic UI update could be better handled by a local state or just waiting for store update
                // Here we trigger store update directly
                // Note: Since we don't have local optimistic state here easily without duplicating 'tasks',
                // there might be a slight delay. getProcessedTasks relies on 'tasks' from store.
                // Reordering IDs calculation:
                // We simulate the move on processedTasks to get the new order of IDs
                const reordered = arrayMove(processedTasks, oldIndex, newIndex);
                const orderedIds = reordered.map(t => t.id!).filter(Boolean);
                await reorderTasks(orderedIds);
            }
        }
    });

    // 検索モード時はちらつきを防ぐため、キャッシュがあればローディングを表示しない
    const isSearching = !!(query && query.trim().length > 0);
    const showLoading = loading && !isSearching && tasks.length === 0;

    if (showLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-gray-400 text-sm animate-pulse">{t('task_list.loading')}</div>
            </div>
        );
    }

    const isManualSort = sortCriteria === 'manual';

    return (
        <div className="flex flex-col h-full overflow-hidden relative">
            {/* Task List Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-1 pb-24">
                <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm pt-2 pb-4 mb-4 flex items-center gap-2">
                    <div className="flex-1">
                        {isSearching && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                                <IconSearch className="w-4 h-4" />
                                {t('task_list.searching_results', { query: query || '' })}
                            </div>
                        )}
                    </div>

                    {/* Sort Options */}
                    <div className="flex items-center gap-2 px-1">
                        <select
                            name="sortCriteria"
                            aria-label={t('task_list.sort_options') || "Sort Options"}
                            value={sortCriteria}
                            onChange={(e) => setSortCriteria(e.target.value)}
                            className="text-xs bg-transparent border-none outline-none text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer font-medium focus:ring-0"
                        >
                            <option value="manual" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">{t('task_list.sort_manual')}</option>
                            <option value="createdAt_desc" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">{t('task_list.sort_created')}</option>
                            <option value="dueDate_asc" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">{t('task_list.sort_due')}</option>
                            <option value="important_desc" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">{t('task_list.sort_important')}</option>
                            <option value="title_asc" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">{t('task_list.sort_title')}</option>
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
                        title={showCompleted ? t('task_list.hide_completed') : t('task_list.show_completed')}
                    >
                        {showCompleted ? t('task_list.hide_completed') : t('task_list.show_completed')}
                    </button>
                </div>

                {processedTasks.length === 0 ? (
                    <div className="text-center py-20 flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="relative mb-8">
                            <div className="absolute -inset-4 bg-blue-500/10 dark:bg-blue-400/10 blur-3xl rounded-full" />
                            <div className="relative">
                                <IconCheck className="w-24 h-24 text-blue-200 dark:text-blue-900/50" strokeWidth={1.5} />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{t('task_list.no_tasks_title')}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-8">
                            {showCompleted ? t('task_list.no_tasks_desc_showing') : t('task_list.no_tasks_desc_hiding')}
                        </p>
                        <button
                            onClick={() => openModal('task-detail', { title: '' })}
                            className="btn-premium flex items-center gap-2"
                        >
                            <IconPlus className="w-5 h-5" />
                            {t('task_list.add_new_task')}
                        </button>
                    </div>
                ) : (
                    isManualSort ? (
                        <SortableContext
                            items={processedTasks.map(t => `${UI_CONFIG.DND.PREFIX_TASK}${t.id || ''}`)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className={cn("transition-all duration-200", densityClass)}>
                                {processedTasks.map(task => (
                                    <SortableTaskItem key={task.id} task={task} />
                                ))}
                            </div>
                        </SortableContext>
                    ) : (
                        <ul className={cn("transition-all duration-200", densityClass)}>
                            {processedTasks.map((task: Task) => (
                                <TaskItem key={task.id} task={task} />
                            ))}
                        </ul>
                    )
                )}
            </div>

            {/* Stats Bar (Sticky Bottom Area) */}
            <div className="flex-none mt-auto pt-2 border-t border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
                <TaskStats tasks={processedTasks} timeBlockId={config.timeBlockId} />
            </div>
        </div>
    );
};



