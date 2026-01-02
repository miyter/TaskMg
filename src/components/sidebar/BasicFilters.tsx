import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import { getTranslator } from '../../core/translations';
import { useTaskCounts } from '../../hooks/useTaskCounts';
import { FilterType, useFilterStore } from '../../store/ui/filter-store';
import { useSettingsStore } from '../../store/ui/settings-store';
import { useViewStore } from '../../store/ui/view-store';
import { cn } from '../../utils/cn';
import { getDensityClass } from '../../utils/ui-utils';

const FILTER_ITEMS = [
    { id: 'inbox', i18nKey: 'inbox', icon: '📥', color: 'text-blue-500', droppable: true },
    { id: 'today', i18nKey: 'today', icon: '📅', color: 'text-green-500' },
    { id: 'upcoming', i18nKey: 'upcoming', icon: '🗓️', color: 'text-purple-500' },
    { id: 'important', i18nKey: 'important', icon: '⭐', color: 'text-amber-400' },
    { id: 'custom', i18nKey: 'all_tasks', icon: '📋', color: 'text-gray-500' },
] as const;

export const BasicFilters: React.FC = () => {
    const { language } = useSettingsStore();
    const { t } = getTranslator(language);
    const counts = useTaskCounts();

    return (
        <ul className="space-y-0.5">
            {FILTER_ITEMS.map(item => (
                <FilterItem
                    key={item.id}
                    item={item as FilterItemType}
                    label={t(item.i18nKey as any)}
                    count={counts[item.id as keyof typeof counts] || 0}
                />
            ))}
        </ul>
    );
};


interface FilterItemType {
    id: FilterType;
    i18nKey: string;
    icon: string;
    color: string;
    droppable?: boolean;
}

const FilterItem: React.FC<{ item: FilterItemType, label: string, count: number }> = ({ item, label, count }) => {
    const { filterType, setFilter } = useFilterStore();
    const { setView } = useViewStore();
    const { density } = useSettingsStore();
    const currentView = useViewStore(s => s.currentView);
    const isActive = currentView === 'tasks' && filterType === item.id;

    const { setNodeRef, isOver } = useDroppable({
        id: `filter:${item.id}`,
        // @ts-ignore
        disabled: !item.droppable,
        data: {
            type: item.id === 'inbox' ? 'inbox' : 'filter',
            value: item.id
        }
    });

    const handleClick = () => {
        if (item.id === 'search') {
            setView('tasks');
            setFilter('search');
        } else {
            setView('tasks');
            setFilter(item.id);
        }
    };

    return (
        <li ref={setNodeRef}>
            <button
                onClick={handleClick}
                className={cn(
                    "w-full flex items-center px-3 text-sm rounded-md transition-colors text-left gap-3 group/item",
                    getDensityClass(density),
                    isActive
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",
                    isOver && item.droppable && "bg-blue-50 dark:bg-blue-900/30"
                )}
            >
                <span className={item.color}>{item.icon}</span>
                <span className="flex-1">{label}</span>
                {item.id !== 'search' && count > 0 && (
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                        {count}
                    </span>
                )}
            </button>
        </li>
    );
};
