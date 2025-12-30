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
import { LoginPage } from './components/auth/LoginPage';
import { LegacyView } from './components/common/LegacyView';
import { AppLayout } from './components/layout/AppLayout'; // New Import
import { ModalManager } from './components/modals/ModalManager';
import { BasicFilters } from './components/sidebar/BasicFilters';
import { CustomFilterList } from './components/sidebar/CustomFilterList';
import { DurationList } from './components/sidebar/DurationList';
import { LabelList } from './components/sidebar/LabelList';
import { ProjectList } from './components/sidebar/ProjectList';
import { SidebarSection } from './components/sidebar/SidebarSection';
import { TargetList } from './components/sidebar/TargetList';
import { TimeBlockList } from './components/sidebar/TimeBlockList';
import { TaskList } from './components/tasks/TaskList';
// Sub-apps
import { auth } from './core/firebase';
import { onAuthStateChanged } from './core/firebase-sdk';
import { DashboardApp } from './features/target-dashboard/react/DashboardApp';
import { WikiApp } from './features/wiki/react/WikiApp';
import { renderWizard } from './features/wizard/wizard';
import { useLabels } from './hooks/useLabels';
import { useProjects } from './hooks/useProjects';
import { useThemeEffect } from './hooks/useThemeEffect';
import { updateProject, updateTask } from './store';
import { useFilterStore } from './store/ui/filter-store';

const App: React.FC = () => {
    useThemeEffect();
    const { filterType, targetId, searchQuery } = useFilterStore();
    const { projects } = useProjects();
    const { labels } = useLabels();

    const [user, setUser] = React.useState<any>(null);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const isInput = ['INPUT', 'TEXTAREA'].includes(target.tagName) || target.closest('[contenteditable]');
            const hasModal = document.querySelector('[role="dialog"]');

            if (e.key === '/' && !isInput && !hasModal) {
                const searchInput = document.getElementById('page-search-input');
                if (searchInput) {
                    e.preventDefault();
                    searchInput.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            unsubscribe();
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

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

    // Sidebar Content Definition
    const sidebarContent = (
        <div className="flex flex-col gap-4">
            <BasicFilters />

            <SidebarSection title="Projects">
                <ProjectList />
            </SidebarSection>

            <SidebarSection title="Targets" defaultExpanded={false}>
                <TargetList />
            </SidebarSection>

            <SidebarSection title="Labels" defaultExpanded={false}>
                <LabelList />
            </SidebarSection>

            <SidebarSection title="Time Blocks" defaultExpanded={false}>
                <TimeBlockList />
            </SidebarSection>

            <SidebarSection title="Durations" defaultExpanded={false}>
                <DurationList />
            </SidebarSection>

            <SidebarSection title="Filters" defaultExpanded={false}>
                <CustomFilterList />
            </SidebarSection>
        </div>
    );

    if (!user) {
        return <LoginPage />;
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <ModalManager />
            <AppLayout
                sidebarContent={sidebarContent}
                title={getTitle()}
            >
                {/* Main Content Routing */}
                {filterType === 'wizard' ? (
                    <LegacyView render={(el) => renderWizard(el)} />
                ) : filterType === 'target-dashboard' ? (
                    <DashboardApp />
                ) : filterType === 'wiki' ? (
                    <WikiApp />
                ) : filterType === 'search' ? (
                    <div className="p-4">Search Results for "{searchQuery}" (Backend search required)</div>
                ) : (
                    <TaskList />
                )}
            </AppLayout>
        </DndContext>
    );
};

export default App;
