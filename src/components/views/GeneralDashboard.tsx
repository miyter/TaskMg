import React from 'react';
import { useTranslation } from '../../core/translations';
import { useTaskCounts } from '../../hooks/useTaskCounts';
import { useTasks } from '../../hooks/useTasks';
import { useTimeBlocks } from '../../hooks/useTimeBlocks';
import { useSettingsStore } from '../../store/ui/settings-store';
import { IconCalendar, IconCalendarDays, IconInbox, IconStar } from '../common/Icons';
import { TaskStats } from '../tasks/TaskStats';

export const GeneralDashboard: React.FC = () => {
    const { t } = useTranslation();
    const { tasks } = useTasks();
    const { timeBlocks } = useTimeBlocks();
    const counts = useTaskCounts();
    const { density } = useSettingsStore();

    // Calculate completion rate
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const cards = [
        { id: 'inbox', label: t('inbox'), count: counts.inbox, icon: IconInbox, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { id: 'today', label: t('today'), count: counts.today, icon: IconCalendar, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
        { id: 'upcoming', label: t('upcoming'), count: counts.upcoming, icon: IconCalendarDays, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        { id: 'important', label: t('important'), count: counts.important, icon: IconStar, color: 'text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    ];

    return (
        <div className="h-full overflow-y-auto custom-scrollbar p-6 space-y-8">
            <header className="mb-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('dashboard')}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {t('task_list.sort_manual')} {/* Placeholder for a subtitle if needed */}
                </p>
            </header>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cards.map(card => (
                    <div key={card.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{card.label}</p>
                            <p className="text-2xl font-black text-gray-800 dark:text-gray-100 tabular-nums">{card.count}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${card.bg}`}>
                            <card.icon className={`w-6 h-6 ${card.color}`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Overall Stats (General Mode) */}
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('general_dashboard.overall_stats')}</h2>
                <TaskStats tasks={tasks.filter(t => t.status !== 'completed')} timeBlockId={null} />
            </div>

            {/* TimeBlock Usage */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{t('general_dashboard.time_block_usage')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {timeBlocks.map(tb => {
                        // Filter tasks for this timeblock
                        const tbTasks = tasks.filter(t => t.timeBlockId === tb.id && t.status !== 'completed');
                        if (tbTasks.length === 0) return null; // Skip empty blocks for cleaner view? Or show empty?

                        return (
                            <div key={tb.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm">
                                <TaskStats tasks={tbTasks} timeBlockId={tb.id || null} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
