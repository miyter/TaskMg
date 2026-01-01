import React from 'react';
import { useTranslation } from '../../core/translations';
import { UI_CONFIG } from '../../core/ui-constants';
import { useModalStore } from '../../store/ui/modal-store';
import { useUIStore } from '../../store/ui/ui-store';
import { cn } from '../../utils/cn';
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
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
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
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
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

