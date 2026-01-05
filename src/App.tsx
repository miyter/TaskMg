import {
    closestCenter,
    CollisionDetection,
    DndContext,
    pointerWithin,
    rectIntersection
} from '@dnd-kit/core';
import React, { Suspense, useCallback, useMemo } from 'react';
import { LoginPage } from './components/auth/LoginPage';
import { ToastContainer } from './components/common/ToastContainer';
import { AppLayout } from './components/layout/AppLayout';
import { ModalManager } from './components/modals/ModalManager';
import { SidebarContent } from './components/sidebar/SidebarContent';
import { TaskList } from './components/tasks/TaskList';
import { useAppDnD } from './hooks/useAppDnD';
import { useAuth } from './hooks/useAuth';
import { useLabels } from './hooks/useLabels';
import { useProjects } from './hooks/useProjects';
import { useThemeEffect } from './hooks/useThemeEffect';
import { useTranslation } from './hooks/useTranslation';

// Lazy load heavy components
const DashboardApp = React.lazy(() => import('./features/target-dashboard/DashboardApp').then(m => ({ default: m.DashboardApp })));
const WikiApp = React.lazy(() => import('./features/wiki/WikiApp').then(m => ({ default: m.WikiApp })));
const WizardApp = React.lazy(() => import('./features/wizard/WizardApp').then(m => ({ default: m.WizardApp })));
const GeneralDashboard = React.lazy(() => import('./components/views/GeneralDashboard').then(m => ({ default: m.GeneralDashboard })));
const SearchView = React.lazy(() => import('./components/views/SearchView').then(m => ({ default: m.SearchView })));

import { useDnDStore } from './store/ui/dnd-store';
import { useFilterStore } from './store/ui/filter-store';
import { useModalStore } from './store/ui/modal-store';
import { useSettingsStore } from './store/ui/settings-store';
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
    const { t } = useTranslation();

    // Use unified auth hook
    const { user, loading } = useAuth();

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const target = e.target as HTMLElement;
        const isInput = ['INPUT', 'TEXTAREA'].includes(target.tagName) || target.closest('[contenteditable]');
        // Check for open modals using the store state instead of DOM query
        const hasModal = useModalStore.getState().stack.length > 0;

        if (e.key === '/' && !isInput && !hasModal) {
            e.preventDefault();
            setFilter('search');
            setView('search');
        }
    }, [setFilter, setView]);

    React.useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    const { onTasksReorder } = useDnDStore();
    const { sensors, handleDragEnd, handleDragStart } = useAppDnD(projects, {
        onOptimisticReorder: setProjectsOverride,
        onRevertReorder: setProjectsOverride,
        onTasksReorder: onTasksReorder || undefined,
    });

    // Compute Title (memoized)
    const title = useMemo(() => {
        if (currentView === 'wizard') return t('sidebar.target_wizard');
        if (currentView === 'target-dashboard') return t('sidebar.target_dashboard');
        if (currentView === 'wiki') return t('sidebar.framework_wiki');
        if (currentView === 'search') return query ? t('search_view.results_for', { query }) : t('search');

        if (filterType === 'project') return projects.find(p => p.id === targetId)?.name || t('project');
        if (filterType === 'label') return labels.find(l => l.id === targetId)?.name || t('label');
        if (filterType === 'search') return query ? t('search_view.results_for', { query }) : t('search');
        switch (filterType) {
            case 'inbox': return t('inbox');
            case 'today': return t('today');
            case 'upcoming': return t('upcoming');
            default: return 'TaskMg';
        }
    }, [currentView, query, filterType, targetId, projects, labels, t]);

    // Show loading spinner while Firebase restores auth state OR Settings are hydrating
    const hasHydrated = useSettingsStore(state => state._hasHydrated);

    if (loading || !hasHydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">読み込み中...</p>
                </div>
            </div>
        );
    }

    if (!user) {
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
                <Suspense fallback={
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                }>
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
                </Suspense>
            </AppLayout>
        </DndContext>
    );
};

export default App;
