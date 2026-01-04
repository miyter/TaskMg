import React, { useState } from 'react';
import { useTranslation } from '../../core/translations';
import { useTargets } from '../../hooks/useTargets';
import { Target } from '../../store/schema';
import { ensureDate } from '../../utils/date-tz';
import { DashboardHeader } from './DashboardHeader';
import { BackwardData, OkrData, WoopData } from './dashboard-types';
import { BackwardView } from './views/BackwardView';
import { OkrView } from './views/OkrView';
import { WoopView } from './views/WoopView';

export const DashboardApp: React.FC = () => {
    const { t } = useTranslation();
    const { targets } = useTargets();
    const [currentTab, setCurrentTab] = useState('backward');
    const [collapsed, setCollapsed] = useState(false);

    // Filter targets by mode (case-insensitive)
    const filteredTargets = targets.filter(t => t.mode?.toLowerCase() === currentTab.toLowerCase());

    // Transformer Functions
    const transformBackward = (target: Target): BackwardData => ({
        milestones: [
            { date: t('target_dashboard.backward.timeline.future'), title: target.data.goal_kgi || t('target_dashboard.kgi_default'), type: 'goal', completed: false },
            { date: t('target_dashboard.backward.timeline.milestone'), title: target.data.milestone_minus_1mo || '', type: 'milestone', completed: false },
            { date: t('target_dashboard.backward.timeline.today'), title: t('target_dashboard.backward.current_status'), type: 'current', completed: true },
            { date: t('target_dashboard.backward.timeline.now'), title: target.data.first_action || '', type: 'action', completed: false }
        ]
    });

    const transformWoop = (target: Target): WoopData => ({
        wish: target.data.wish || '',
        outcome: target.data.outcome || '',
        obstacles: [
            {
                id: 1,
                text: target.data.obstacle || '',
                plan: target.data.plan || '',
                overcomeCount: 0
            }
        ]
    });

    const transformOkr = (target: Target): OkrData => ({
        objective: target.data.objective || '',
        keyResults: [
            { id: 1, text: target.data.kr_1 || `${t('target_dashboard.okr.kr_prefix')}1`, current: 0, target: 100, confidence: 'medium' },
            { id: 2, text: target.data.kr_2 || `${t('target_dashboard.okr.kr_prefix')}2`, current: 0, target: 100, confidence: 'medium' },
            { id: 3, text: target.data.kr_3 || `${t('target_dashboard.okr.kr_prefix')}3`, current: 0, target: 100, confidence: 'medium' }
        ]
    });

    const renderContent = () => {
        if (filteredTargets.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                    <p className="mb-4">{t('target_dashboard.no_targets', { mode: currentTab.toUpperCase() })}</p>
                </div>
            );
        }

        return (
            <div className="space-y-12">
                {filteredTargets.map((target) => (
                    <div key={target.id} className="border-b border-gray-200 dark:border-gray-700 pb-12 last:border-0">
                        {/* Show creation date */}
                        <div className="mb-4 text-xs text-gray-400 flex justify-end">
                            {t('target_dashboard.created_at', { date: ensureDate(target.createdAt)?.toLocaleDateString() || 'Unknown' })}
                        </div>

                        {currentTab === 'backward' && <BackwardView data={transformBackward(target)} />}
                        {currentTab === 'woop' && <WoopView data={transformWoop(target)} />}
                        {currentTab === 'okr' && <OkrView data={transformOkr(target)} />}
                    </div>
                ))}
            </div>
        );
    };

    // Dynamic Header KGI Logic
    // Select the most relevant target to display in the header (e.g., the first one in the list, or a "Main" one)
    const selectedTarget = filteredTargets[0];

    // Helper to extract a title based on mode
    const getTargetTitle = (t_obj: Target | undefined, mode: string) => {
        if (!t_obj) return t('target_dashboard.title_default');
        if (mode === 'backward') return t_obj.data.goal_kgi || t('target_dashboard.kgi_default');
        if (mode === 'woop') return t_obj.data.wish || t('target_dashboard.wish_default');
        if (mode === 'okr') return t_obj.data.objective || t('target_dashboard.obj_default');
        return t('target_dashboard.target_default');
    };

    const headerKgi = {
        title: getTargetTitle(selectedTarget, currentTab),
        progress: Number(selectedTarget?.data?.progress || 0), // Assuming progress might exist in data, or calc
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
