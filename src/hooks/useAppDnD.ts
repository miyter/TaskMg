import {
    DragEndEvent,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useCallback } from 'react';
import { useTranslation } from '../core/translations';
import { UI_CONFIG } from '../core/ui-constants';
import { reorderProjects, updateTask } from '../store';
import { Project, Task } from '../store/schema';
import { toast } from '../store/ui/toast-store';
import { useUIStore } from '../store/ui/ui-store';

/** Optimistic Update オプション */
interface UseAppDnDOptions {
    /**
     * プロジェクト並び替え時にローカル状態を即座に更新するコールバック
     */
    onOptimisticReorder?: (newProjects: Project[]) => void;
    /**
     * Firestore更新失敗時にローカル状態を元に戻すコールバック
     */
    onRevertReorder?: (originalProjects: Project[]) => void;
    /**
     * タスク並び替え時に呼び出されるコールバック
     */
    onTasksReorder?: (activeId: string, overId: string) => void;
}

export const useAppDnD = (projects: Project[], options?: UseAppDnDOptions) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: UI_CONFIG.DND.TOUCH_DELAY,
                tolerance: 5,
            },
        })
    );

    const { t } = useTranslation();

    const handleDragStart = useCallback(() => {
        // No snapshot needed if we trust `projects` prop or state to be consistent during drag
        // If we really need snapshot, it should be done carefully.
        // For now, simpler is better: rely on current state at end of drag.
    }, []);

    const handleDragEnd = useCallback(async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        // Try to get Task ID from data (safer) or ID string (fallback)
        let draggedTaskId: string | null = null;
        let originalTask: Task | undefined;

        if (active.data.current && active.data.current.type === 'task') {
            originalTask = active.data.current.task as Task | undefined;
            draggedTaskId = originalTask?.id || activeId.replace(UI_CONFIG.DND.PREFIX_TASK, '');
        }

        // 1. タスクの移動/並び替え
        if (draggedTaskId) {
            const targetData = over.data.current;
            const targetType = targetData?.type as string;
            const targetValue = targetData?.value;

            // 1-A. サイドバーターゲットへの移動
            if (targetType && isSidebarTargetType(targetType)) {
                if (!originalTask) {
                    console.error("Original task data missing for revert.");
                    return;
                }

                const updates: Partial<Task> = {};
                // Revert data prep
                const revertUpdates: Partial<Task> = {};

                if (targetType === UI_CONFIG.DND.TYPE_PROJECT) {
                    updates.projectId = targetValue;
                    revertUpdates.projectId = originalTask.projectId;
                } else if (targetType === UI_CONFIG.DND.TYPE_INBOX) {
                    updates.projectId = null;
                    revertUpdates.projectId = originalTask.projectId;
                } else if (targetType === UI_CONFIG.DND.TYPE_TIMEBLOCK) {
                    updates.timeBlockId = targetValue === 'unassigned' ? null : targetValue;
                    revertUpdates.timeBlockId = originalTask.timeBlockId;
                } else if (targetType === UI_CONFIG.DND.TYPE_LABEL) {
                    const currentLabelIds = originalTask.labelIds ?? [];
                    if (targetValue) {
                        if (currentLabelIds.includes(targetValue)) {
                            updates.labelIds = currentLabelIds.filter(id => id !== targetValue);
                        } else {
                            updates.labelIds = [...currentLabelIds, targetValue];
                        }
                    }
                    revertUpdates.labelIds = originalTask.labelIds;
                }

                if (Object.keys(updates).length > 0) {
                    // Optimistic update logic is handled by store usually, but here we just call updateTask
                    try {
                        await updateTask(draggedTaskId, updates);
                    } catch (err) {
                        console.error('Failed to update task via dnd', err);
                        toast.error(t('msg.dnd.reorderFailed') || t('error'));
                        // Revert
                        try {
                            await updateTask(draggedTaskId, revertUpdates);
                        } catch (revertErr) {
                            console.error('CRITICAL: Failed to revert task update!', revertErr);
                        }
                    }
                    return;
                }
            }

            // 1-B. 他のタスクの上へのドロップ (並び替え)
            if (activeId !== overId && overId.startsWith(UI_CONFIG.DND.PREFIX_TASK)) {
                const overTaskId = overId.replace(UI_CONFIG.DND.PREFIX_TASK, '');
                // Call store action for reordering
                // IMPORTANT: This should persist to Firestore! 
                // Currently dnd-store only notifies UI. We need a way to persist.
                // Assuming options.onTasksReorder is wiring this up? 
                // If not, we have a missing persistence layer for task sorting.
                options?.onTasksReorder?.(draggedTaskId, overTaskId);
                return;
            }
        }

        // 2. プロジェクト自体の並び替え
        if (activeId !== overId && activeId.startsWith(UI_CONFIG.DND.PREFIX_PROJECT) && overId.startsWith(UI_CONFIG.DND.PREFIX_PROJECT)) {
            // Use current 'projects' directly instead of stale ref
            const currentProjects = projects;
            const realActiveId = activeId.replace(UI_CONFIG.DND.PREFIX_PROJECT, '');
            const realOverId = overId.replace(UI_CONFIG.DND.PREFIX_PROJECT, '');
            const oldIndex = currentProjects.findIndex(p => p.id === realActiveId);
            const newIndex = currentProjects.findIndex(p => p.id === realOverId);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newProjects = arrayMove(currentProjects, oldIndex, newIndex);
                options?.onOptimisticReorder?.(newProjects);
                try {
                    await reorderProjects(newProjects.map(p => p.id!));
                } catch (err) {
                    console.error('Failed to update project order', err);
                    toast.error(t('msg.dnd.reorderFailed') || t('error'));
                    options?.onRevertReorder?.(currentProjects);
                }
            }
            return;
        }

        // 3. サイドバーセクションの並び替え
        const { sidebarSections, setSidebarSections } = useUIStore.getState();
        if (activeId !== overId && sidebarSections.includes(activeId) && sidebarSections.includes(overId)) {
            const oldIndex = sidebarSections.indexOf(activeId);
            const newIndex = sidebarSections.indexOf(overId);
            if (oldIndex !== -1 && newIndex !== -1) {
                setSidebarSections(arrayMove(sidebarSections, oldIndex, newIndex));
            }
            return;
        }

    }, [projects, options, t]);

    return { sensors, handleDragEnd, handleDragStart };
};

function isSidebarTargetType(type: string): boolean {
    return ([
        UI_CONFIG.DND.TYPE_PROJECT,
        UI_CONFIG.DND.TYPE_INBOX,
        UI_CONFIG.DND.TYPE_TIMEBLOCK,
        UI_CONFIG.DND.TYPE_LABEL
    ] as string[]).includes(type);
}
