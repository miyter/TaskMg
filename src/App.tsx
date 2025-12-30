import {
    closestCenter,
    DndContext
} from '@dnd-kit/core';
import React from 'react';
import { LoginPage } from './components/auth/LoginPage';
import { ToastContainer } from './components/common/ToastContainer';
import { AppLayout } from './components/layout/AppLayout';
import { ModalManager } from './components/modals/ModalManager';
import { SidebarContent } from './components/sidebar/SidebarContent';
import { TaskList } from './components/tasks/TaskList';
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

const App: React.FC = () => {
    useThemeEffect();
    const { filterType, targetId, query } = useFilterStore();
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

    const { sensors, handleDragEnd } = useAppDnD(projects);

    // Compute Title
    const getTitle = () => {
        if (filterType === 'project') return projects.find(p => p.id === targetId)?.name || 'Project';
        if (filterType === 'label') return labels.find(l => l.id === targetId)?.name || 'Label';
        if (filterType === 'search') return query ? `"${query}" の検索結果` : '検索';
        switch (filterType) {
            case 'inbox': return 'Inbox';
            case 'today': return 'Today';
            case 'upcoming': return 'Upcoming';
            case 'important': return 'Important';
            case 'all': return 'All Tasks';
            default: return 'TaskMg';
        }
    };

    if (!user) {
        return <LoginPage />;
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <ToastContainer />
            <ModalManager />
            <AppLayout
                sidebarContent={<SidebarContent />}
                title={getTitle()}
            >
                {/* Main Content Routing */}
                {filterType === 'wizard' ? (
                    <WizardApp />
                ) : filterType === 'target-dashboard' ? (
                    <DashboardApp />
                ) : filterType === 'wiki' ? (
                    <WikiApp />
                ) : (
                    <TaskList />
                )}
            </AppLayout>
        </DndContext>
    );
};

export default App;
