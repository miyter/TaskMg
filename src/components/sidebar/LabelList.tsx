import React from 'react';
import { useLabels } from '../../hooks/useLabels';
import { useFilterStore } from '../../store/ui/filter-store';
import { cn } from '../../utils/cn';

import { SidebarLoadingState } from '../common/SidebarLoadingState';

export const LabelList: React.FC = () => {
    const { labels, loading } = useLabels();
    const { filterType, targetId, setFilter } = useFilterStore();

    if (loading) return <SidebarLoadingState />;
    if (labels.length === 0) return <div className="px-4 py-2 text-xs text-gray-400">ラベルはありません</div>;

    return (
        <ul className="space-y-0.5">
            {labels.map(label => {
                const isActive = filterType === 'label' && targetId === label.id;
                return (
                    <li key={label.id}>
                        <button
                            onClick={() => setFilter('label', label.id)}
                            className={cn(
                                "w-full flex items-center px-3 py-1.5 text-sm rounded-md transition-colors text-left gap-2 group",
                                isActive
                                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            )}
                        >
                            <span
                                className="w-3 h-3 rounded-full opacity-75 group-hover:opacity-100"
                                style={{ backgroundColor: label.color || '#9ca3af' }}
                            ></span>
                            <span className="truncate">{label.name}</span>
                        </button>
                    </li>
                );
            })}
        </ul>
    );
};
