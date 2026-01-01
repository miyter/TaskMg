import React from 'react';
import { useLabels } from '../../hooks/useLabels';
import { SidebarLoadingState } from '../common/SidebarLoadingState';
import { LabelItem } from './LabelItem';

export const LabelList: React.FC = () => {
    const { labels, loading } = useLabels();

    if (loading) return <SidebarLoadingState />;
    if (labels.length === 0) return <div className="px-4 py-2 text-xs text-gray-400">ラベルはありません</div>;

    return (
        <ul className="space-y-0.5">
            {labels.map(label => (
                <LabelItem key={label.id} label={label} />
            ))}
        </ul>
    );
};
