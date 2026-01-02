import React from 'react';
import { useTranslation } from '../../core/translations';
import { useViewStore } from '../../store/ui/view-store';

import { IconDashboard, IconWiki, IconWizard } from '../common/Icons';
import { SidebarItem } from './SidebarItem';


export const TargetList: React.FC = () => {
    const { t } = useTranslation();
    const { currentView, setView } = useViewStore();

    return (
        <div className="space-y-0.5 py-1">
            <SidebarItem
                label={t('sidebar.target_wizard')}

                icon={<IconWizard />}
                isActive={currentView === 'wizard'}
                onClick={() => setView('wizard')}
            />
            <SidebarItem
                label={t('sidebar.target_dashboard')}

                icon={<IconDashboard />}
                isActive={currentView === 'target-dashboard'}
                onClick={() => setView('target-dashboard')}
            />
            <SidebarItem
                label={t('sidebar.framework_wiki')}

                icon={<IconWiki />}
                isActive={currentView === 'wiki'}
                onClick={() => setView('wiki')}
            />

        </div>
    );
};



