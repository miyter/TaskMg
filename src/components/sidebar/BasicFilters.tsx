import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useFilterStore } from '../../store/ui/filter-store';
import { cn } from '../../utils/cn';

const FILTER_ITEMS = [
    { id: 'inbox', name: 'インボックス', icon: '📥', color: 'text-blue-500', droppable: true },
    { id: 'search', name: '検索', icon: '🔍', color: 'text-gray-500' },
    { id: 'today', name: '今日', icon: '📅', color: 'text-green-500' },
    { id: 'upcoming', name: '近日中', icon: '🗓️', color: 'text-purple-500' },
    { id: 'important', name: '重要', icon: '⭐', color: 'text-amber-400' },
    { id: 'all', name: 'すべて', icon: '📋', color: 'text-gray-500' },
] as const;

export const BasicFilters: React.FC = () => {
    const { tasks } = useTasks();

    return (
        <ul className="space-y-0.5">
            {FILTER_ITEMS.map(item => (
                <FilterItem key={item.id} item={item} tasks={tasks} />
            ))}
        </ul>
    );
};

import { useSettingsStore } from '../../store/ui/settings-store';
import { getDensityClass } from '../../utils/ui-utils';

import { useViewStore } from '../../store/ui/view-store';

const FilterItem: React.FC<{ item: typeof FILTER_ITEMS[number], tasks: any[] }> = ({ item, tasks }) => {
    const { filterType, setFilter } = useFilterStore();
    const { currentView, setView } = useViewStore();
    const { density } = useSettingsStore();
    const isActive = currentView === 'tasks' && filterType === item.id;

    // 件数計算
    const count = tasks.filter(t => {
        if (t.status === 'completed') return false;
        if (item.id === 'all') return true;
        if (item.id === 'inbox') return !t.projectId || String(t.projectId) === 'unassigned' || t.projectId === 'none';
        if (item.id === 'important') return !!t.isImportant;
        // today/upcoming は日付ロジックが必要だが、ここでは簡易化
        return false;
    }).length;

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
        setView('tasks');
        setFilter(item.id);
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
                    // @ts-ignore
                    isOver && item.droppable && "ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-900/50"
                )}
            >
                <span className={item.color}>{item.icon}</span>
                <span className="flex-1">{item.name}</span>
                {count > 0 && (
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                        {count}
                    </span>
                )}
            </button>
        </li>
    );
};
