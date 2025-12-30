import React, { useState } from 'react';
import { MOCK_DATA } from '../dashboard-data';
import { DashboardHeader } from './DashboardHeader';
import { BackwardView } from './views/BackwardView';
import { OkrView } from './views/OkrView';
import { WoopView } from './views/WoopView';

export const DashboardApp: React.FC = () => {
    const [currentTab, setCurrentTab] = useState('backward');
    const [collapsed, setCollapsed] = useState(false);

    const renderContent = () => {
        switch (currentTab) {
            case 'backward':
                return <BackwardView data={MOCK_DATA.backward} />;
            case 'woop':
                return <WoopView data={MOCK_DATA.woop} />;
            case 'okr':
                return <OkrView data={MOCK_DATA.okr} />;
            default:
                return null;
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <DashboardHeader
                kgi={MOCK_DATA.kgi}
                currentTab={currentTab}
                onTabChange={setCurrentTab}
                collapsed={collapsed}
                onToggleCollapse={() => setCollapsed(!collapsed)}
            />
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
                {renderContent()}
            </div>
        </div>
    );
};
