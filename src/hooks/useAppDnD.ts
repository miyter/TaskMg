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
     * 呼び出し後すぐにUIに反映される
     */
    onOptimisticReorder?: (newProjects: Project[]) => void;
    /**
     * Firestore更新失敗時にローカル状態を元に戻すコールバック
     */
    onRevertReorder?: (originalProjects: Project[]) => void;
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
        if (active.data.current && active.data.current.type === 'task' && active.data.current.task) {
            draggedTaskId = active.data.current.task.id;
        } else if (activeId.startsWith(UI_CONFIG.DND.PREFIX_TASK)) {
            draggedTaskId = activeId.replace(UI_CONFIG.DND.PREFIX_TASK, '');
        }

        // タスクをサイドバーへドラッグした場合の処理 (移動)
        if (draggedTaskId) {
            const targetData = over.data.current;
            const targetType = targetData?.type as string;
            const targetValue = targetData?.value;

            if (targetType) {
                const updates: Partial<Task> = {};

                if (targetType === UI_CONFIG.DND.TYPE_PROJECT) {
                    updates.projectId = targetValue;
                } else if (targetType === UI_CONFIG.DND.TYPE_INBOX) {
                    updates.projectId = null;
                } else if (targetType === UI_CONFIG.DND.TYPE_TIMEBLOCK) {
                    updates.timeBlockId = targetValue === 'unassigned' ? null : targetValue;
                } else if (targetType === UI_CONFIG.DND.TYPE_LABEL) {
                    // ラベルへのドラッグ: トグル (追加/削除)
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
                        // toast.success(t('msg.task.update_success')); // Optional: feedback on move
                    } catch (err) {
                        console.error('Failed to update task via dnd', err);
                        toast.error(t('msg.dnd.reorderFailed') || t('error'));
                    }
                    return; // Task move handled, exit
                }
            }
        }

        // プロジェクト自体の並び替え
        if (activeId !== overId && !draggedTaskId) {
            // Use snapshot for calculations to ensure consistency from drag start
            const currentProjects = initialProjectsRef.current;
            const oldIndex = currentProjects.findIndex(p => p.id === activeId);
            const newIndex = currentProjects.findIndex(p => p.id === overId);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newProjects = arrayMove(currentProjects, oldIndex, newIndex);

                // Optimistic Update: ローカル状態を即座に更新
                options?.onOptimisticReorder?.(newProjects);

                try {
                    // Firestore更新 (バックグラウンド)
                    await reorderProjects(newProjects);
                } catch (err) {
                    console.error('Failed to update project order', err);
                    toast.error(t('msg.dnd.reorderFailed') || t('error'));
                    // 失敗時: DragStart時の状態にロールバック
                    options?.onRevertReorder?.(currentProjects);
                }
            }
        }
    }, [projects, options, t]);

    return { sensors, handleDragEnd, handleDragStart };
};
