import React from 'react';
import { useTranslation } from '../../core/translations';
import { BasicFilters } from './BasicFilters';
import { CustomFilterList } from './CustomFilterList';
import { DurationList } from './DurationList';
import { ProjectList } from './ProjectList';
import { SidebarSearch } from './SidebarSearch';
import { SidebarSection } from './SidebarSection';
import { TargetList } from './TargetList';
import { TimeBlockList } from './TimeBlockList';

import { useModalStore } from '../../store/ui/modal-store';

interface SectionDef {
    id: string;
    title: string;
    component: React.ReactNode;
    defaultExpanded: boolean;
    action?: React.ReactNode;
}

export const SidebarContent: React.FC = () => {
    const { t } = useTranslation();
    const { openModal } = useModalStore();

    const [sectionOrder, setSectionOrder] = React.useState([
        'general', 'projects', 'targets', 'timeblocks', 'durations', 'filters'
    ]);

    const sectionDefinitions = React.useMemo<Record<string, SectionDef>>(() => ({
        general: {
            id: 'general',
            title: t('general'),
            component: (
                <>
                    <SidebarSearch />
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
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </button>
            )
        },
        timeblocks: {
            id: 'timeblocks',
            title: t('timeblocks'),
            component: <TimeBlockList />,
            defaultExpanded: false
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
            defaultExpanded: false
        }
    }), [t, openModal]);

    return (
        <div className="flex flex-col gap-4">
            {sectionOrder.map(sectionId => {
                const section = sectionDefinitions[sectionId as keyof typeof sectionDefinitions];
                if (!section) return null;

                return (
                    <React.Fragment key={section.id}>
                        {section.title ? (
                            <SidebarSection
                                title={section.title}
                                defaultExpanded={section.defaultExpanded}
                                action={section.action}
                            >
                                {section.component}
                            </SidebarSection>
                        ) : (
                            section.component
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};
