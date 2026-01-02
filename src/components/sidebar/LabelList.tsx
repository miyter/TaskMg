import React from 'react';
import { getTranslator } from '../../core/translations';
import { useLabels } from '../../hooks/useLabels';
import { useSettingsStore } from '../../store/ui/settings-store';
import { SidebarLoadingState } from '../common/SidebarLoadingState';
import { LabelItem } from './LabelItem';

export const LabelList: React.FC = () => {
    const { labels, loading } = useLabels();
    const language = useSettingsStore(s => s.language);
    const { t } = getTranslator(language);

    if (loading) return <SidebarLoadingState />;
    if (labels.length === 0) return <div className="px-4 py-2 text-xs text-gray-400">{t('sidebar.no_labels')}</div>;

    return (
        <ul className="space-y-0.5">
            {labels.map(label => (
                <LabelItem key={label.id} label={label} />
            ))}
        </ul>
    );
};
