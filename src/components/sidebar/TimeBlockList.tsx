import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useTimeBlocks } from '../../hooks/useTimeBlocks';
import { useFilterStore } from '../../store/ui/filter-store';
import { SidebarItem } from './SidebarItem';

import { SidebarLoadingState } from '../common/SidebarLoadingState';

export const TimeBlockList: React.FC = () => {
    const { timeBlocks, loading } = useTimeBlocks();
    const { tasks } = useTasks();

    if (loading) return <SidebarLoadingState />;

    return (
        <div className="space-y-0.5 py-1">
            {timeBlocks.map(block => (
                <TimeBlockItem key={block.id} block={block} tasks={tasks} />
            ))}
            <UnassignedTimeBlockItem tasks={tasks} />
        </div>
    );
};

const TimeBlockItem: React.FC<{ block: any, tasks: any[] }> = ({ block, tasks }) => {
    const { filterType, targetId, setFilter } = useFilterStore();
    const isActive = filterType === 'timeblock' && targetId === block.id;

    const count = tasks.filter(t => t.status !== 'completed' && t.timeBlockId === block.id).length;

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
                onClick={() => setFilter('timeblock', block.id)}
            />
        </div>
    );
};

const UnassignedTimeBlockItem: React.FC<{ tasks: any[] }> = ({ tasks }) => {
    const { filterType, targetId, setFilter } = useFilterStore();
    const isActive = filterType === 'timeblock' && targetId === 'unassigned';

    const count = tasks.filter(t => t.status !== 'completed' && (!t.timeBlockId || t.timeBlockId === 'unassigned' || t.timeBlockId === 'null')).length;

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
                label="未定"
                icon={<span className="w-2 rounded-full aspect-square bg-gray-400" />}
                count={count}
                isActive={isActive}
                isOver={isOver}
                onClick={() => setFilter('timeblock', 'unassigned')}
            />
        </div>
    );
};
