import {
    DragEndEvent,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useCallback, useRef } from 'react';
import { getTranslator } from '../core/translations';
import { UI_CONFIG } from '../core/ui-constants';
import { reorderProjects, updateTask } from '../store';
import { Project, Task } from '../store/schema';
import { useSettingsStore } from '../store/ui/settings-store';
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
                delay: UI_CONFIG.DND.TOUCH_DELAY, // Prevent accidental drags while scrolling
                tolerance: 5,
            },

        })
    );

    const { language } = useSettingsStore();
    const { t } = getTranslator(language);

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

        const getTaskId = (id: string) => id.startsWith(UI_CONFIG.DND.PREFIX_TASK) ? id.split(':')[1] : null;
        const draggedTaskId = getTaskId(activeId);

        // タスクをサイドバーへドラッグした場合の処理 (移動)
        if (draggedTaskId) {
            const targetType = over.data.current?.type as string; // Cast to generic string to avoid overly complex type checks with UI_CONFIG
            const targetValue = over.data.current?.value;

            const updates: Partial<Task> = {};
            if (targetType === UI_CONFIG.DND.TYPE_PROJECT) updates.projectId = targetValue;
            if (targetType === UI_CONFIG.DND.TYPE_INBOX) updates.projectId = null;
            if (targetType === UI_CONFIG.DND.TYPE_TIMEBLOCK) updates.timeBlockId = targetValue === 'unassigned' ? null : targetValue;

            if (Object.keys(updates).length > 0) {
                try {
                    await updateTask(draggedTaskId, updates);
                } catch (err) {
                    console.error('Failed to update task via dnd', err);
                    toast.error(t('msg.dnd.reorderFailed') || t('error'));
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
