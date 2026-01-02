import { useDroppable } from '@dnd-kit/core';
import React, { useState } from 'react';
import { useTranslation } from '../../core/translations';
import { useTasks } from '../../hooks/useTasks';
import { useTimeBlocks } from '../../hooks/useTimeBlocks';
import { useWorkspace } from '../../hooks/useWorkspace';
import { deleteTimeBlock } from '../../store';
import { TimeBlock } from '../../store/schema';
import { useFilterStore } from '../../store/ui/filter-store';
import { useModalStore } from '../../store/ui/modal-store';
import { IconEdit, IconTrash } from '../common/Icons';
import { SidebarLoadingState } from '../common/SidebarLoadingState';
import { ContextMenu, ContextMenuItem } from '../ui/ContextMenu';
import { SidebarItem } from './SidebarItem';

export const TimeBlockList: React.FC = () => {
    const { timeBlocks, loading } = useTimeBlocks();
    const { tasks } = useTasks();
    const { workspaceId } = useWorkspace();

    // Optimize count calculation (Issue #29)
    const counts = React.useMemo(() => {
        const map = new Map<string, number>();
        let unassignedCount = 0;

        tasks.forEach(t => {
            if (t.status === 'completed') return;
            if (!t.timeBlockId || t.timeBlockId === 'unassigned' || t.timeBlockId === 'null') {
                unassignedCount++;
            } else {
                map.set(t.timeBlockId, (map.get(t.timeBlockId) || 0) + 1);
            }
        });
        return { map, unassignedCount };
    }, [tasks]);

    if (loading) return <SidebarLoadingState />;

    return (
        <div className="space-y-0.5 py-1">
            {timeBlocks.map(block => (
                <TimeBlockItem
                    key={block.id}
                    block={block}
                    count={counts.map.get(block.id || '') || 0}
                    workspaceId={workspaceId}
                />
            ))}
            <UnassignedTimeBlockItem count={counts.unassignedCount} />
        </div>
    );
};


const TimeBlockItem: React.FC<{ block: TimeBlock, count: number, workspaceId: string | null }> = ({ block, count, workspaceId }) => {
    const { t } = useTranslation(); // 追加
    const { filterType, targetId, setFilter } = useFilterStore();
    const { openModal } = useModalStore(); // 追加
    const isActive = filterType === 'timeblock' && targetId === block.id;

    const [menuPosition, setMenuPosition] = useState<{ x: number, y: number } | null>(null);

    const { setNodeRef, isOver } = useDroppable({
        id: `timeblock:${block.id}`,
        data: {
            type: 'timeblock',
            value: block.id
        }
    });

    const handleEdit = () => {
        setMenuPosition(null);
        openModal('timeblock-edit', block);
    };

    const handleDelete = () => {
        setMenuPosition(null);
        openModal('confirmation', {
            title: t('delete'),
            message: `${t('timeblock')}: ${block.start} - ${block.end}\n${t('msg.confirm_delete')}`,
            confirmLabel: t('delete'),
            variant: 'danger',
            onConfirm: async () => {
                if (block.id && workspaceId) {
                    await deleteTimeBlock(workspaceId, block.id);
                }
            }
        });
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setMenuPosition({ x: e.clientX, y: e.clientY });
    };

    return (
        <div ref={setNodeRef} onContextMenu={handleContextMenu}>
            <SidebarItem
                label={`${block.start} - ${block.end}`}
                icon={<span className="w-2 rounded-full aspect-square" style={{ backgroundColor: block.color }} />}
                count={count}
                isActive={isActive}
                isOver={isOver}
                onClick={() => setFilter('timeblock', block.id || '')}
            />
            {menuPosition && (
                <ContextMenu x={menuPosition.x} y={menuPosition.y} onClose={() => setMenuPosition(null)}>
                    <ContextMenuItem onClick={handleEdit} icon={<IconEdit size={16} />}>
                        {t('edit')}
                    </ContextMenuItem>
                    <ContextMenuItem onClick={handleDelete} variant="danger" icon={<IconTrash size={16} />}>
                        {t('delete')}
                    </ContextMenuItem>
                </ContextMenu>
            )}
        </div>
    );
};


const UnassignedTimeBlockItem: React.FC<{ count: number }> = ({ count }) => {
    const { t } = useTranslation();
    const { filterType, targetId, setFilter } = useFilterStore();

    const isActive = filterType === 'timeblock' && targetId === 'unassigned';


    const { setNodeRef, isOver } = useDroppable({
        id: `timeblock:unassigned`,
        data: {
            type: 'timeblock',
            value: 'unassigned'
        }
    });

    return (
        <div ref={setNodeRef}>
            <SidebarItem
                label={t('sidebar.unassigned')}


                icon={<span className="w-2 rounded-full aspect-square bg-gray-400" />}
                count={count}
                isActive={isActive}
                isOver={isOver}
                onClick={() => setFilter('timeblock', 'unassigned')}
            />
        </div>
    );
};



