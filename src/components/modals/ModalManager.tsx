import React, { Suspense } from 'react';
import { useModalStore } from '../../store/ui/modal-store';

// Lazy load modals to improve initial bundle size and performance
const FilterEditModal = React.lazy(() => import('./FilterEditModal').then(m => ({ default: m.FilterEditModal })));
const LabelEditModal = React.lazy(() => import('./LabelEditModal').then(m => ({ default: m.LabelEditModal })));
const ProjectEditModal = React.lazy(() => import('./ProjectEditModal').then(m => ({ default: m.ProjectEditModal })));
const SettingsModal = React.lazy(() => import('./SettingsModal').then(m => ({ default: m.SettingsModal })));
const TaskDetailModal = React.lazy(() => import('./TaskDetailModal').then(m => ({ default: m.TaskDetailModal })));
const TimeBlockEditModal = React.lazy(() => import('./TimeBlockEditModal').then(m => ({ default: m.TimeBlockEditModal })));
const WorkspaceEditModal = React.lazy(() => import('./WorkspaceEditModal').then(m => ({ default: m.WorkspaceEditModal })));
const WikiFrameworkModal = React.lazy(() => import('../../features/wiki/WikiFrameworkModal').then(m => ({ default: m.WikiFrameworkModal })));
const ConfirmationModal = React.lazy(() => import('./ConfirmationModal').then(m => ({ default: m.ConfirmationModal })));

export const ModalManager: React.FC = () => {
    const { stack } = useModalStore();

    if (stack.length === 0) return null;

    return (
        <Suspense fallback={null}>
            {stack.map((modal, index) => {
                const isFirst = index === 0;
                const overlayStyle = isFirst ? undefined : "bg-black/30";

                const props = {
                    isOpen: true,
                    data: modal.data,
                    zIndex: 100 + index * 10,
                    overlayClassName: overlayStyle
                };

                // Render correct modal component
                switch (modal.type) {
                    case 'settings': return <SettingsModal key={modal.id} {...props} />;
                    case 'task-detail': return <TaskDetailModal key={modal.id} {...props} />;
                    case 'label-edit': return <LabelEditModal key={modal.id} {...props} />;
                    case 'project-edit': return <ProjectEditModal key={modal.id} {...props} />;
                    case 'workspace-edit': return <WorkspaceEditModal key={modal.id} {...props} />;
                    case 'filter-edit': return <FilterEditModal key={modal.id} {...props} />;
                    case 'timeblock-edit': return <TimeBlockEditModal key={modal.id} {...props} />;
                    case 'wiki-framework': return <WikiFrameworkModal key={modal.id} {...props} />;
                    case 'confirmation': return <ConfirmationModal key={modal.id} {...props} />;
                    default: return null;
                }
            })}
        </Suspense>
    );
};
