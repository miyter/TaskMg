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

    return (
        <div className="flex flex-col gap-4">
            <SidebarSearch />
            <BasicFilters />

            <SidebarSection title={t('projects')}>
                <ProjectList />
            </SidebarSection>

            <SidebarSection title={t('targets')} defaultExpanded={false}>
                <TargetList />
            </SidebarSection>

            <SidebarSection title={t('labels')} defaultExpanded={false}>
                <LabelList />
            </SidebarSection>

            <SidebarSection title={t('timeblocks')} defaultExpanded={false}>
                <TimeBlockList />
            </SidebarSection>

            <SidebarSection title={t('durations')} defaultExpanded={false}>
                <DurationList />
            </SidebarSection>

            <SidebarSection title={t('filters')} defaultExpanded={false}>
                <CustomFilterList />
            </SidebarSection>
        </div>
    );
};
