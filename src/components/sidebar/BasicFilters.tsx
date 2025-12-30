import React from 'react';
import { useFilterStore } from '../../store/ui/filter-store';
import { cn } from '../../utils/cn';

const FILTER_ITEMS = [
    { id: 'inbox', name: 'インボックス', icon: '📥', color: 'text-blue-500' },
    { id: 'today', name: '今日', icon: '📅', color: 'text-green-500' },
    { id: 'upcoming', name: '近日中', icon: '🗓️', color: 'text-purple-500' },
    { id: 'important', name: '重要', icon: '⭐', color: 'text-amber-400' },
    { id: 'all', name: 'すべて', icon: '📋', color: 'text-gray-500' },
] as const;

export const BasicFilters: React.FC = () => {
    const { filterType, setFilter } = useFilterStore();

    return (
        <ul className="space-y-0.5">
            {FILTER_ITEMS.map(item => {
                const isActive = filterType === item.id;
                return (
                    <li key={item.id}>
                        <button
                            onClick={() => setFilter(item.id)}
                            className={cn(
                                "w-full flex items-center px-3 py-1.5 text-sm rounded-md transition-colors text-left gap-3",
                                isActive
                                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            )}
                        >
                            <span className={item.color}>{item.icon}</span>
                            <span>{item.name}</span>
                        </button>
                    </li>
                );
            })}
        </ul>
    );
};
