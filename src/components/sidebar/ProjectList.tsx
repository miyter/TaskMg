import {
    useDroppable
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React from 'react';
import { useProjects } from '../../hooks/useProjects';
import { SortableItem } from '../common/SortableItem';

export const ProjectList: React.FC = () => {
    const { projects, loading } = useProjects();

    if (loading) {
        return <div className="p-4 text-xs text-gray-400">Loading projects...</div>;
    }

    if (projects.length === 0) {
        return <div className="p-4 text-xs text-gray-400">No projects found.</div>;
    }

    return (
        <SortableContext
            items={projects.map(p => p.id!)}
            strategy={verticalListSortingStrategy}
        >
            <div className="space-y-0.5 p-2">
                {projects.map((project) => (
                    <SortableItem key={project.id} id={project.id!}>
                        <ProjectItem project={project} />
                    </SortableItem>
                ))}
            </div>
        </SortableContext>
    );
};

// Extracted for cleaner click handling vs dnd
import { Project } from '../../store/schema';
import { useFilterStore } from '../../store/ui/filter-store';
import { useSettingsStore } from '../../store/ui/settings-store';
import { cn } from '../../utils/cn';
import { getDensityClass } from '../../utils/ui-utils';

const ProjectItem = React.memo<{ project: Project }>(({ project }) => {
    const { filterType, targetId, setFilter } = useFilterStore();
    const { density } = useSettingsStore();

    const isActive = filterType === 'project' && targetId === project.id;

    const { setNodeRef, isOver } = useDroppable({
        id: `project:${project.id}`,
        data: {
            type: 'project',
            value: project.id
        }
    });

    return (
        <div
            ref={setNodeRef}
            onClick={() => setFilter('project', project.id)}
            className={cn(
                "group flex items-center justify-between px-2 rounded-md cursor-pointer transition-colors select-none",
                getDensityClass(density),
                isActive
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200",
                isOver && "ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-900/50"
            )}
        >
            <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">#</span>
                <span className="text-sm truncate">{project.name}</span>
            </div>
        </div>
    );
}, (prev, next) => {
    return JSON.stringify(prev.project) === JSON.stringify(next.project);
});
