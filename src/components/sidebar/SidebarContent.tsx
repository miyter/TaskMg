import React from 'react';
import { BasicFilters } from './BasicFilters';
import { CustomFilterList } from './CustomFilterList';
import { DurationList } from './DurationList';
import { LabelList } from './LabelList';
import { ProjectList } from './ProjectList';
import { SidebarSection } from './SidebarSection';
import { TargetList } from './TargetList';
import { TimeBlockList } from './TimeBlockList';

export const SidebarContent: React.FC = () => {
    return (
        <div className="flex flex-col gap-4">
            <BasicFilters />

            <SidebarSection title="Projects">
                <ProjectList />
            </SidebarSection>

            <SidebarSection title="Targets" defaultExpanded={false}>
                <TargetList />
            </SidebarSection>

            <SidebarSection title="Labels" defaultExpanded={false}>
                <LabelList />
            </SidebarSection>

            <SidebarSection title="Time Blocks" defaultExpanded={false}>
                <TimeBlockList />
            </SidebarSection>

            <SidebarSection title="Durations" defaultExpanded={false}>
                <DurationList />
            </SidebarSection>

            <SidebarSection title="Filters" defaultExpanded={false}>
                <CustomFilterList />
            </SidebarSection>
        </div>
    );
};
