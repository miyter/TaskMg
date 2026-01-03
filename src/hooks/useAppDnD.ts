import {
    DragEndEvent,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useCallback, useRef } from 'react';
import { useTranslation } from '../core/translations';
import { UI_CONFIG } from '../core/ui-constants';
import { reorderProjects, updateTask } from '../store';
import { Project, Task } from '../store/schema';
import { toast } from '../store/ui/toast-store';

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

    // Store simple snapshot of projects at start of drag
    const initialProjectsRef = useRef<Project[]>(projects);

    const handleDragStart = useCallback(() => {
        initialProjectsRef.current = projects;
    }, [projects]);

    const handleDragEnd = useCallback(async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        // Try to get Task ID from data (safer) or ID string (fallback)
        let draggedTaskId: string | null = null;
        if (active.data.current && active.data.current.type === 'task') {
            draggedTaskId = (active.data.current.task as Task)?.id || activeId.replace(UI_CONFIG.DND.PREFIX_TASK, '');
        }

        // 1. タスクの移動/並び替え
        if (draggedTaskId) {
            const targetData = over.data.current;
            const targetType = targetData?.type as string;
            const targetValue = targetData?.value;

            // 1-A. サイドバーターゲットへの移動
            if (targetType && isSidebarTargetType(targetType)) {
                const updates: Partial<Task> = {};

                if (targetType === UI_CONFIG.DND.TYPE_PROJECT) {
                    updates.projectId = targetValue;
                } else if (targetType === UI_CONFIG.DND.TYPE_INBOX) {
                    updates.projectId = null;
                } else if (targetType === UI_CONFIG.DND.TYPE_TIMEBLOCK) {
                    updates.timeBlockId = targetValue === 'unassigned' ? null : targetValue;
                } else if (targetType === UI_CONFIG.DND.TYPE_LABEL) {
                    const task = active.data.current?.task as Task | undefined;
                    const currentLabelIds = task?.labelIds ?? [];
                    if (targetValue) {
                        if (currentLabelIds.includes(targetValue)) {
                            updates.labelIds = currentLabelIds.filter(id => id !== targetValue);
                        } else {
                            updates.labelIds = [...currentLabelIds, targetValue];
                        }
                    }
                }

                if (Object.keys(updates).length > 0) {
                    try {
                        await updateTask(draggedTaskId, updates);
                    } catch (err) {
                        console.error('Failed to update task via dnd', err);
                        toast.error(t('msg.dnd.reorderFailed') || t('error'));
                    }
                    return;
                }
            }

            // 1-B. 他のタスクの上へのドロップ (並び替え)
            if (activeId !== overId && overId.startsWith(UI_CONFIG.DND.PREFIX_TASK)) {
                const overTaskId = overId.replace(UI_CONFIG.DND.PREFIX_TASK, '');
                options?.onTasksReorder?.(draggedTaskId, overTaskId);
                return;
            }
        }

        // 2. プロジェクト自体の並び替え
        if (activeId !== overId && activeId.startsWith(UI_CONFIG.DND.PREFIX_PROJECT) && overId.startsWith(UI_CONFIG.DND.PREFIX_PROJECT)) {
            const currentProjects = initialProjectsRef.current;
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
