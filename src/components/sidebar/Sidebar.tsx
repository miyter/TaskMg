import React from 'react';
import { useUIStore } from '../../store/ui/ui-store';
import { cn } from '../../utils/cn'; // Utility needed

interface SidebarProps {
    children?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ children }) => {
    const { sidebarWidth, isSidebarOpen, sidebarDensity } = useUIStore();

    // Map density to padding
    const densityClass = {
        compact: 'p-1',
        normal: 'p-2',
        comfortable: 'p-4',
        spacious: 'p-6'
    }[sidebarDensity];

    if (!isSidebarOpen) return null; // Or a minimized view logic

    return (
        <aside
            className={cn(
                "h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
                densityClass
            )}
            style={{ width: `${sidebarWidth}px` }}
        >
            <div className="flex flex-col h-full overflow-y-auto">
                <div className="mb-4">
                    <h2 className="text-xl font-bold px-2 text-gray-800 dark:text-gray-100">TaskMg</h2>
                </div>
                {children}
            </div>
        </aside>
    );
};
