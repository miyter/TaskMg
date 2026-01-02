import React, { useMemo } from 'react';
import { UI_CONFIG } from '../../core/ui-constants';
import { useTasks } from '../../hooks/useTasks';
import { useSettingsStore } from '../../store/ui/settings-store';
import { DurationItem } from './DurationItem';

export const DurationList: React.FC = () => {
    const { tasks } = useTasks();
    const { customDurations } = useSettingsStore();
    const durations = customDurations?.length > 0 ? customDurations : UI_CONFIG.SIDEBAR.DURATIONS;

    // Memoize counts
    const counts = useMemo(() => {
        const map = new Map<number, number>();
        tasks.forEach(t => {
            if (t.status !== 'completed' && t.duration) {
                const d = Number(t.duration);
                if (!isNaN(d)) {
                    map.set(d, (map.get(d) || 0) + 1);
                }
            }
        });
        return map;
    }, [tasks]);

    return (
        <div className="space-y-0.5 py-1">
            {durations.map(mins => (
                <DurationItem
                    key={mins}
                    mins={mins}
                    count={counts.get(mins) || 0}
                />
            ))}
        </div>
    );
};
