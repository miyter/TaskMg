import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useFilterStore } from '../../store/ui/filter-store';
import { SIDEBAR_CONFIG } from '../../ui/features/sidebar/sidebar-constants';
import { SidebarItem } from './SidebarItem';

export const DurationList: React.FC = () => {
    const { tasks } = useTasks();
    const durations = SIDEBAR_CONFIG.DURATIONS;

    return (
        <div className="space-y-0.5 py-1">
            {durations.map(mins => (
                <DurationItem key={mins} mins={mins} tasks={tasks} />
            ))}
        </div>
    );
};

const DurationItem: React.FC<{ mins: number, tasks: any[] }> = ({ mins, tasks }) => {
    const { filterType, targetId, setFilter } = useFilterStore();
    const isActive = filterType === 'duration' && targetId === mins.toString();

    const count = tasks.filter(t => t.status !== 'completed' && Number(t.duration) === mins).length;

    const { setNodeRef, isOver } = useDroppable({
        id: `duration:${mins}`,
        data: {
            type: 'duration',
            value: mins.toString()
        }
    });

    return (
        <div ref={setNodeRef}>
            <SidebarItem
                label={`${mins} min`}
                icon={<span>⏱️</span>}
                count={count}
                isActive={isActive}
                isOver={isOver}
                onClick={() => setFilter('duration', mins.toString())}
            />
        </div>
    );
};
