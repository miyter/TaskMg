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

export const SidebarContent: React.FC = () => {
    const { t } = useTranslation();

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
            defaultExpanded: true
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
            defaultExpanded: false
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
    ], [t]);

    return (
        <div className="flex flex-col gap-4">
            {sections.map(section => (
                <React.Fragment key={section.id}>
                    {section.title ? (
                        <SidebarSection
                            title={section.title}
                            defaultExpanded={section.defaultExpanded}
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
