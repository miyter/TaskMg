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
                const isFirst = index === 0;
                // スタック内の順序に応じてz-indexとオーバーレイを調整
                // 2枚目以降は背景を少しだけ暗くする（完全な透明だと重なりが分かりにくい、濃すぎると見づらい）
                const overlayStyle = isFirst ? undefined : "bg-black/20"; // undefined defaults to bg-black/50

                const props = {
                    key: modal.id, // modal.id is unique per instance
                    isOpen: true,
                    data: modal.data,
                    zIndex: 100 + index * 10,
                    overlayClassName: overlayStyle
                };

                // Note: All modal components must accept StandardModalProps (isOpen, data, zIndex, overlayClassName)
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
