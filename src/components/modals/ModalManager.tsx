import React from 'react';
import { FilterEditModal } from './FilterEditModal';
import { LabelEditModal } from './LabelEditModal';
import { ProjectEditModal } from './ProjectEditModal';
import { SettingsModal } from './SettingsModal';
import { TaskDetailModal } from './TaskDetailModal';
import { TimeBlockEditModal } from './TimeBlockEditModal';
import { WorkspaceEditModal } from './WorkspaceEditModal';

import { useModalStore } from '../../store/ui/modal-store';

import { WikiFrameworkModal } from '../../features/wiki/WikiFrameworkModal';



export const ModalManager: React.FC = () => {
    const { stack } = useModalStore();

    if (stack.length === 0) return null;

    return (
        <>
            {stack.map((modal, index) => {
                const isLast = index === stack.length - 1;
                // For now, most components ignore props and read store. 
                // They will only render if they match activeModal (which is the last item).
                // To enable true stacking, components must be refactored to accept 'isOpen' and 'data' props.
                // We pass them here in preparation.
                const props = {
                    key: modal.id,
                    isOpen: true, // Force open if we want stacking (requires component update)
                    data: modal.data,
                    zIndex: 100 + index * 10
                };

                switch (modal.type) {
                    case 'settings': return <SettingsModal {...props} />;
                    case 'task-detail': return <TaskDetailModal {...props} />;
                    case 'label-edit': return <LabelEditModal {...props} />;
                    case 'project-edit': return <ProjectEditModal {...props} />;
                    case 'workspace-edit': return <WorkspaceEditModal {...props} />;
                    case 'filter-edit': return <FilterEditModal {...props} />;
                    case 'timeblock-edit': return <TimeBlockEditModal {...props} />;
                    case 'wiki-framework': return <WikiFrameworkModal {...props} />;
                    default: return null;
                }
            })}
        </>
    );
};
