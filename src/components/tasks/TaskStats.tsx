import React from 'react';
import { useTimeBlocks } from '../../hooks/useTimeBlocks';
import { Task } from '../../store/schema';
import { cn } from '../../utils/cn';

interface TaskStatsProps {
    tasks: Task[];
    timeBlockId: string | null;
}

export const TaskStats: React.FC<TaskStatsProps> = ({ tasks, timeBlockId }) => {
    const { timeBlocks } = useTimeBlocks();

    // Calculate total duration in minutes
    const totalTaskMinutes = tasks.reduce((sum, task) => {
        const duration = task.duration || 0;
        return sum + Number(duration);
    }, 0);

    const formatTime = (mins: number) => (mins / 60).toFixed(2) + 'h';

    // A. TimeBlock Mode
    const timeBlock = timeBlockId ? timeBlocks.find(tb => tb.id === timeBlockId) : null;

    if (timeBlock && timeBlock.start && timeBlock.end) {
        const calculateMinutes = (start: string, end: string): number => {
            const [startH, startM] = start.split(':').map(Number);
            const [endH, endM] = end.split(':').map(Number);
            let startMinutes = startH * 60 + startM;
            let endMinutes = endH * 60 + endM;
            if (endMinutes < startMinutes) endMinutes += 24 * 60;
            return endMinutes - startMinutes;
        };

        const capacityMinutes = calculateMinutes(timeBlock.start, timeBlock.end);
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
            <div className="mt-2 mb-2 py-2 px-4 bg-gray-50/80 dark:bg-[#1e1e1e]/50 rounded-lg flex items-center gap-4 text-sm border border-gray-100 dark:border-gray-800/50 backdrop-blur-sm">
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
                        ({isOver ? '超過' : '残り'} {absDiffHours}h)
                    </div>
                </div>
            </div>
        );
    }

    // B. General Mode
    const count = tasks.length;
    const avgMinutes = count > 0 ? (totalTaskMinutes / count) : 0;

    return (
        <div className="mt-2 mb-2 py-2 px-4 bg-gray-50/80 dark:bg-[#1e1e1e]/50 rounded-lg flex items-center justify-evenly text-sm border border-gray-100 dark:border-gray-800/50 backdrop-blur-sm">
            <div className="flex flex-row items-baseline gap-2">
                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">COUNT</span>
                <span className="font-bold text-sm text-gray-700 dark:text-gray-200">{count}<span className="text-xs font-normal ml-0.5 text-gray-400">件</span></span>
            </div>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex flex-row items-baseline gap-2">
                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">TOTAL</span>
                <span className="font-bold text-sm text-gray-700 dark:text-gray-200 text-blue-600 dark:text-blue-400">{formatTime(totalTaskMinutes)}</span>
            </div>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex flex-row items-baseline gap-2">
                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">AVG</span>
                <span className="font-medium text-sm">{formatTime(avgMinutes)}<span className="text-xs ml-0.5">/件</span></span>
            </div>
        </div>
    );
};
