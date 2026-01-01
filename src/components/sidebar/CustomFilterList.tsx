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

const CustomFilterItem: React.FC<{ filter: any, tasks: any[], workspaceId: string | null }> = ({ filter, tasks, workspaceId }) => {
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

    const handleDelete = async () => {
        setMenuPosition(null);
        if (confirm(`${t('filter')}: ${filter.name}\n${t('msg.confirm_delete')}`)) {
            if (filter.id && workspaceId) {
                await deleteFilter(workspaceId, filter.id);
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
            <div onContextMenu={handleContextMenu}>
                <SidebarItem
                    label={filter.name}
                    icon={<span>🔍</span>}
                    count={count}
                    isActive={isActive}
                    onClick={() => setFilter('custom', filter.id)}
                />
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
};
