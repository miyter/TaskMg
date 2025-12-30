import React from 'react';
import { Task } from '../../store/schema';
import { toggleTaskStatus } from '../../store/store';
import { useModalStore } from '../../store/ui/modal-store';
import { cn } from '../../utils/cn';

interface TaskItemProps {
    task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
    const isCompleted = task.status === 'completed';
    const { openModal } = useModalStore();

    const handleToggle = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (task.id) {
            await toggleTaskStatus(task.id, task.status || 'todo');
        }
    };

    return (
        <li
            onClick={() => openModal('task-detail', task)}
            className="group flex items-start gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-xl hover:shadow-sm hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200 cursor-pointer"
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
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {task.description}
                    </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                    {task.dueDate && (
                        <span className={cn("text-xs flex items-center gap-1", isCompleted ? "text-gray-400" : "text-red-500")}>
                            📅 {typeof task.dueDate === 'string' ? task.dueDate : 'Date'}
                        </span>
                    )}
                </div>
            </div>
        </li>
    );
};
