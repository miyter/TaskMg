import React from 'react';
import { useFilters } from '../../hooks/useFilters';
import { useTasks } from '../../hooks/useTasks';
import { getProcessedTasks } from '../../logic/search';
import { useFilterStore } from '../../store/ui/filter-store';
import { SidebarItem } from './SidebarItem';

export const CustomFilterList: React.FC = () => {
    const { filters, loading } = useFilters();
    const { tasks } = useTasks();

    if (loading) return null;

    return (
        <div className="space-y-0.5 py-1">
            {filters.map(filter => (
                <CustomFilterItem key={filter.id} filter={filter} tasks={tasks} />
            ))}
        </div>
    );
};

const CustomFilterItem: React.FC<{ filter: any, tasks: any[] }> = ({ filter, tasks }) => {
    const { filterType, targetId, setFilter } = useFilterStore();
    const isActive = filterType === 'custom' && targetId === filter.id;

    // 件数計算 (logic/search の getProcessedTasks を使用)
    let count = 0;
    try {
        const results = getProcessedTasks(tasks, { savedFilter: filter, showCompleted: false });
        count = results.length;
    } catch (e) {
        console.warn('[CustomFilterItem] Count error:', e);
    }

    return (
        <SidebarItem
            label={filter.name}
            icon={<span>🔍</span>}
            count={count}
            isActive={isActive}
            onClick={() => setFilter('custom', filter.id)}
        />
    );
};
