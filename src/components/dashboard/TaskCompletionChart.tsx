import {
    endOfDay,
    endOfMonth,
    endOfQuarter,
    endOfWeek,
    format,
    startOfDay,
    startOfMonth,
    startOfQuarter,
    startOfWeek,
    subDays,
    subMonths,
    subQuarters,
    subWeeks
} from 'date-fns';
import { ja } from 'date-fns/locale';
import React, { useMemo, useState } from 'react';
import { useTranslation } from '../../core/translations';
import { Task } from '../../store/schema';
import { cn } from '../../utils/cn';
import { ensureDate } from '../../utils/date-tz';
import { Select } from '../ui/Select';

type Period = 'day' | 'week' | 'month' | 'quarter';

interface TaskCompletionChartProps {
    tasks: Task[];
}

export const TaskCompletionChart: React.FC<TaskCompletionChartProps> = ({ tasks }) => {
    const { t } = useTranslation();
    const [period, setPeriod] = useState<Period>('day');


    const completedTasks = useMemo(() => tasks.filter(task => task.status === 'completed' && task.completedAt), [tasks]);

    const data = useMemo(() => {
        const now = new Date();
        const stats: { label: string; count: number; date: Date }[] = [];

        // Generate last 4 periods
        for (let i = 3; i >= 0; i--) {
            let start: Date, end: Date, label: string;
            const targetDate = period === 'day' ? subDays(now, i) :
                period === 'week' ? subWeeks(now, i) :
                    period === 'month' ? subMonths(now, i) :
                        subQuarters(now, i);

            if (period === 'day') {
                start = startOfDay(targetDate);
                end = endOfDay(targetDate);
                label = format(start, 'M/d', { locale: ja });
            } else if (period === 'week') {
                start = startOfWeek(targetDate, { weekStartsOn: 1 });
                end = endOfWeek(targetDate, { weekStartsOn: 1 });
                label = `${format(start, 'M/d', { locale: ja })}~`;
            } else if (period === 'month') {
                start = startOfMonth(targetDate);
                end = endOfMonth(targetDate);
                label = format(start, 'M月', { locale: ja });
            } else { // quarter
                start = startOfQuarter(targetDate);
                end = endOfQuarter(targetDate);
                label = `Q${Math.floor(start.getMonth() / 3) + 1}`;
            }

            const count = completedTasks.filter(task => {
                const d = ensureDate(task.completedAt);
                return d && d >= start && d <= end;
            }).length;

            stats.push({ label, count, date: start });
        }

        return stats;
    }, [completedTasks, period]);

    const maxCount = Math.max(...data.map(d => d.count), 1); // Avoid div by zero

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span>📊</span> {t('general_dashboard.completion_chart') || 'Completion Stats'}
                </h3>
                <Select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as Period)}
                    className="w-24 text-xs h-7 py-0"
                    options={[
                        { value: 'day', label: t('date_options.day') || 'Day' },
                        { value: 'week', label: t('date_options.week') || 'Week' },
                        { value: 'month', label: t('date_options.month') || 'Month' },
                        { value: 'quarter', label: t('date_options.quarter') || 'Quarter' },
                    ]}
                />
            </div>

            <div className="flex items-end justify-between h-32 gap-2 pt-2 pb-1">
                {data.map((item, index) => {
                    const heightPercent = Math.round((item.count / maxCount) * 100);
                    return (
                        <div key={index} className="flex flex-col items-center flex-1 gap-2 group">
                            <div className="relative w-full flex justify-center items-end h-full">
                                <div
                                    className={cn(
                                        "w-full max-w-[20px] rounded-t-sm transition-all duration-500 ease-out",
                                        "bg-blue-200 dark:bg-blue-900/40 group-hover:bg-blue-400 dark:group-hover:bg-blue-700",
                                        index === 3 && "bg-blue-500 dark:bg-blue-600" // Highlight current
                                    )}
                                    style={{ height: `${heightPercent}%` }}
                                >
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-0.5 px-1.5 rounded pointer-events-none transition-opacity font-mono">
                                        {item.count}
                                    </div>
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium truncate w-full text-center">
                                {item.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
