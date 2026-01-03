import React from 'react';
import { useTranslation } from '../../core/translations';
import { WikiFramework } from './wiki-data';

interface WikiFrameworkCardProps {
    framework: WikiFramework;
    onClick: (framework: WikiFramework) => void;
}

export const WikiFrameworkCard: React.FC<WikiFrameworkCardProps> = React.memo(({ framework, onClick }) => {
    const { t } = useTranslation();
    return (
        <div
            className="cursor-pointer bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 transition-colors hover:border-purple-400 dark:hover:border-purple-500 group"
            onClick={() => onClick(framework)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick(framework);
                }
            }}
        >
            <div className="text-2xl mb-2">{framework.icon}</div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">{framework.title}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{framework.concept.summary}</p>
            <div className="mt-3 flex items-center text-xs text-purple-600 dark:text-purple-400 font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                <span>{t('wiki.view_details')}</span>
                <svg className="w-3 h-3 ml-1 transform transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </div>
        </div>
    );
});



