import React, { useState } from 'react';
import { useTranslation } from '../../core/translations';
import { UI_CONFIG } from '../../core/ui-constants';
import { useProjects } from '../../hooks/useProjects';
import { useTimeBlocks } from '../../hooks/useTimeBlocks';
import { deleteTask, toggleTaskStatus, updateTask } from '../../store';
import { Task } from '../../store/schema';
import { useModalStore } from '../../store/ui/modal-store';
import { cn } from '../../utils/cn';
import { formatDateCompact, getTaskDateColor } from '../../utils/date';
import { stripHtml } from '../../utils/text';
import { IconCalendar, IconCheck, IconClock, IconEdit, IconGripVertical, IconRepeat, IconTrash } from '../common/Icons';
import { ContextMenu, ContextMenuItem, ContextMenuSub } from '../ui/ContextMenu';

interface TaskItemProps {
    task: Task;
    style?: React.CSSProperties;
    className?: string;
    dragHandleProps?: any;
}

export const TaskItem = React.memo<TaskItemProps>(({ task, style, className, dragHandleProps }) => {
    const { t } = useTranslation();
    const isCompleted = task.status === 'completed';
    const { openModal } = useModalStore();
    const { projects } = useProjects();
    const { timeBlocks } = useTimeBlocks();

    const [menuPosition, setMenuPosition] = useState<{ x: number, y: number } | null>(null);

    const handleToggle = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (task.id) {
            await toggleTaskStatus(task.id, task.status || 'todo');
        }
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setMenuPosition({ x: e.clientX, y: e.clientY });
    };

    const handleEdit = () => {
        setMenuPosition(null);
        openModal('task-detail', task);
    };

    const handleDelete = () => {
        setMenuPosition(null);
        openModal('confirmation', {
            title: t('delete'),
            message: `${t('task')}: ${task.title}\n${t('msg.confirm_delete')}`,
            confirmLabel: t('delete'),
            variant: 'danger',
            onConfirm: async () => {
                if (task.id) {
                    await deleteTask(task.id);
                }
            }
        });
    };

    const handleDateChange = async (type: 'today' | 'tomorrow' | 'next_week' | 'no_date') => {
        setMenuPosition(null);
        if (!task.id) return;

        let newDate: Date | null = null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (type) {
            case 'today':
                newDate = new Date(); // Keep current time or set to end of day? Usually start of day or specific time. Using current time for now or just date component.
                break;
            case 'tomorrow':
                newDate = new Date(today);
                newDate.setDate(today.getDate() + 1);
                break;
            case 'next_week':
                newDate = new Date(today);
                newDate.setDate(today.getDate() + 7);
                break;
            case 'no_date':
                newDate = null;
                break;
        }

        await updateTask(task.id, { dueDate: newDate });
    };

    // Meta Data Logic
    const project = task.projectId ? projects.find(p => p.id === task.projectId) : null;
    const timeBlock = task.timeBlockId ? timeBlocks.find(tb => tb.id === task.timeBlockId) : null;

    // Determine Date/Recurrence Display
    const hasRecurrence = !!(task.recurrence && task.recurrence.type !== 'none');
    const hasDate = !!task.dueDate;

    return (
        <>
            <li
                style={style}
                onClick={() => openModal('task-detail', task)}
                onContextMenu={handleContextMenu}
                className={cn(
                    "group flex items-center gap-3 p-[var(--task-p)] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-xl hover:shadow-sm hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200 cursor-default hover-lift",
                    className
                )}
            >
                {/* Drag Handle */}
                {/* Only show if dragHandleProps exists (Manual Sort Mode) */}
                {dragHandleProps && (
                    <div
                        {...dragHandleProps}
                        className="cursor-move text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 p-1 -ml-1 flex-shrink-0 touch-none"
                    >
                        <IconGripVertical className="w-4 h-4" />
                    </div>
                )}

                {/* Checkbox */}
                <button
                    onClick={handleToggle}
                    className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 cursor-pointer", // explicit cursor pointer
                        isCompleted
                            ? "bg-blue-500 border-blue-500 text-white"
                            : "border-gray-300 dark:border-gray-600 hover:border-blue-400 text-transparent"
                    )}
                    aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
                >
                    <IconCheck className="w-3 h-3" strokeWidth={3} />
                </button>

                {/* Title & Description */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className={cn("text-sm text-gray-800 dark:text-gray-200 break-words", isCompleted && "line-through text-gray-400 dark:text-gray-500")}>
                        {task.title}
                    </div>
                    {task.description && (
                        <div className="text-xs text-gray-500 line-clamp-1 truncate">
                            {stripHtml(task.description)}
                        </div>
                    )}
                </div>

                {/* Meta Info (Right Side) */}
                <div className="hidden sm:grid grid-cols-[90px_110px_50px_80px] gap-2 text-xs shrink-0 items-center">
                    {/* Project */}
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 overflow-hidden">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: project?.color || UI_CONFIG.DEFAULT_COLORS.PROJECT_INACTIVE }} />
                        <span className="truncate">
                            {project ? project.name : "PJなし"}
                        </span>
                    </div>

                    {/* TimeBlock */}
                    <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500 overflow-hidden">
                        {timeBlock ? (
                            <>
                                <IconClock className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">
                                    {timeBlock.name}
                                </span>
                            </>
                        ) : (
                            <span className="text-[10px] text-gray-300 dark:text-gray-600 truncate">時間帯なし</span>
                        )}
                    </div>

                    {/* Duration */}
                    <div className="text-gray-400 dark:text-gray-500 tabular-nums text-right overflow-hidden">
                        {task.duration ? `${task.duration}m` : ''}
                    </div>

                    {/* Date / Recurrence */}
                    <div className={cn(
                        "flex items-center justify-end gap-1 overflow-hidden",
                        (hasRecurrence || hasDate)
                            ? (isCompleted ? "text-gray-400" : getTaskDateColor(task.dueDate || null))
                            : "text-gray-400 dark:text-gray-500 opacity-50"
                    )}>
                        {hasRecurrence ? (
                            <>
                                <IconRepeat className="w-3.5 h-3.5 shrink-0" />
                                {task.dueDate && (
                                    <span className="truncate">{formatDateCompact(task.dueDate)}</span>
                                )}
                            </>
                        ) : hasDate ? (
                            <>
                                <IconCalendar className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{formatDateCompact(task.dueDate!)}</span>
                            </>
                        ) : (
                            <span className="text-[10px] uppercase font-bold tracking-widest">{t('no_date')}</span>
                        )}
                    </div>
                </div>
            </li>

            {/* Context Menu */}
            {menuPosition && (
                <ContextMenu x={menuPosition.x} y={menuPosition.y} onClose={() => setMenuPosition(null)}>
                    <ContextMenuSub label={t('date_change') || "日付変更"} icon={<IconCalendar />}>
                        <ContextMenuItem onClick={() => handleDateChange('today')}>{t('today')}</ContextMenuItem>
                        <ContextMenuItem onClick={() => handleDateChange('tomorrow')}>{t('tomorrow')}</ContextMenuItem>
                        <ContextMenuItem onClick={() => handleDateChange('next_week')}>{t('next_week') || "来週"}</ContextMenuItem>
                        <ContextMenuItem onClick={() => handleDateChange('no_date')}>{t('no_date') || "期限なし"}</ContextMenuItem>
                    </ContextMenuSub>
                    <ContextMenuItem onClick={handleEdit} icon={<IconEdit />}>
                        {t('edit')}
                    </ContextMenuItem>
                    <ContextMenuItem onClick={handleDelete} variant="danger" icon={<IconTrash />}>
                        {t('delete')}
                    </ContextMenuItem>
                </ContextMenu>
            )}
        </>
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
        prev.task.projectId === next.task.projectId &&
        prev.task.timeBlockId === next.task.timeBlockId &&
        prev.task.duration === next.task.duration && // Added check for duration
        prev.task.recurrence === next.task.recurrence &&
        isDateEqual(prev.task.dueDate, next.task.dueDate)
    );
});
