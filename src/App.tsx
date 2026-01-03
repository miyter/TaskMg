import {
    closestCenter,
    CollisionDetection,
    DndContext,
    pointerWithin,
    rectIntersection
} from '@dnd-kit/core';
import React, { useCallback, useMemo } from 'react';
import { LoginPage } from './components/auth/LoginPage';
import { ToastContainer } from './components/common/ToastContainer';
import { AppLayout } from './components/layout/AppLayout';
import { ModalManager } from './components/modals/ModalManager';
import { SidebarContent } from './components/sidebar/SidebarContent';
import { TaskList } from './components/tasks/TaskList';
import { GeneralDashboard } from './components/views/GeneralDashboard';
import { SearchView } from './components/views/SearchView';
import { auth } from './core/firebase';
import { onAuthStateChanged } from './core/firebase-sdk';
import { DashboardApp } from './features/target-dashboard/DashboardApp';
import { WikiApp } from './features/wiki/WikiApp';
import { WizardApp } from './features/wizard/WizardApp';
import { useAppDnD } from './hooks/useAppDnD';
import { useLabels } from './hooks/useLabels';
import { useProjects } from './hooks/useProjects';
import { useThemeEffect } from './hooks/useThemeEffect';

import { useFilterStore } from './store/ui/filter-store';
import { useViewStore } from './store/ui/view-store';

/**
 * Helper function to check if a droppable ID is a sidebar target
 */
function isSidebarDroppable(id: string | number): boolean {
    const idStr = String(id);
    return idStr.startsWith('project:') ||
        idStr === 'inbox' ||
        idStr.startsWith('timeblock:') ||
        idStr.startsWith('duration:') ||
        idStr.startsWith('label:');
}

/**
 * Custom collision detection that prioritizes sidebar drop targets.
 * When dragging a task over the sidebar, project/inbox/timeblock targets
 * should take precedence over task reordering targets.
 * 
 * Key implementation: Filter droppableContainers BEFORE calling collision detection,
 * not filtering the results after.
 */
const customCollisionDetection: CollisionDetection = (args) => {
    // 1. pointerWithin で衝突検出（サイドバーターゲットがあれば即返却）
    const pointerCollisions = pointerWithin(args);
    const sidebarPointerTargets = pointerCollisions.filter(c => isSidebarDroppable(c.id));
    if (sidebarPointerTargets.length > 0) {
        return sidebarPointerTargets;
    }

    // 2. サイドバーdroppableのみでrectIntersectionを呼ぶ（argsのdroppableContainersを事前フィルタ）
    const sidebarContainers = args.droppableContainers.filter(
        container => isSidebarDroppable(container.id)
    );

    if (sidebarContainers.length > 0) {
        const sidebarArgs = { ...args, droppableContainers: sidebarContainers };
        const sidebarRectCollisions = rectIntersection(sidebarArgs);
        if (sidebarRectCollisions.length > 0) {
            return sidebarRectCollisions;
        }
    }

    // 3. フォールバックでclosestCenter（タスク並び替え用）
    return closestCenter(args);
};

const App: React.FC = () => {
    useThemeEffect();
    const { filterType, targetId, query } = useFilterStore();

    const { currentView, setView } = useViewStore();
    const { setFilter } = useFilterStore();
    const { projects, setProjectsOverride } = useProjects();
    const { labels } = useLabels();

    // Auth state: null = not determined yet, false = explicitly logged out
    const [authState, setAuthState] = React.useState<{ user: any; loading: boolean }>({
        user: auth.currentUser,
        loading: !auth.currentUser // Only loading if no cached user
    });

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const target = e.target as HTMLElement;
        const isInput = ['INPUT', 'TEXTAREA'].includes(target.tagName) || target.closest('[contenteditable]');
        const hasModal = document.querySelector('[role="dialog"]');

        if (e.key === '/' && !isInput && !hasModal) {
            e.preventDefault();
            setFilter('search');
            setView('search');
        }
    }, [setFilter, setView]);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthState({ user, loading: false });
        });

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            unsubscribe();
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    const { sensors, handleDragEnd, handleDragStart } = useAppDnD(projects, {
        onOptimisticReorder: setProjectsOverride,
        onRevertReorder: setProjectsOverride,
    });

    // Compute Title (memoized)
    const title = useMemo(() => {
        if (currentView === 'wizard') return 'Goal Wizard';
        if (currentView === 'target-dashboard') return 'Target Dashboard';
        if (currentView === 'wiki') return 'Framework Wiki';
        if (currentView === 'search') return query ? `"${query}" の検索結果` : '検索';

        if (filterType === 'project') return projects.find(p => p.id === targetId)?.name || 'Project';
        if (filterType === 'label') return labels.find(l => l.id === targetId)?.name || 'Label';
        if (filterType === 'search') return query ? `"${query}" の検索結果` : '検索';
        switch (filterType) {
            case 'inbox': return 'Inbox';
            case 'today': return 'Today';
            case 'upcoming': return 'Upcoming';
            case 'important': return 'Important';
            case 'custom': return 'All Tasks';
            default: return 'TaskMg';
        }
    }, [currentView, query, filterType, targetId, projects, labels]);

    // Show loading spinner while Firebase restores auth state
    if (authState.loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">読み込み中...</p>
                </div>
            </div>
        );
    }

    if (!authState.user) {
        return <LoginPage />;
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={customCollisionDetection}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
        >
            <ToastContainer />
            <ModalManager />
            <AppLayout
                sidebarContent={<SidebarContent />}
                title={title}
            >
                {/* Main Content Routing */}
                {currentView === 'wizard' ? (
                    <WizardApp />
                ) : currentView === 'target-dashboard' ? (
                    <DashboardApp />
                ) : currentView === 'wiki' ? (
                    <WikiApp />
                ) : currentView === 'search' ? (
                    <SearchView />
                ) : currentView === 'dashboard' ? (
                    <GeneralDashboard />
                ) : (
                    <TaskList />
                )}
            </AppLayout>
        </DndContext>
    );
};

export default App;
