import { useDroppable } from '@dnd-kit/core';
import React, { useState } from 'react';
import { useTranslation } from '../../core/translations';
import { deleteProject } from '../../store'; // インポート追加
import { Project } from '../../store/schema';
import { useFilterStore } from '../../store/ui/filter-store';
import { useModalStore } from '../../store/ui/modal-store';
import { useSettingsStore } from '../../store/ui/settings-store';
import { cn } from '../../utils/cn';
import { getDensityClass } from '../../utils/ui-utils';
import { ContextMenu, ContextMenuItem } from '../ui/ContextMenu'; // インポート追加

interface ProjectItemProps {
    project: Project;
}

export const ProjectItem = React.memo<ProjectItemProps>(({ project }) => {
    const { t } = useTranslation();
    const { filterType, targetId, setFilter } = useFilterStore();
    const { density } = useSettingsStore();
    const { openModal } = useModalStore();

    const isActive = filterType === 'project' && targetId === project.id;
    const [menuPosition, setMenuPosition] = useState<{ x: number, y: number } | null>(null);

    const { setNodeRef, isOver } = useDroppable({
        id: `project:${project.id}`,
        data: {
            type: 'project',
            value: project.id
        }
    });

    const handleEdit = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setMenuPosition(null);
        openModal('project-edit', project);
    };

    const handleDelete = async () => {
        setMenuPosition(null);
        if (confirm(`${t('project')}: ${project.name}\n${t('msg.confirm_delete')}`)) {
            if (project.id) {
                await deleteProject(project.id);
            }
        }
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setMenuPosition({ x: e.clientX, y: e.clientY });
    };

    return (
        <>
            <div
                ref={setNodeRef}
                onClick={() => setFilter('project', project.id)}
                onContextMenu={handleContextMenu}
                className={cn(
                    "group flex items-center justify-between px-2 rounded-md cursor-pointer transition-colors select-none",
                    getDensityClass(density),
                    isActive
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200",
                    isOver && "ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-900/50"
                )}
                role="button"
                tabIndex={0}
                aria-selected={isActive}
                aria-label={`${t('project')}: ${project.name}${isActive ? ` (${t('active')})` : ''}`}
            >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className={cn("text-xs shrink-0 transition-colors", isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500")}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
                    </span>
                    <span className="text-sm truncate">{project.name}</span>
                </div>

                {/* Edit Button (Keep visible for accessibility/touch) */}
                <button
                    onClick={handleEdit}
                    className={cn(
                        "p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-opacity",
                        isActive ? "opacity-100" : "opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                    )}
                    aria-label={t('edit')}
                    title={t('edit')}
                >
                    <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </button>
            </div>

            {menuPosition && (
                <ContextMenu x={menuPosition.x} y={menuPosition.y} onClose={() => setMenuPosition(null)}>
                    <ContextMenuItem onClick={handleEdit} icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    }>
                        {t('edit')}
                    </ContextMenuItem>
                    <ContextMenuItem onClick={handleDelete} variant="danger" icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    }>
                        {t('delete')}
                    </ContextMenuItem>
                </ContextMenu>
            )}
        </>
    );
});
