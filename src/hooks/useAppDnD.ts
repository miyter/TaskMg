import {
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { updateProject, updateTask } from '../store';
import { Project } from '../store/schema';

export const useAppDnD = (projects: Project[]) => {
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
                // 仮の「order」更新ロジック
                // UI上は即座に反映されない(Firestore更新->購読更新待ち)が、
                // arrayMoveの結果を使ってOptimistic Updateをするならここで行う。
                // 現状はFirestore更新リクエストを投げるのみ。
                const newProjects = arrayMove(projects, oldIndex, newIndex);

                await Promise.all(newProjects.map((p, idx) => {
                    // Update order
                    // Note: 'order' field needs to be in ProjectSchema (added implicitly or needs update)
                    if (p.id) return updateProject(p.id, { order: idx } as any);
                    return Promise.resolve();
                }));
            }
        }
    };

    return { sensors, handleDragEnd };
};
