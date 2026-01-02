import React from 'react';
import { getTranslator } from '../../core/translations';
import { useSettingsStore } from '../../store/ui/settings-store';
import { KGIStatus } from './dashboard-types';

interface DashboardHeaderProps {
    kgi: KGIStatus;
    currentTab: string;
    onTabChange: (tab: string) => void;
    collapsed: boolean;
    onToggleCollapse: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = React.memo(({ kgi, currentTab, onTabChange, collapsed, onToggleCollapse }) => {
    const { language } = useSettingsStore();
    const { t } = getTranslator(language);
    const statusColors: Record<string, string> = {
        good: 'text-emerald-500',
        warning: 'text-amber-500',
        danger: 'text-red-500'
    };
    const progressColor: Record<string, string> = {
        good: 'bg-emerald-500',
        warning: 'bg-amber-500',
        danger: 'bg-red-500'
    };

    const statusColor = statusColors[kgi.status] || 'text-gray-500';
    const barColor = progressColor[kgi.status] || 'bg-gray-500';

    const tabs = [
        { id: 'backward', label: t('backward_map'), icon: '🗺️' },
        { id: 'woop', label: t('woop_board'), icon: '✨' },
        { id: 'okr', label: t('okr_tree'), icon: '🎯' }
    ];

    return (
        <div className={`mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 mx-4 mt-4 ${collapsed ? 'py-2' : 'py-4'}`}>
            <div className="px-6 flex items-center justify-between gap-6">
                {/* Title */}
                <div className="flex-1 min-w-0">
                    <h1 className={`font-bold text-gray-900 dark:text-white truncate transition-all duration-300 ${collapsed ? 'text-sm opacity-50' : 'text-base'}`}>
                        {kgi.title}
                    </h1>
                </div>

                {/* Progress Bar (Hidden when collapsed if you want, but sticking to existing logic implies just title shrinkage) */}
                <div className="flex-1 max-w-md hidden sm:block">
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                <div style={{ width: `${kgi.progress}%` }} className={`h-full ${barColor} transition-all duration-1000 ease-out rounded-full`}></div>
                            </div>
                        </div>
                        <span className={`font-black ${statusColor} tabular-nums text-sm whitespace-nowrap`}>
                            {kgi.progress}%
                        </span>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-6 flex-shrink-0">
                    {/* Days Left */}
                    <div className="text-center hidden sm:block">
                        <div className="text-xs text-gray-500 dark:text-gray-400">{t('target_dashboard.days_left')}</div>
                        <div className={`font-black ${statusColor} tabular-nums`}>
                            {kgi.daysLeft}<span className="text-xs font-medium ml-0.5 text-gray-400">{t('target_dashboard.days_unit')}</span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 bg-gray-100 dark:bg-gray-900/50 p-1 rounded-lg">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`group px-3 py-1.5 rounded-md text-xs font-bold transition-all flex flex-col sm:flex-row items-center gap-1 sm:gap-2 ${currentTab === tab.id
                                    ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                title={tab.label}
                            >
                                <span className="text-sm sm:text-base leading-none">{tab.icon}</span>
                                <span className="text-[10px] sm:text-xs leading-none">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Toggle */}
                    <button
                        onClick={onToggleCollapse}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title={collapsed ? t('target_dashboard.header_expand') : t('target_dashboard.header_collapse')}
                    >
                        <svg
                            className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
});
