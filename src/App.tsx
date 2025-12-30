import {
    closestCenter,
    DndContext,
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import React from 'react';
import { ModalManager } from './components/modals/ModalManager';
import { BasicFilters } from './components/sidebar/BasicFilters';
import { LabelList } from './components/sidebar/LabelList';
import { ProjectList } from './components/sidebar/ProjectList';
import { Sidebar } from './components/sidebar/Sidebar';
import { SidebarSection } from './components/sidebar/SidebarSection';
import { TaskList } from './components/tasks/TaskList';
import { useLabels } from './hooks/useLabels';
import { useProjects } from './hooks/useProjects';
import { updateProject, updateTask } from './store';
import { useFilterStore } from './store/ui/filter-store';
import { useModalStore } from './store/ui/modal-store';
import { useUIStore } from './store/ui/ui-store';

const App: React.FC = () => {
    const { toggleSidebar } = useUIStore();
    const { openModal } = useModalStore();
    const { filterType, targetId } = useFilterStore();
    const { projects } = useProjects();
    const { labels } = useLabels();

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
                // 仮の「order」更新ロジック (スキーマに未定義の場合は実体化が必要だが、ここではUIフィードバック)
                // 本来は各プロジェクトのorder値を更新してFirestoreへ書き込む
                newProjects.forEach(async (p, idx) => {
                    if (p.id) await updateProject(p.id, { order: idx } as any);
                });
            }
        }
    };

    // Compute Title
    const getTitle = () => {
        if (filterType === 'project') return projects.find(p => p.id === targetId)?.name || 'Project';
        if (filterType === 'label') return labels.find(l => l.id === targetId)?.name || 'Label';
        switch (filterType) {
            case 'inbox': return 'Inbox';
            case 'today': return 'Today';
            case 'upcoming': return 'Upcoming';
            case 'important': return 'Important';
            case 'all': return 'All Tasks';
            default: return 'TaskMg';
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="h-full flex overflow-hidden bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
                <ModalManager />

                <Sidebar>
                    <div className="flex flex-col gap-4">
                        <BasicFilters />

                        <SidebarSection title="Projects">
                            <ProjectList />
                        </SidebarSection>

                        <SidebarSection title="Labels" defaultExpanded={false}>
                            <LabelList />
                        </SidebarSection>
                    </div>
                </Sidebar>

                <main className="flex-1 flex flex-col relative h-full overflow-hidden">
                    <header className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 justify-between bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 sticky top-0">
                        <div className="flex items-center gap-3">
                            <button onClick={toggleSidebar} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                            </button>
                            <h1 className="font-bold text-lg">{getTitle()}</h1>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => openModal('settings')}
                                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                                title="Settings"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </button>
                        </div>
                    </header>
                    <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                        <div className="max-w-3xl mx-auto">
                            <TaskList />
                        </div>
                    </div>
                </main>
            </div>
        </DndContext>
    );
};

export default App;
