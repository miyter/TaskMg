import React, { useState } from 'react';
import { useTranslation } from '../../core/translations';
import { useFilters } from '../../hooks/useFilters';
import { useTaskCounts } from '../../hooks/useTaskCounts';
import { useWorkspace } from '../../hooks/useWorkspace';
import { deleteFilter } from '../../store';
import { useFilterStore } from '../../store/ui/filter-store';
import { useModalStore } from '../../store/ui/modal-store';
import { ContextMenu, ContextMenuItem } from '../ui/ContextMenu';
import { SidebarItem } from './SidebarItem';

import { Filter } from '../../store/schema';
import { IconEdit, IconSearch, IconTrash } from '../common/Icons';

export const CustomFilterList: React.FC = () => {
    const { filters, loading } = useFilters();
    const { workspaceId } = useWorkspace();
    const counts = useTaskCounts();

    if (loading) return null;

    return (
        <div className="space-y-0.5 py-1">
            {filters.map(filter => (
                <CustomFilterItem
                    key={filter.id}
                    filter={filter}
                    workspaceId={workspaceId}
                    count={counts.customFilters[filter.id!] || 0}
                />
            ))}
        </div>
    );
};

const CustomFilterItem: React.FC<{ filter: Filter, workspaceId: string | null, count: number }> = ({ filter, workspaceId, count }) => {
    const { t } = useTranslation();
    const { filterType, targetId, setFilter } = useFilterStore();
    const { openModal } = useModalStore();
    const isActive = filterType === 'custom' && targetId === filter.id;
    const [menuPosition, setMenuPosition] = useState<{ x: number, y: number } | null>(null);

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



