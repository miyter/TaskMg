import { DragEndEvent, useDndMonitor } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React, { useMemo } from 'react';
import { getTranslator } from '../../core/translations';
import { useLabels } from '../../hooks/useLabels';
import { useTasks } from '../../hooks/useTasks';
import { reorderLabels } from '../../store';
import { useSettingsStore } from '../../store/ui/settings-store';
import { SidebarLoadingState } from '../common/SidebarLoadingState';
import { LabelItem } from './LabelItem';

export const LabelList: React.FC = () => {
    const { labels, loading } = useLabels();
    const { tasks } = useTasks();
    const language = useSettingsStore(s => s.language);
    const { t } = getTranslator(language);

    const activeTaskCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        tasks.forEach(t => {
            if (t.status !== 'completed' && t.labelIds) {
                t.labelIds.forEach(id => {
                    counts[id] = (counts[id] || 0) + 1;
                });
            }
        });
        return counts;
    }, [tasks]);

    useDndMonitor({
        onDragEnd: async (event: DragEndEvent) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;

            const activeIdStr = String(active.id);
            const overIdStr = String(over.id);

            // Verify they are labels for sorting
            if (!activeIdStr.startsWith('label-sortable:') || !overIdStr.startsWith('label-sortable:')) return;

            const sourceId = activeIdStr.replace('label-sortable:', '');
            const targetId = overIdStr.replace('label-sortable:', '');

            const oldIndex = labels.findIndex(l => l.id === sourceId);
            const newIndex = labels.findIndex(l => l.id === targetId);

            if (oldIndex !== -1 && newIndex !== -1) {
                const reordered = arrayMove(labels, oldIndex, newIndex);
                const params = reordered.map(l => l.id).filter((id): id is string => !!id);
                const workspaceId = labels[0]?.workspaceId; // Assuming all labels belong to same workspace

                if (workspaceId) {
                    await reorderLabels(workspaceId, params);
                }
            }
        }
    });

    if (loading) return <SidebarLoadingState />;
    if (labels.length === 0) return <div className="px-4 py-2 text-xs text-gray-400">{t('sidebar.no_labels')}</div>;

    const validLabels = labels.filter(l => !!l.id);

    return (
        <SortableContext
            items={validLabels.map(l => `label-sortable:${l.id}`)}
            strategy={verticalListSortingStrategy}
        >
            <ul className="space-y-0.5">
                {validLabels.map(label => (
                    <LabelItem
                        key={label.id}
                        label={label}
                        count={label.id ? (activeTaskCounts[label.id] || 0) : 0}
                    />
                ))}
            </ul>
        </SortableContext>
    );
};
