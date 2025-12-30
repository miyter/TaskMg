import React, { useState } from 'react';
import { useTargets } from '../../hooks/useTargets';
import { Target } from '../../store/schema';
import { DashboardHeader } from './DashboardHeader';
import { BackwardData, OkrData, WoopData } from './dashboard-types';
import { BackwardView } from './views/BackwardView';
import { OkrView } from './views/OkrView';
import { WoopView } from './views/WoopView';

export const DashboardApp: React.FC = () => {
    const { targets } = useTargets();
    const [currentTab, setCurrentTab] = useState('backward');
    const [collapsed, setCollapsed] = useState(false);

    // Filter targets by mode
    const filteredTargets = targets.filter(t => t.mode === currentTab);

    // Transformer Functions
    const transformBackward = (t: Target): BackwardData => ({
        milestones: [
            { date: 'Future', title: t.data.goal_kgi || 'Undefined Goal', type: 'goal', completed: false },
            { date: 'Milestone', title: t.data.milestone_minus_1mo || '', type: 'milestone', completed: false },
            { date: 'Today', title: 'Current Status', type: 'current', completed: true },
            { date: 'Now', title: t.data.first_action || '', type: 'action', completed: false }
        ]
    });

    const transformWoop = (t: Target): WoopData => ({
        wish: t.data.wish || '',
        outcome: t.data.outcome || '',
        obstacles: [
            {
                id: 1,
                text: t.data.obstacle || '',
                plan: t.data.plan || '',
                overcomeCount: 0
            }
        ]
    });

    const transformOkr = (t: Target): OkrData => ({
        objective: t.data.objective || '',
        keyResults: [
            { id: 1, text: t.data.kr_1 || 'KR 1', current: 0, target: 100, confidence: 'medium' },
            { id: 2, text: t.data.kr_2 || 'KR 2', current: 0, target: 100, confidence: 'medium' },
            { id: 3, text: t.data.kr_3 || 'KR 3', current: 0, target: 100, confidence: 'medium' }
        ]
    });

    const formatDate = (date: any) => {
        if (!date) return 'Unknown';
        if (typeof date.toDate === 'function') return date.toDate().toLocaleDateString();
        if (date instanceof Date) return date.toLocaleDateString();
        return String(date);
    };

    const renderContent = () => {
        if (filteredTargets.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                    <p className="mb-4">No {currentTab.toUpperCase()} targets found.</p>
                </div>
            );
        }

        return (
            <div className="space-y-12">
                {filteredTargets.map((target) => (
                    <div key={target.id} className="border-b border-gray-200 dark:border-gray-700 pb-12 last:border-0">
                        {/* Show creation date */}
                        <div className="mb-4 text-xs text-gray-400 flex justify-end">
                            Created: {formatDate(target.createdAt)}
                        </div>

                        {currentTab === 'backward' && <BackwardView data={transformBackward(target)} />}
                        {currentTab === 'woop' && <WoopView data={transformWoop(target)} />}
                        {currentTab === 'okr' && <OkrView data={transformOkr(target)} />}
                    </div>
                ))}
            </div>
        );
    };

    // Dummy KGI for header (using first backward target if available, or placeholder)
    const firstBackward = targets.find(t => t.mode === 'backward');
    const headerKgi = {
        title: firstBackward?.data.goal_kgi || "目標を設定して、進捗を可視化しましょう",
        progress: 0,
        daysLeft: 0, // Would need real date calc
        status: 'good' as const
    };

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <DashboardHeader
                kgi={headerKgi}
                currentTab={currentTab}
                onTabChange={setCurrentTab}
                collapsed={collapsed}
                onToggleCollapse={() => setCollapsed(!collapsed)}
            />
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 pt-4">
                {renderContent()}
            </div>
        </div>
    );
};
