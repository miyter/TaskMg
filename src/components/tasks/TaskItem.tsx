import { useDraggable } from '@dnd-kit/core';
import React from 'react';
import { toggleTaskStatus, updateTask } from '../../store';
import { Task } from '../../store/schema';
import { useModalStore } from '../../store/ui/modal-store';
import { cn } from '../../utils/cn';
import { formatDateCompact, getTaskDateColor } from '../../utils/date';

interface TaskItemProps {
    task: Task;
}

export const TaskItem = React.memo<TaskItemProps>(({ task }) => {
    const isCompleted = task.status === 'completed';
    const isImportant = !!task.isImportant;
    const { openModal } = useModalStore();

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `task:${task.id}`,
        data: { task }
    });

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

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
    } : undefined;

    return (
        <li
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClick={() => openModal('task-detail', task)}
            className={cn(
                "group flex items-start gap-3 p-[var(--task-p)] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-xl hover:shadow-sm hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200 cursor-pointer hover-lift",
                isDragging && "opacity-70 border-blue-500 shadow-lg"
            )}
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
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
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
                    <svg className="w-4 h-4" fill={isImportant ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                    </svg>
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
