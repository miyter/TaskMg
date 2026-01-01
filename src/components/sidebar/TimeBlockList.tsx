import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useTimeBlocks } from '../../hooks/useTimeBlocks';
import { TimeBlock } from '../../store/schema';
import { useFilterStore } from '../../store/ui/filter-store';
import { SidebarItem } from './SidebarItem';


import { useTranslation } from '../../core/translations';
import { SidebarLoadingState } from '../common/SidebarLoadingState';

export const TimeBlockList: React.FC = () => {

    const { timeBlocks, loading } = useTimeBlocks();
    const { tasks } = useTasks();

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
                />
            ))}
            <UnassignedTimeBlockItem count={counts.unassignedCount} />
        </div>
    );
};


const TimeBlockItem: React.FC<{ block: TimeBlock, count: number }> = ({ block, count }) => {
    const { filterType, targetId, setFilter } = useFilterStore();
    const isActive = filterType === 'timeblock' && targetId === block.id;

    const { setNodeRef, isOver } = useDroppable({
        id: `timeblock:${block.id}`,
        data: {
            type: 'timeblock',
            value: block.id
        }
    });

    return (
        <div ref={setNodeRef}>
            <SidebarItem
                label={`${block.start} - ${block.end}`}
                icon={<span className="w-2 rounded-full aspect-square" style={{ backgroundColor: block.color }} />}
                count={count}
                isActive={isActive}
                isOver={isOver}
                onClick={() => setFilter('timeblock', block.id || '')}
            />
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
