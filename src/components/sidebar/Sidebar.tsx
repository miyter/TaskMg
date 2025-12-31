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
                "bg-white dark:bg-gray-900 lg:bg-white/70 lg:dark:bg-gray-800/60",
                "lg:backdrop-blur-xl",
                "border-r border-gray-200/50 dark:border-gray-700/30",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                "fixed lg:relative z-30 lg:z-0 shadow-2xl lg:shadow-none overflow-hidden",
                // Width handling via CSS variables
                "w-[var(--sidebar-mobile)] lg:w-[var(--sidebar-desktop)]"
            )}
            style={{
                '--sidebar-desktop': `${sidebarWidth}px`,
                '--sidebar-mobile': `${UI_CONFIG.LAYOUT.MOBILE_SIDEBAR_WIDTH_PX}px`,
                width: isSidebarOpen ? undefined : '0px',
                minWidth: isSidebarOpen ? undefined : '0px'
            } as React.CSSProperties}
        >
            {/* Header */}
            <div className="h-14 flex items-center px-4 flex-shrink-0 justify-between border-b border-gray-100 dark:border-gray-800/50">
                <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition select-none">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <img src={logo} alt="L" className="h-5 w-5 invert brightness-0" />
                    </div>
                    <span className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Task<span className="text-blue-600 dark:text-blue-400">Mg</span></span>
                </div>
                <button
                    onClick={toggleSidebar}
                    className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-90"
                    title="サイドバーを閉じる"
                    aria-label="サイドバーを閉じる"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
                    </svg>
                </button>
            </div>

            <div className={cn("flex-1 overflow-y-auto custom-scrollbar pt-4", densityClass)}>
                {children}
            </div>

            {/* Resizer Handle */}
            <div
                role="separator"
                aria-orientation="vertical"
                aria-valuenow={sidebarWidth}
                aria-valuemin={UI_CONFIG.SIDEBAR.MIN_WIDTH}
                aria-valuemax={UI_CONFIG.SIDEBAR.MAX_WIDTH}
                tabIndex={0}
                onMouseDown={handleMouseDown}
                onKeyDown={(e) => {
                    if (e.key === 'ArrowLeft') {
                        setSidebarWidth(Math.max(UI_CONFIG.SIDEBAR.MIN_WIDTH, sidebarWidth - 10));
                    } else if (e.key === 'ArrowRight') {
                        setSidebarWidth(Math.min(UI_CONFIG.SIDEBAR.MAX_WIDTH, sidebarWidth + 10));
                    }
                }}
                className={cn(
                    "absolute top-0 right-0 w-1 h-full cursor-col-resize z-40 transition-colors hidden lg:flex items-center justify-center outline-none focus:bg-blue-500",
                    "hover:bg-blue-500/50 active:bg-blue-600 group/resizer"
                )}
                title="ドラッグまたは矢印キーでリサイズ"
            >
                {/* Visual Indicator */}
                <div className="absolute w-1.5 h-8 bg-gray-300 dark:bg-gray-600 rounded-full opacity-0 group-hover/resizer:opacity-100 group-focus/resizer:opacity-100 transition-opacity pointer-events-none" />
            </div>
            {/* Permanent subtle indicator for the resizer */}
            <div className="absolute top-0 right-0 w-[1px] h-full bg-gray-200/50 dark:bg-gray-700/30 hidden lg:block" />
        </aside>
    );
};

