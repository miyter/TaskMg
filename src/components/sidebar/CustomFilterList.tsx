import React, { useState } from 'react';
import { useTranslation } from '../../core/translations';
import { useFilters } from '../../hooks/useFilters';
import { useTasks } from '../../hooks/useTasks';
import { useWorkspace } from '../../hooks/useWorkspace';
import { getProcessedTasks } from '../../logic/search';
import { deleteFilter } from '../../store';
import { useFilterStore } from '../../store/ui/filter-store';
import { useModalStore } from '../../store/ui/modal-store';
import { ContextMenu, ContextMenuItem } from '../ui/ContextMenu';
import { SidebarItem } from './SidebarItem';

import { Filter, Task } from '../../store/schema';
import { IconEdit, IconSearch, IconTrash } from '../common/Icons';

export const CustomFilterList: React.FC = () => {
    const { filters, loading } = useFilters();
    const { tasks } = useTasks();
    const { workspaceId } = useWorkspace();

    if (loading) return null;

    return (
        <div className="space-y-0.5 py-1">
            {filters.map(filter => (
                <CustomFilterItem key={filter.id} filter={filter} tasks={tasks} workspaceId={workspaceId} />
            ))}
        </div>
    );
};

const CustomFilterItem: React.FC<{ filter: Filter, tasks: Task[], workspaceId: string | null }> = ({ filter, tasks, workspaceId }) => {
    const { t } = useTranslation();
    const { filterType, targetId, setFilter } = useFilterStore();
    const { openModal } = useModalStore();
    const isActive = filterType === 'custom' && targetId === filter.id;
    const [menuPosition, setMenuPosition] = useState<{ x: number, y: number } | null>(null);

    // 件数計算 (logic/search の getProcessedTasks を使用)
    const count = React.useMemo(() => {
        try {
            const results = getProcessedTasks(tasks, { savedFilter: filter, showCompleted: false });
            return results.length;
        } catch (e) {
            console.warn('[CustomFilterItem] Count error:', e);
            return 0;
        }
    }, [tasks, filter]);

    const handleEdit = () => {
        setMenuPosition(null);
        openModal('filter-edit', filter);
    };

    const handleDelete = () => {
        setMenuPosition(null);
        openModal('confirmation', {
            title: t('delete'),
            message: `${t('filter')}: ${filter.name}\n${t('msg.confirm_delete')}`,
            confirmLabel: t('delete'),
            variant: 'danger',
            onConfirm: async () => {
                if (filter.id && workspaceId) {
                    await deleteFilter(workspaceId, filter.id);
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
        <>
            <div onContextMenu={handleContextMenu}>
                <SidebarItem
                    label={filter.name}
                    icon={<IconSearch size={16} />}
                    count={count}
                    isActive={isActive}
                    onClick={() => setFilter('custom', filter.id)}
                />
            </div>
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
        </>
    );
};
