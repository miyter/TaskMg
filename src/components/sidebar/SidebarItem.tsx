import React from 'react';
import { useSettingsStore } from '../../store/ui/settings-store';
import { cn } from '../../utils/cn';
import { getDensityClass } from '../../utils/ui-utils';

interface SidebarItemProps {
    icon?: React.ReactNode;
    label: string;
    count?: number;
    isActive?: boolean;
    isOver?: boolean;
    onClick?: () => void;
    onContextMenu?: (e: React.MouseEvent) => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
    icon,
    label,
    count,
    isActive,
    isOver,
    onClick,
    onContextMenu
}) => {
    const { density } = useSettingsStore();

    return (
        <div
            onClick={onClick}
            onContextMenu={onContextMenu}
            className={cn(
                "group flex items-center justify-between px-2 ml-1 rounded-md cursor-pointer transition-colors select-none",
                getDensityClass(density), // Dynamic padding based on density
                isActive
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200",
                isOver && "ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-900/50"
            )}
        >
            <div className="flex items-center gap-2 flex-1 min-w-0">
                {icon && <span className="flex-shrink-0 w-5 flex justify-center text-sm">{icon}</span>}
                <span className="text-sm truncate">{label}</span>
            </div>
            {count !== undefined && count > 0 && (
                <span className="text-gray-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700/50">
                    {count}
                </span>
            )}
        </div>
    );
};
