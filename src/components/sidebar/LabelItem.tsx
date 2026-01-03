import React from 'react';
import { Label } from '../../store/schema';
import { useFilterStore } from '../../store/ui/filter-store';
import { useSettingsStore } from '../../store/ui/settings-store';
import { useViewStore } from '../../store/ui/view-store';
import { cn } from '../../utils/cn';
import { getDensityClass } from '../../utils/ui-utils';

interface LabelItemProps {
    label: Label;
}

export const LabelItem = React.memo<LabelItemProps>(({ label }) => {
    const { filterType, targetId, setFilter } = useFilterStore();
    const { density } = useSettingsStore();
    const { setView } = useViewStore();

    const isActive = filterType === 'label' && targetId === label.id;

    const handleClick = () => {
        setFilter('label', label.id);
        setView('tasks');
    };

    return (
        <li>
            <button
                onClick={handleClick}
                className={cn(
                    "w-full flex items-center px-2 py-1.5 text-sm rounded-md transition-colors text-left gap-2 group", // Changed px-3 to px-2 for better mobile fit
                    getDensityClass(density), // Use density utils
                    isActive
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Label: ${label.name}`}
            >
                <span
                    className={cn(
                        "w-3 h-3 rounded-full transition-all",
                        isActive ? "opacity-100 scale-110 shadow-sm" : "opacity-75 group-hover:opacity-100"
                    )}
                    style={{ backgroundColor: label.color || '#9ca3af' }}
                ></span>
                <span className="truncate">{label.name}</span>
            </button>
        </li>
    );
});
