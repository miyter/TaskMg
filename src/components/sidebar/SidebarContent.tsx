import React from 'react';
import { useTranslation } from '../../core/translations';
import { BasicFilters } from './BasicFilters';
import { CustomFilterList } from './CustomFilterList';
import { DurationList } from './DurationList';
import { LabelList } from './LabelList';
import { ProjectList } from './ProjectList';
import { SidebarSearch } from './SidebarSearch';
import { SidebarSection } from './SidebarSection';
import { TargetList } from './TargetList';
import { TimeBlockList } from './TimeBlockList';

import { useModalStore } from '../../store/ui/modal-store';

export const SidebarContent: React.FC = () => {
    const { t } = useTranslation();
    const { openModal } = useModalStore();

    const sections = React.useMemo(() => [
        {
            id: 'general',
            component: (
                <>
                    <SidebarSearch />
                    <BasicFilters />
                </>
            )
        },
        {
            id: 'projects',
            title: t('projects'),
            component: <ProjectList />,
            defaultExpanded: true,
            action: (
                <button
                    onClick={() => openModal('project-edit')}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    title="プロジェクトを追加"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </button>
            )
        },
        {
            id: 'targets',
            title: t('targets'),
            component: <TargetList />,
            defaultExpanded: false
        },
        {
            id: 'labels',
            title: t('labels'),
            component: <LabelList />,
            defaultExpanded: false,
            action: (
                <button
                    onClick={() => openModal('label-edit')}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    title="ラベルを追加"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </button>
            )
        },
        {
            id: 'timeblocks',
            title: t('timeblocks'),
            component: <TimeBlockList />,
            defaultExpanded: false
        },
        {
            id: 'durations',
            title: t('durations'),
            component: <DurationList />,
            defaultExpanded: false
        },
        {
            id: 'filters',
            title: t('filters'),
            component: <CustomFilterList />,
            defaultExpanded: false
        }
    ], [t, openModal]);

    return (
        <div className="flex flex-col gap-4">
            {sections.map(section => (
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
            ))}
        </div>
    );
};
