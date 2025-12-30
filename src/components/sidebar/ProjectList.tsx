import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React from 'react';
import { useProjects } from '../../hooks/useProjects';
import { SortableItem } from '../common/SortableItem';

export const ProjectList: React.FC = () => {
    const { projects, loading } = useProjects();

    // In a real app, you would have a local state or store action to handle reorder updates
    // const [items, setItems] = useState(projects); 
    // For now, we just use the fetched projects.

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            console.log('Dragged', active.id, 'to', over?.id);
            // Here you would call a function to update the order in the backend/store
            // e.g. reorderProjects(active.id, over.id);
        }
    };

    if (loading) {
        return <div className="p-4 text-xs text-gray-400">Loading projects...</div>;
    }

    if (projects.length === 0) {
        return <div className="p-4 text-xs text-gray-400">No projects found.</div>;
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={projects.map(p => p.id!)} // Use non-null assertion or filter undefined IDs in hook
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
        </DndContext>
    );
};

// Extracted for cleaner click handling vs dnd
import { Project } from '../../store/schema';
import { useFilterStore } from '../../store/ui/filter-store';
import { cn } from '../../utils/cn';

const ProjectItem: React.FC<{ project: Project }> = ({ project }) => {
    const { filterType, targetId, setFilter } = useFilterStore();
    const isActive = filterType === 'project' && targetId === project.id;

    return (
        <div
            onClick={() => setFilter('project', project.id)}
            className={cn(
                "group flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-colors select-none",
                isActive
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            )}
        >
            <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">#</span>
                <span className="text-sm truncate">{project.name}</span>
            </div>
        </div>
    );
};
