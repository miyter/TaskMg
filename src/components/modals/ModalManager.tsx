import React from 'react';
import { FilterEditModal } from './FilterEditModal';
import { LabelEditModal } from './LabelEditModal';
import { ProjectEditModal } from './ProjectEditModal';
import { SettingsModal } from './SettingsModal';
import { TaskDetailModal } from './TaskDetailModal';
import { TimeBlockEditModal } from './TimeBlockEditModal';
import { WorkspaceEditModal } from './WorkspaceEditModal';

export const ModalManager: React.FC = () => {
    return (
        <>
            <SettingsModal />
            <TaskDetailModal />
            <LabelEditModal />
            <ProjectEditModal />
            <WorkspaceEditModal />
            <FilterEditModal />
            <TimeBlockEditModal />
        </>
    );
};
