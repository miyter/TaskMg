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
    const { activeModal } = useModalStore();

    return (
        <>
            {activeModal === 'settings' && <SettingsModal />}
            {activeModal === 'task-detail' && <TaskDetailModal />}
            {activeModal === 'label-edit' && <LabelEditModal />}
            {activeModal === 'project-edit' && <ProjectEditModal />}
            {activeModal === 'workspace-edit' && <WorkspaceEditModal />}
            {activeModal === 'filter-edit' && <FilterEditModal />}
            {activeModal === 'timeblock-edit' && <TimeBlockEditModal />}
            {activeModal === 'wiki-framework' && <WikiFrameworkModal />}
        </>
    );
};
