import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';
import { useTranslation } from '../../core/translations';
import { useModalStore } from '../../store/ui/modal-store';
import { useUIStore } from '../../store/ui/ui-store';
import { BasicFilters } from './BasicFilters';
import { CustomFilterList } from './CustomFilterList';
import { DurationList } from './DurationList';
import { ProjectList } from './ProjectList';
import { SidebarSection } from './SidebarSection';
import { TargetList } from './TargetList';
import { TimeBlockList } from './TimeBlockList';


interface SectionDef {
    id: string;
    title: string;
    component: React.ReactNode;
    defaultExpanded: boolean;
    action?: React.ReactNode;
}

// --- Sortable Section Wrapper ---
interface SortableSectionProps {
    id: string;
    section: SectionDef;
}

const SortableSection: React.FC<SortableSectionProps> = ({ id, section }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <SidebarSection
                title={section.title}
                defaultExpanded={section.defaultExpanded}
                action={section.action}
                dragHandleProps={listeners}
            >
                {section.component}
            </SidebarSection>
        </div>
    );
};

export const SidebarContent: React.FC = () => {
    const { t } = useTranslation();
    const { openModal } = useModalStore();
    const { sidebarSections } = useUIStore();

    // Determine the order to render. Fallback to default if empty (though store should handle it)
    const renderOrder = sidebarSections && sidebarSections.length > 0
        ? sidebarSections
        : ['general', 'projects', 'targets', 'timeblocks', 'durations', 'filters'];

    const sectionDefinitions = React.useMemo<Record<string, SectionDef>>(() => ({
        general: {
            id: 'general',
            title: t('general'),
            component: (
                <>
                    <BasicFilters />
                </>
            ),
            defaultExpanded: true
        },
        projects: {
            id: 'projects',
            title: t('projects'),
            component: <ProjectList />,
            defaultExpanded: true,
            action: (
                <button
                    onClick={() => openModal('project-edit')}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    title={t('add')}
                    aria-label={t('add')}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </button>
            )
        },
        targets: {
            id: 'targets',
            title: t('targets'),
            component: <TargetList />,
            defaultExpanded: false,
            action: (
                <button
                    onClick={() => openModal('wiki-framework')}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    title={t('add')}
                    aria-label={t('add')}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </button>
            )
        },
        timeblocks: {
            id: 'timeblocks',
            title: t('timeblocks'),
            component: <TimeBlockList />,
            defaultExpanded: false,
            action: (
                <button
                    onClick={() => openModal('timeblock-edit')}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    title={t('add')}
                    aria-label={t('add')}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </button>
            )
        },
        durations: {
            id: 'durations',
            title: t('durations'),
            component: <DurationList />,
            defaultExpanded: false
        },
        filters: {
            id: 'filters',
            title: t('filters'),
            component: <CustomFilterList />,
            defaultExpanded: false,
            action: (
                <button
                    onClick={() => openModal('filter-edit')}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    title={t('add')}
                    aria-label={t('add')}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </button>
            )
        }
    }), [t, openModal]);

    return (
        <SortableContext
            items={renderOrder}
            strategy={verticalListSortingStrategy}
        >
            <div className="flex flex-col gap-4">
                {renderOrder.map(sectionId => {
                    const section = sectionDefinitions[sectionId];
                    if (!section) return null;

                    return (
                        <SortableSection
                            key={section.id}
                            id={section.id}
                            section={section}
                        />
                    );
                })}
            </div>
        </SortableContext>
    );
};



