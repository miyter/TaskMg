import {
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { reorderProjects, updateTask } from '../store';
import { Project } from '../store/schema';

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
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        // タスクをサイドバーへドラッグした場合の処理 (移動)
        if (activeId.startsWith('task:')) {
            const taskId = activeId.split(':')[1];
            const targetType = over.data.current?.type;
            const targetValue = over.data.current?.value;

            const updates: any = {};
            if (targetType === 'project') updates.projectId = targetValue;
            if (targetType === 'inbox') updates.projectId = null;
            if (targetType === 'timeblock') updates.timeBlockId = targetValue === 'unassigned' ? null : targetValue;

            if (Object.keys(updates).length > 0) {
                try {
                    await updateTask(taskId, updates);
                } catch (err) {
                    console.error('Failed to update task via dnd', err);
                }
            }
        }

        // プロジェクト自体の並び替え
        if (activeId !== overId && !activeId.startsWith('task:')) {
            const oldIndex = projects.findIndex(p => p.id === activeId);
            const newIndex = projects.findIndex(p => p.id === overId);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newProjects = arrayMove(projects, oldIndex, newIndex);

                // Optimistic Update: ローカル状態を即座に更新
                options?.onOptimisticReorder?.(newProjects);

                try {
                    // Firestore更新 (バックグラウンド)
                    await reorderProjects(newProjects);
                } catch (err) {
                    console.error('Failed to update project order', err);
                    // 失敗時: 元の状態にロールバック
                    options?.onRevertReorder?.(projects);
                }
            }
        }
    };

    return { sensors, handleDragEnd };
};
