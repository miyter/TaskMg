import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React from 'react';
import { UI_CONFIG } from '../../core/ui-constants';
import { useProjects } from '../../hooks/useProjects';
import { SortableItem } from '../common/SortableItem';

import { SidebarLoadingState } from '../common/SidebarLoadingState';

import { ProjectItem } from './ProjectItem';

import { useTranslation } from '../../core/translations';

export const ProjectList: React.FC = () => {
    const { t } = useTranslation();
    const { projects, loading } = useProjects();

    if (loading) {
        return <SidebarLoadingState />;
    }

    if (projects.length === 0) {
        return <div className="p-4 text-xs text-gray-400">{t('sidebar.no_projects')}</div>;
    }

    return (
        <SortableContext
            items={projects.map(p => `${UI_CONFIG.DND.PREFIX_PROJECT}${p.id}`)}
            strategy={verticalListSortingStrategy}
        >
            <div className="space-y-0.5 p-2">
                {projects.map((project) => (
                    <SortableItem key={project.id} id={`${UI_CONFIG.DND.PREFIX_PROJECT}${project.id}`}>
                        <ProjectItem project={project} />
                    </SortableItem>
                ))}
            </div>
        </SortableContext>
    );
};



