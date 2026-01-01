import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../core/translations';
import { useWorkspaces } from '../../hooks/useWorkspaces';
import { useModalStore } from '../../store/ui/modal-store';
import { setCurrentWorkspaceId } from '../../store/workspace';

import { cn } from '../../utils/cn';

import { useWorkspace } from '../../hooks/useWorkspace';

export const WorkspaceDropdown: React.FC = () => {
    const { t } = useTranslation();
    const { workspaces, loading } = useWorkspaces();
    const { openModal } = useModalStore();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { workspaceId: currentId } = useWorkspace();
    const currentWorkspace = workspaces.find(w => w.id === currentId);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    if (loading) {
        return (
            <div className="h-8 w-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded"></div>
        );
    }

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-2 py-1 transition-colors group"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate max-w-[120px] sm:max-w-[140px] md:max-w-[180px]">
                    {currentWorkspace ? currentWorkspace.name : t('loading')}
                </span>

                <svg
                    className={cn("w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform duration-200", isOpen ? "rotate-180" : "")}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-60 sm:w-64 max-w-[calc(100vw-32px)] origin-top-left rounded-lg shadow-2xl bg-white dark:bg-gray-800 ring-1 ring-black/5 z-50 border border-gray-100 dark:border-gray-700 overflow-hidden animate-scale-in custom-scrollbar">

                    <div className="p-1 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                openModal('workspace-edit', null);
                            }}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors rounded-md"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            {t('sidebar.add_workspace')}
                        </button>
                    </div>

                    <div className="py-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                        {workspaces.map(ws => {
                            const isCurrent = ws.id === currentId;
                            return (
                                <button
                                    key={ws.id}
                                    onClick={() => {
                                        if (ws.id) setCurrentWorkspaceId(ws.id);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors",
                                        isCurrent
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    )}
                                >
                                    <span className="truncate block max-w-[140px] sm:max-w-[180px]">{ws.name}</span>
                                    {isCurrent && (
                                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
