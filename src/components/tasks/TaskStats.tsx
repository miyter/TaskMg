import React from 'react';
import { useTranslation } from '../../core/translations';
import { useTimeBlocks } from '../../hooks/useTimeBlocks';
import { Task } from '../../store/schema';
import { cn } from '../../utils/cn';
import { calculateDurationMinutes } from '../../utils/date-tz';

interface TaskStatsProps {
    tasks: Task[];
    timeBlockId: string | null;
}

export const TaskStats: React.FC<TaskStatsProps> = ({ tasks, timeBlockId }) => {
    const { t, formatNumber } = useTranslation();
    const { timeBlocks } = useTimeBlocks();

    // Calculate total duration in minutes
    const totalTaskMinutes = tasks.reduce((sum, task) => {
        // Ensure duration is treated as a number, handle potential string values from legacy data
        const rawDuration = task.duration;
        const duration = typeof rawDuration === 'number' ? rawDuration : Number(rawDuration);
        return sum + (isNaN(duration) ? 0 : duration);
    }, 0);

    const formatTime = (mins: number) => formatNumber(mins / 60, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + 'h';

    // A. TimeBlock Mode
    const timeBlock = timeBlockId ? timeBlocks.find(tb => tb.id === timeBlockId) : null;

    if (timeBlock && timeBlock.start && timeBlock.end) {
        const capacityMinutes = calculateDurationMinutes(timeBlock.start, timeBlock.end);
        if (capacityMinutes <= 0) return null;

        const capacityHours = formatNumber(capacityMinutes / 60, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const totalTaskHours = formatNumber(totalTaskMinutes / 60, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const rawPercent = (totalTaskMinutes / capacityMinutes) * 100;
        const progressPercent = Math.min(rawPercent, 100);

        const diffMinutes = capacityMinutes - totalTaskMinutes;
        const isOver = diffMinutes < 0;
        const absDiffHours = formatNumber(Math.abs(diffMinutes) / 60, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const isExceeded = rawPercent > 100;

        return (
            <div className="flex items-center gap-3 py-2 px-3 my-1 border border-gray-100 dark:border-gray-800 rounded-lg bg-gray-50/30 dark:bg-gray-800/20">
                {/* 1. Name - Smaller width */}
                <div className="flex-shrink-0 w-20 truncate text-[10px] font-bold text-gray-400 uppercase tracking-tight" title={timeBlock.name}>
                    {timeBlock.name}
                </div>

                {/* 2. Time - Compact */}
                <div className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400 tabular-nums min-w-[70px]">
                    <span className="font-bold text-gray-700 dark:text-gray-300">{totalTaskHours}h</span>
                    <span className="text-gray-400 mx-0.5">/</span>
                    <span>{capacityHours}h</span>
                </div>

                {/* 3. Progress Bar - Stretches */}
                <div className="flex-1 relative h-2 bg-gray-200 dark:bg-gray-700/50 rounded-full overflow-hidden min-w-[60px]">
                    <div
                        className={cn(
                            "h-full rounded-full transition-all duration-500 ease-out",
                            isExceeded ? "bg-red-500" : "bg-blue-500"
                        )}
                        style={{ width: isExceeded ? '100%' : `${progressPercent}%` }}
                    />
                </div>

                {/* 4. Details - Responsive width */}
                <div className="flex-shrink-0 flex items-center gap-2 tabular-nums">
                    <span className={cn(
                        "text-xs font-bold w-[4ch] text-right",
                        isExceeded ? "text-red-500 dark:text-red-400" : "text-blue-500 dark:text-blue-400"
                    )}>
                        {Math.round(rawPercent)}%
                    </span>
                    <span className={cn("text-[10px] hidden sm:inline", isOver ? "text-red-400 dark:text-red-300" : "text-gray-400 dark:text-gray-500")}>
                        ({isOver ? '+' : '-'}{absDiffHours}h)
                    </span>
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
                <span className="font-bold text-sm text-gray-700 dark:text-gray-200">{formatNumber(count)}{countUnit && <span className="text-xs font-normal ml-0.5 text-gray-400">{countUnit}</span>}</span>
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




