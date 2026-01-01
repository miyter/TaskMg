import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import { useFilterStore } from '../../store/ui/filter-store';
import { SidebarItem } from './SidebarItem';

interface DurationItemProps {
    mins: number;
    count: number;
}

export const DurationItem: React.FC<DurationItemProps> = React.memo(({ mins, count }) => {
    const { filterType, targetId, setFilter } = useFilterStore();
    const isActive = filterType === 'duration' && targetId === mins.toString();

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
                icon={
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                }
                count={count}
                isActive={isActive}
                isOver={isOver}
                onClick={() => setFilter('duration', mins.toString())}
            />
        </div>
    );
});
