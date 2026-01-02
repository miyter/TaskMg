import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import { useFilterStore } from '../../store/ui/filter-store';
import { IconClock } from '../common/Icons';
import { SidebarItem } from './SidebarItem';

import { useTranslation } from '../../core/translations';

interface DurationItemProps {
    mins: number;
    count: number;
}

export const DurationItem: React.FC<DurationItemProps> = React.memo(({ mins, count }) => {
    const { t } = useTranslation();
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
                label={t('sidebar.duration_format', { min: mins })}
                icon={
                    <IconClock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                }
                count={count}
                isActive={isActive}
                isOver={isOver}
                onClick={() => setFilter('duration', mins.toString())}
            />
        </div>
    );
});
