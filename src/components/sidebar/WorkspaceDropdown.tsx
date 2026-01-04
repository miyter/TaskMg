import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../core/translations';
import { useWorkspaces } from '../../hooks/useWorkspaces';
import { useModalStore } from '../../store/ui/modal-store';
import { setCurrentWorkspaceId } from '../../store/workspace';

import { UI_CONFIG } from '../../core/ui-constants';
import { cn } from '../../utils/cn';

import { useWorkspace } from '../../hooks/useWorkspace';
import { Workspace } from '../../store/schema';
import { IconCheck, IconChevronDown, IconEdit, IconPlus, IconTrash } from '../common/Icons';

interface ContextMenuState {
    visible: boolean;
    x: number;
    y: number;
    workspace: Workspace | null;
}

export const WorkspaceDropdown: React.FC = () => {
    const { t } = useTranslation();
    const { workspaces, loading } = useWorkspaces();
    const { openModal } = useModalStore();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { workspaceId: currentId } = useWorkspace();
    const currentWorkspace = workspaces.find(w => w.id === currentId);

    // 右クリックメニュー
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({
        visible: false,
        x: 0,
        y: 0,
        workspace: null
    });
    const contextMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
            // コンテキストメニューも閉じる
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
                setContextMenu(prev => ({ ...prev, visible: false }));
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
                setContextMenu(prev => ({ ...prev, visible: false }));
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleContextMenu = (e: React.MouseEvent, workspace: Workspace) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            workspace
        });
    };

    const handleEdit = () => {
        if (contextMenu.workspace) {
            setIsOpen(false);
            setContextMenu(prev => ({ ...prev, visible: false }));
            openModal('workspace-edit', contextMenu.workspace);
        }
    };

    const handleDelete = () => {
        const ws = contextMenu.workspace;
        if (!ws?.id) return;

        // 最後のワークスペースは削除できない
        if (workspaces.length <= 1) {
            setIsOpen(false);
            setContextMenu(prev => ({ ...prev, visible: false }));
            return;
        }

        setContextMenu(prev => ({ ...prev, visible: false }));
        setIsOpen(false);

        openModal('confirmation', {
            title: t('delete'),
            message: t('msg.confirm_delete_workspace') || `ワークスペース「${ws.name}」を削除しますか？`,
            confirmLabel: t('delete'),
            variant: 'danger',
            onConfirm: async () => {
                try {
                    const { deleteWorkspace } = await import('../../store/workspace');
                    await deleteWorkspace(ws.id!);
                } catch (e) {
                    console.error("Failed to delete workspace:", e);
                }
            }
        });
    };

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

                <IconChevronDown
                    className={cn("w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform duration-200", isOpen ? "rotate-180" : "")}
                />
            </button>

            {isOpen && (
                <div
                    className="absolute left-0 mt-2 w-60 sm:w-64 max-w-[calc(100vw-32px)] origin-top-left rounded-lg shadow-2xl bg-white dark:bg-gray-800 ring-1 ring-black/5 border border-gray-100 dark:border-gray-700 overflow-hidden animate-scale-in custom-scrollbar"
                    style={{ zIndex: UI_CONFIG.Z_INDEX.DROPDOWN }}
                >

                    <div className="p-1 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                openModal('workspace-edit', null);
                            }}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors rounded-md"
                        >
                            <IconPlus className="w-4 h-4 mr-2" />
                            {t('sidebar.add_workspace')}
                        </button>
                    </div>

                    <div className="py-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                        {workspaces.map(ws => {
                            const isCurrent = ws.id === currentId;
                            return (
                                <div
                                    key={ws.id}
                                    className="flex items-center justify-between group/item px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                    onClick={() => {
                                        if (ws.id) setCurrentWorkspaceId(ws.id);
                                        setIsOpen(false);
                                    }}
                                    onContextMenu={(e) => handleContextMenu(e, ws)}
                                >
                                    <span className={cn(
                                        "flex-1 text-sm truncate mr-2",
                                        isCurrent
                                            ? 'text-blue-700 dark:text-blue-300 font-medium'
                                            : 'text-gray-700 dark:text-gray-300'
                                    )}>
                                        <span className="truncate block max-w-[140px] sm:max-w-[160px]">{ws.name}</span>
                                    </span>

                                    {isCurrent && (
                                        <IconCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            {t('sidebar.workspace_hint') || '右クリックで編集・削除'}
                        </p>
                    </div>
                </div>
            )}

            {/* 右クリックコンテキストメニュー */}
            {contextMenu.visible && contextMenu.workspace && (
                <div
                    ref={contextMenuRef}
                    className="fixed rounded-lg shadow-xl bg-white dark:bg-gray-800 ring-1 ring-black/10 border border-gray-200 dark:border-gray-700 py-1 min-w-[140px] animate-scale-in"
                    style={{
                        left: contextMenu.x,
                        top: contextMenu.y,
                        zIndex: UI_CONFIG.Z_INDEX.MODAL
                    }}
                >
                    <button
                        onClick={handleEdit}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <IconEdit className="w-4 h-4 mr-3 text-gray-500" />
                        {t('edit')}
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <IconTrash className="w-4 h-4 mr-3" />
                        {t('delete')}
                    </button>
                </div>
            )}
        </div>
    );
};
