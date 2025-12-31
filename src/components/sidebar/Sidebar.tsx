import React from 'react';
import logo from '../../assets/logo.png';
import { UI_CONFIG } from '../../core/ui-constants';
import { useUIStore } from '../../store/ui/ui-store';
import { cn } from '../../utils/cn';

interface SidebarProps {
    children?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ children }) => {
    const { sidebarWidth, isSidebarOpen, sidebarDensity, toggleSidebar, setSidebarWidth } = useUIStore();

    // Map density to padding
    const densityClass = {
        compact: 'p-1',
        normal: 'p-2',
        comfortable: 'p-4',
        spacious: 'p-6'
    }[sidebarDensity];

    const handleMouseDown = (e: React.MouseEvent) => {
        const startX = e.clientX;
        const startWidth = sidebarWidth;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const rawWidth = startWidth + (moveEvent.clientX - startX);
            const newWidth = Math.max(
                UI_CONFIG.SIDEBAR.MIN_WIDTH,
                Math.min(UI_CONFIG.SIDEBAR.MAX_WIDTH, rawWidth)
            );
            setSidebarWidth(newWidth);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'default';
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'col-resize';
    };

    return (
        <aside
            className={cn(
                "h-full transition-all duration-300 flex flex-col group relative",
                // Mobile: Solid background, fixed z-index
                // Desktop: Glassmorphism, relative z-index
                "bg-white dark:bg-gray-900 md:bg-white/50 md:dark:bg-gray-800/50",
                "backdrop-blur-none md:backdrop-blur-xl",
                "border-r border-gray-200 dark:border-gray-700/50", // adjusted border color
                isSidebarOpen ? "translate-x-0" : "-translate-x-full",
                "fixed md:relative z-20 md:z-0 shadow-xl md:shadow-none overflow-hidden"
            )}
            style={{ width: isSidebarOpen ? `${sidebarWidth}px` : '0px' }}
        >
            {/* Header */}
            <div className="h-14 flex items-center px-4 flex-shrink-0 justify-between">
                <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition select-none">
                    <img src={logo} alt="Logo" className="h-8 w-8 rounded-lg shadow-sm" />
                    <span className="text-lg font-bold text-gray-800 dark:text-white tracking-tight">Task<span className="text-blue-600 dark:text-blue-400">Mg</span></span>
                </div>
                <button
                    onClick={toggleSidebar}
                    className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="サイドバーを閉じる"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
                    </svg>
                </button>
            </div>

            <div className={cn("flex-1 overflow-y-auto custom-scrollbar px-2", densityClass)}>
                {children}
            </div>

            {/* Resizer */}
            <div
                onMouseDown={handleMouseDown}
                className="absolute top-0 right-[-4px] w-2 h-full cursor-col-resize hover:bg-blue-500/50 transition-colors z-30 opacity-30 hover:opacity-100 hidden md:block"
                title="ドラッグしてリサイズ"
            />
        </aside>
    );
};
