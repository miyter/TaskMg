import React from 'react';
import { useTranslation } from '../../core/translations';
import { useTimeBlocks } from '../../hooks/useTimeBlocks';
import { Task } from '../../store/schema';
import { cn } from '../../utils/cn';
import { calculateDurationMinutes } from '../../utils/date';

interface TaskStatsProps {
    tasks: Task[];
    timeBlockId: string | null;
}

export const TaskStats: React.FC<TaskStatsProps> = ({ tasks, timeBlockId }) => {
    const { t } = useTranslation();
    const { timeBlocks } = useTimeBlocks();

    // Calculate total duration in minutes
    const totalTaskMinutes = tasks.reduce((sum, task) => {
        // Ensure duration is treated as a number, handle potential string values from legacy data
        const rawDuration = task.duration;
        const duration = typeof rawDuration === 'number' ? rawDuration : Number(rawDuration);
        return sum + (isNaN(duration) ? 0 : duration);
    }, 0);

    const formatTime = (mins: number) => (mins / 60).toFixed(2) + 'h';

    // A. TimeBlock Mode
    const timeBlock = timeBlockId ? timeBlocks.find(tb => tb.id === timeBlockId) : null;

    if (timeBlock && timeBlock.start && timeBlock.end) {
        const capacityMinutes = calculateDurationMinutes(timeBlock.start, timeBlock.end);
        if (capacityMinutes <= 0) return null;

        const capacityHours = (capacityMinutes / 60).toFixed(2);
        const totalTaskHours = (totalTaskMinutes / 60).toFixed(2);
        const rawPercent = (totalTaskMinutes / capacityMinutes) * 100;
        const progressPercent = Math.min(rawPercent, 100);

        const diffMinutes = capacityMinutes - totalTaskMinutes;
        const isOver = diffMinutes < 0;
        const absDiffHours = (Math.abs(diffMinutes) / 60).toFixed(2);
        const isExceeded = rawPercent > 100;

        return (
            <div className="glass-card flex items-center gap-4 py-3 px-4 my-2">
                {/* 1. Name */}
                <div className="flex-shrink-0 w-24 truncate text-xs font-bold text-gray-500 dark:text-gray-400" title={timeBlock.name}>
                    {timeBlock.name}
                </div>

                {/* 2. Time */}
                <div className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400 tabular-nums">
                    <span className="font-bold text-gray-700 dark:text-gray-300 w-[4.5ch] text-right inline-block">{totalTaskHours}h</span>
                    <span className="text-gray-400 mx-0.5">/</span>
                    <span className="w-[4.5ch] inline-block">{capacityHours}h</span>
                </div>

                {/* 3. Progress Bar */}
                <div className="flex-1 relative h-3 bg-gray-200 dark:bg-gray-700/50 rounded-full overflow-hidden min-w-[100px]">
                    <div
                        className={cn(
                            "h-full rounded-full transition-all duration-500 ease-out shadow-sm",
                            isExceeded ? "bg-red-500" : "bg-gradient-to-r from-blue-500 to-indigo-600"
                        )}
                        style={{ width: isExceeded ? '100%' : `${progressPercent}%` }}
                    />
                </div>

                {/* 4. Details */}
                <div className="flex-shrink-0 flex items-center justify-end gap-3 min-w-[140px]">
                    <div className={cn(
                        "text-lg font-bold tabular-nums text-right w-[3.5ch]",
                        isExceeded ? "text-red-500" : "text-blue-500"
                    )}>
                        {Math.round(rawPercent)}<span className="text-xs font-normal opacity-70">%</span>
                    </div>
                    <div className={cn("text-xs whitespace-nowrap text-right w-[100px]", isOver ? "text-red-500" : "text-green-500")}>
                        ({isOver ? t('task_stats.over') : t('task_stats.remaining')} {absDiffHours}h)
                    </div>
                </div>
            </div>
        );
    }

    // B. General Mode
    const count = tasks.length;
    const avgMinutes = count > 0 ? (totalTaskMinutes / count) : 0;
    const countUnit = t('task_stats.count_unit');
    const avgUnit = t('task_stats.avg_unit');

    return (
        <div className="glass-card flex items-center justify-evenly py-3 px-4 my-2">
            <div className="flex flex-row items-baseline gap-2">
                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">{t('task_stats.count_label')}</span>
                <span className="font-bold text-sm text-gray-700 dark:text-gray-200">{count}{countUnit && <span className="text-xs font-normal ml-0.5 text-gray-400">{countUnit}</span>}</span>
            </div>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex flex-row items-baseline gap-2">
                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">{t('task_stats.total_label')}</span>
                <span className="font-bold text-sm text-gray-700 dark:text-gray-200 text-blue-600 dark:text-blue-400">{formatTime(totalTaskMinutes)}</span>
            </div>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex flex-row items-baseline gap-2">
                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">{t('task_stats.avg_label')}</span>
                <span className="font-medium text-sm">{formatTime(avgMinutes)}<span className="text-xs ml-0.5">{avgUnit}</span></span>
            </div>
        </div>
    );
};

