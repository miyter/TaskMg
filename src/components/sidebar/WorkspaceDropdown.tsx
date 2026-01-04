import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../core/translations';
import { useWorkspaces } from '../../hooks/useWorkspaces';
import { useModalStore } from '../../store/ui/modal-store';
import { deleteWorkspace, setCurrentWorkspaceId } from '../../store/workspace';

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
                    className="absolute left-0 mt-2 w-64 max-w-[calc(100vw-32px)] origin-top-left rounded-2xl shadow-2xl glass-effect overflow-hidden animate-scale-in custom-scrollbar"
                    style={{ zIndex: UI_CONFIG.Z_INDEX.DROPDOWN }}
                >
                    <div className="p-2 border-b border-gray-200/50 dark:border-gray-700/30">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                openModal('workspace-edit', null);
                            }}
                            className="flex items-center w-full px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-500/10 transition-all rounded-xl group/add"
                        >
                            <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mr-2 group-hover/add:scale-110 transition-transform">
                                <IconPlus className="w-4 h-4" />
                            </div>
                            {t('sidebar.add_workspace')}
                        </button>
                    </div>

                    <div className="py-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                        {workspaces.map(ws => {
                            const isCurrent = ws.id === currentId;
                            return (
                                <div
                                    key={ws.id}
                                    className="px-2"
                                >
                                    <div
                                        className={cn(
                                            "flex items-center group/item px-3 py-2.5 rounded-xl transition-all cursor-pointer relative",
                                            isCurrent
                                                ? 'bg-blue-50/50 dark:bg-blue-500/10'
                                                : 'hover:bg-gray-100/50 dark:hover:bg-gray-700/30'
                                        )}
                                        onClick={() => {
                                            if (ws.id) setCurrentWorkspaceId(ws.id);
                                            setIsOpen(false);
                                        }}
                                        onContextMenu={(e) => handleContextMenu(e, ws)}
                                    >
                                        <div className={cn(
                                            "w-2 h-2 rounded-full mr-3",
                                            isCurrent ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "bg-transparent"
                                        )} />

                                        <span className={cn(
                                            "flex-1 text-sm truncate mr-2",
                                            isCurrent
                                                ? 'text-blue-700 dark:text-blue-300 font-bold'
                                                : 'text-gray-700 dark:text-gray-300'
                                        )}>
                                            {ws.name}
                                        </span>

                                        {/* Hover Actions */}
                                        <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover/item:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsOpen(false);
                                                    openModal('workspace-edit', ws);
                                                }}
                                                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 transition-colors"
                                                title={t('edit')}
                                            >
                                                <IconEdit className="w-3.5 h-3.5" />
                                            </button>
                                            {workspaces.length > 1 && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setContextMenu({ visible: false, x: 0, y: 0, workspace: ws });
                                                        setIsOpen(false);
                                                        openModal('confirmation', {
                                                            title: t('delete'),
                                                            message: t('msg.confirm_delete_workspace')?.replace('{name}', ws.name) || `ワークスペース「${ws.name}」を削除しますか？`,
                                                            confirmLabel: t('delete'),
                                                            variant: 'danger',
                                                            onConfirm: async () => {
                                                                await deleteWorkspace(ws.id!);
                                                            }
                                                        });
                                                    }}
                                                    className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                    title={t('delete')}
                                                >
                                                    <IconTrash className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>

                                        {isCurrent && !contextMenu.visible && (
                                            <div className="absolute right-3 opacity-100 group-hover/item:opacity-0 transition-opacity">
                                                <IconCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="px-4 py-2 bg-gray-50/30 dark:bg-gray-800/20 border-t border-gray-200/50 dark:border-gray-700/30">
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">
                            {t('workspaces')}
                        </p>
                    </div>
                </div>
            )}

            {/* コンテキストメニュー（予備として残すが、基本はホバーアクションを使用） */}
            {contextMenu.visible && contextMenu.workspace && (
                <div
                    ref={contextMenuRef}
                    className="fixed rounded-xl shadow-2xl glass-effect py-1.5 min-w-[140px] animate-scale-in"
                    style={{
                        left: contextMenu.x,
                        top: contextMenu.y,
                        zIndex: UI_CONFIG.Z_INDEX.MODAL
                    }}
                >
                    <button
                        onClick={handleEdit}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
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
