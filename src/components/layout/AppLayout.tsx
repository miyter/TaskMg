import React from 'react';
import { useTranslation } from '../../core/translations';
import { UI_CONFIG } from '../../core/ui-constants';
import { useModalStore } from '../../store/ui/modal-store';
import { useUIStore } from '../../store/ui/ui-store';
import { cn } from '../../utils/cn';
import { IconMenu, IconSettings } from '../common/Icons';
import { Sidebar } from '../sidebar/Sidebar';
import { WorkspaceDropdown } from '../sidebar/WorkspaceDropdown';

interface AppLayoutProps {
    sidebarContent: React.ReactNode;
    title: string;
    children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ sidebarContent, title, children }) => {
    const { toggleSidebar, isSidebarOpen } = useUIStore();
    const { t } = useTranslation();
    const { openModal } = useModalStore();

    return (
        <div className="w-full h-full flex overflow-hidden bg-premium-gradient text-gray-800 dark:text-white antialiased">
            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300"
                    onClick={toggleSidebar}
                />
            )}

            <Sidebar>
                {sidebarContent}
            </Sidebar>

            <main className="flex-1 flex flex-col relative overflow-hidden" id="main-content">
                <header className="h-12 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 justify-between bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 sticky top-0">
                    <div className="flex items-center gap-3">
                        {!isSidebarOpen && (
                            <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title={t('sidebar.menu_open')} aria-label={t('sidebar.menu_open')}>
                                <IconMenu className="w-5 h-5" />
                            </button>
                        )}
                        <WorkspaceDropdown />
                        <h1 className="font-bold text-lg border-l border-gray-300 dark:border-gray-700 pl-3 ml-1 truncate">{title}</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => openModal('settings')}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                            title="Settings"
                            aria-label="Settings"
                        >
                            <IconSettings className="w-5 h-5" />
                        </button>
                    </div>
                </header>
                <div className="flex-1 overflow-hidden flex flex-col">
                    <div className={cn("w-full h-full bg-white dark:bg-gray-900 relative flex-1", UI_CONFIG.LAYOUT.CONTAINER_WIDTH_CLASS)}>
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};




