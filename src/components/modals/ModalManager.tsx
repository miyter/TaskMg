import React from 'react';
import { SettingsModal } from './SettingsModal';
import { TaskDetailModal } from './TaskDetailModal';

export const ModalManager: React.FC = () => {
    return (
        <>
            <SettingsModal />
            <TaskDetailModal />
        </>
    );
};
