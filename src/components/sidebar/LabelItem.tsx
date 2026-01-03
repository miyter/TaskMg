import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useState } from 'react';
import { useTranslation } from '../../core/translations';
import { UI_CONFIG } from '../../core/ui-constants';
import { deleteLabel } from '../../store';
import { Label } from '../../store/schema';
import { useFilterStore } from '../../store/ui/filter-store';
import { useModalStore } from '../../store/ui/modal-store';
import { useSettingsStore } from '../../store/ui/settings-store';
import { useViewStore } from '../../store/ui/view-store';
import { cn } from '../../utils/cn';
import { getDensityClass } from '../../utils/ui-utils';
import { IconEdit, IconTrash } from '../common/Icons';
import { ContextMenu, ContextMenuItem } from '../ui/ContextMenu';

interface LabelItemProps {
    label: Label;
    count?: number;
}

export const LabelItem = React.memo<LabelItemProps>(({ label, count = 0 }) => {
    const { t, formatNumber } = useTranslation();
    const { filterType, targetId, setFilter } = useFilterStore();
    const { density } = useSettingsStore();
    const { setView } = useViewStore();
    const { openModal } = useModalStore();

    const [menuPosition, setMenuPosition] = useState<{ x: number, y: number } | null>(null);

    const isActive = filterType === 'label' && targetId === label.id;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isOver,
        isDragging
    } = useSortable({
        id: `label:${label.id}`,
        data: {
            type: UI_CONFIG.DND.TYPE_LABEL,
            value: label.id
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    };

    const handleClick = () => {
        setFilter('label', label.id);
        setView('tasks');
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setMenuPosition({ x: e.clientX, y: e.clientY });
    };

    const handleEdit = () => {
        setMenuPosition(null);
        openModal('label-edit', label);
    };

    const handleDelete = () => {
        setMenuPosition(null);
        openModal('confirmation', {
            title: t('delete'),
            message: `${t('label')}: ${label.name}\n${t('msg.confirm_delete')}`,
            confirmLabel: t('delete'),
            variant: 'danger',
            onConfirm: async () => {
                if (label.workspaceId && label.id) {
                    await deleteLabel(label.workspaceId, label.id);
                }
            }
        });
    };

    return (
        <>
            <li ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-manipulation">
                <button
                    onClick={handleClick}
                    onContextMenu={handleContextMenu}
                    className={cn(
                        "w-full flex items-center px-2 py-1.5 text-sm rounded-md transition-colors text-left gap-2 group relative",
                        getDensityClass(density),
                        isActive
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",
                        isOver && !isDragging && "bg-purple-50 dark:bg-purple-900/30 ring-2 ring-purple-400"
                    )}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={`Label: ${label.name}`}
                >
                    <span
                        className={cn(
                            "w-3 h-3 rounded-full transition-all shrink-0",
                            isActive ? "opacity-100 scale-110 shadow-sm" : "opacity-75 group-hover:opacity-100"
                        )}
                        style={{ backgroundColor: label.color || UI_CONFIG.DEFAULT_COLORS.LABEL_INACTIVE }}
                    ></span>
                    <span className="truncate flex-1">{label.name}</span>

                    {/* Count */}
                    {count > 0 && (
                        <span className={cn(
                            "text-xs px-1.5 py-0.5 rounded-full transition-opacity",
                            isActive ? "bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600"
                        )}>
                            {formatNumber(count)}
                        </span>
                    )}
                </button>
            </li>

            {menuPosition && (
                <ContextMenu x={menuPosition.x} y={menuPosition.y} onClose={() => setMenuPosition(null)}>
                    <ContextMenuItem onClick={handleEdit} icon={<IconEdit />}>
                        {t('edit')}
                    </ContextMenuItem>
                    <ContextMenuItem onClick={handleDelete} variant="danger" icon={<IconTrash />}>
                        {t('delete')}
                    </ContextMenuItem>
                </ContextMenu>
            )}
        </>
    );
});
