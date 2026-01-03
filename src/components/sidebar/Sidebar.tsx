import React from 'react';
import logo from '../../assets/logo.png';
import { useTranslation } from '../../core/translations';
import { UI_CONFIG } from '../../core/ui-constants';
import { useUIStore } from '../../store/ui/ui-store';
import { cn } from '../../utils/cn';
import { IconDoubleChevronLeft } from '../common/Icons';
import { SidebarSearch } from './SidebarSearch';

interface SidebarProps {
    children?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ children }) => {
    const { sidebarWidth, isSidebarOpen, sidebarDensity, toggleSidebar, setSidebarWidth } = useUIStore();
    const { t } = useTranslation();

    // Map density to padding
    const densityClass = {
        compact: 'p-1',
        normal: 'p-2',
        comfortable: 'p-4',
        spacious: 'p-6'
    }[sidebarDensity];

    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!document.body.classList.contains('resizing')) return;
            const newWidth = Math.max(
                UI_CONFIG.SIDEBAR.MIN_WIDTH,
                Math.min(UI_CONFIG.SIDEBAR.MAX_WIDTH, e.clientX)
            );
            setSidebarWidth(newWidth);
        };

        const handleMouseUp = () => {
            document.body.classList.remove('resizing');
            document.body.style.cursor = 'default';
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [setSidebarWidth]);

    const handleMouseDown = () => {
        document.body.classList.add('resizing');
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
                "fixed lg:relative lg:z-0 shadow-2xl lg:shadow-none overflow-hidden",
                // Mobile width is fixed via inline style when open, otherwise 0. Desktop uses variable.
                "w-[var(--sidebar-mobile)] lg:w-[var(--sidebar-desktop)]"
            )}
            style={{
                '--sidebar-desktop': `${sidebarWidth}px`,
                '--sidebar-mobile': isSidebarOpen ? `${UI_CONFIG.LAYOUT.MOBILE_SIDEBAR_WIDTH_PX}px` : '0px',
                width: isSidebarOpen ? undefined : '0px', // Force 0 width when closed on mobile to prevent layout shift
                zIndex: window.innerWidth < 1024 ? UI_CONFIG.Z_INDEX.SIDEBAR_MOBILE : undefined
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
                    title={isSidebarOpen ? t('sidebar.toggle_collapse') : t('sidebar.toggle_expand')}
                    aria-label={isSidebarOpen ? t('sidebar.toggle_collapse') : t('sidebar.toggle_expand')}
                >
                    <IconDoubleChevronLeft className={cn("w-5 h-5 transition-transform duration-300", !isSidebarOpen && "rotate-180")} strokeWidth={2.5} />
                </button>
            </div>

            <div className="px-3 pb-2 pt-2">
                <SidebarSearch />
            </div>

            <div className={cn("flex-1 overflow-y-auto custom-scrollbar pt-2", densityClass)}>
                {children}
            </div>

            {/* Resizer Handle - Improved hit area */}
            <div
                role="separator"
                aria-orientation="vertical"
                aria-label={t('sidebar.resizer_label')}
                aria-valuenow={sidebarWidth}
                aria-valuemin={UI_CONFIG.SIDEBAR.MIN_WIDTH}
                aria-valuemax={UI_CONFIG.SIDEBAR.MAX_WIDTH}
                tabIndex={isSidebarOpen ? 0 : -1}
                onMouseDown={handleMouseDown}
                onKeyDown={(e) => {
                    if (e.key === 'ArrowLeft') {
                        setSidebarWidth(Math.max(UI_CONFIG.SIDEBAR.MIN_WIDTH, sidebarWidth - 10));
                    } else if (e.key === 'ArrowRight') {
                        setSidebarWidth(Math.min(UI_CONFIG.SIDEBAR.MAX_WIDTH, sidebarWidth + 10));
                    }
                }}
                className={cn(
                    "absolute top-0 right-0 w-3 h-full cursor-col-resize transition-colors hidden lg:flex items-center justify-center outline-none focus:bg-blue-500",
                    "hover:bg-blue-500/30 active:bg-blue-600/50 group/resizer"
                )}
                style={{ zIndex: UI_CONFIG.Z_INDEX.SIDEBAR_RESIZER }}
                title={t('sidebar.resizer_hint')}
            >
                {/* Visual Indicator - More visible */}
                <div className="absolute w-1 h-12 bg-gray-400 dark:bg-gray-500 rounded-full opacity-0 group-hover/resizer:opacity-100 group-focus/resizer:opacity-100 transition-opacity pointer-events-none" />
            </div>
            {/* Permanent subtle indicator for the resizer */}
            <div className="absolute top-0 right-0 w-[1px] h-full bg-gray-200/50 dark:bg-gray-700/30 hidden lg:block" />
        </aside>
    );
};




