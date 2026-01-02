import React from 'react';
import { toggleTaskStatus, updateTask } from '../../store';
import { Task } from '../../store/schema';
import { useModalStore } from '../../store/ui/modal-store';
import { cn } from '../../utils/cn';
import { formatDateCompact, getTaskDateColor } from '../../utils/date';
import { IconCheck, IconStar } from '../common/Icons';

interface TaskItemProps {
    task: Task;
    style?: React.CSSProperties;
    className?: string;
    dragHandleProps?: any;
}

export const TaskItem = React.memo<TaskItemProps>(({ task, style, className, dragHandleProps }) => {
    const isCompleted = task.status === 'completed';
    const isImportant = !!task.isImportant;
    const { openModal } = useModalStore();

    const handleToggle = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (task.id) {
            await toggleTaskStatus(task.id, task.status || 'todo');
        }
    };

    const handleToggleImportant = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (task.id) {
            await updateTask(task.id, { isImportant: !isImportant });
        }
    };

    return (
        <li
            style={style}
            onClick={() => openModal('task-detail', task)}
            className={cn(
                "group flex items-start gap-3 p-[var(--task-p)] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-xl hover:shadow-sm hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200 cursor-pointer hover-lift",
                className
            )}
            {...dragHandleProps}
        >
            {/* Checkbox */}
            <button
                onClick={handleToggle}
                className={cn(
                    "mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0",
                    isCompleted
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "border-gray-300 dark:border-gray-600 hover:border-blue-400 text-transparent"
                )}
                aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
            >
                <IconCheck className="w-3 h-3" strokeWidth={3} />
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className={cn("text-sm text-gray-800 dark:text-gray-200 break-words", isCompleted && "line-through text-gray-400 dark:text-gray-500")}>
                    {task.title}
                </div>
                {task.description && (
                    <div
                        className="text-xs text-gray-500 mt-1 line-clamp-[var(--task-line-clamp)]"
                    >
                        {task.description}
                    </div>
                )}
                <div className="flex items-center gap-3 mt-2">
                    {task.dueDate && (
                        <span className={cn("text-xs flex items-center gap-1", isCompleted ? "text-gray-400" : getTaskDateColor(task.dueDate))}>
                            📅 {formatDateCompact(task.dueDate)}
                        </span>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className={cn(
                "flex items-center gap-1 transition-opacity",
                isImportant ? "opacity-100" : "opacity-30 group-hover:opacity-100"
            )}>
                <button
                    onClick={handleToggleImportant}
                    className={cn(
                        "p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                        isImportant ? "text-yellow-500" : "text-gray-400"
                    )}
                    title={isImportant ? "重要度を解除" : "重要としてマーク"}
                >
                    <IconStar className="w-4 h-4" fill={isImportant ? "currentColor" : "none"} />
                </button>
            </div>
        </li>
    );
}, (prev, next) => {
    // 日付比較: Timestamp/Date混在に対応するためgetTime()で統一比較
    const getDateMs = (d: any): number | null => {
        if (!d) return null;
        if (d instanceof Date) return d.getTime();
        if (typeof d.toDate === 'function') return d.toDate().getTime(); // Firestore Timestamp
        if (typeof d.getTime === 'function') return d.getTime();
        return null;
    };

    const isDateEqual = (d1: any, d2: any) => {
        const t1 = getDateMs(d1);
        const t2 = getDateMs(d2);
        return t1 === t2;
    };

    return (
        prev.task.id === next.task.id &&
        prev.task.status === next.task.status &&
        prev.task.title === next.task.title &&
        prev.task.description === next.task.description &&
        prev.task.isImportant === next.task.isImportant &&
        isDateEqual(prev.task.dueDate, next.task.dueDate)
    );
});
