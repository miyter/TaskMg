import React from 'react';
import { WikiFramework } from '../wiki-data';

interface WikiFrameworkCardProps {
    framework: WikiFramework;
    onClick: (framework: WikiFramework) => void;
}

export const WikiFrameworkCard: React.FC<WikiFrameworkCardProps> = React.memo(({ framework, onClick }) => {
    return (
        <div
            className="framework-card cursor-pointer bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:scale-105 group"
            onClick={() => onClick(framework)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick(framework);
                }
            }}
        >
            <div className="text-4xl mb-3 transform transition-transform group-hover:scale-110 duration-300">{framework.icon}</div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{framework.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 h-10">{framework.concept.summary}</p>
            <div className="mt-4 flex items-center text-xs text-blue-600 dark:text-blue-400 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                <span>詳細を見る</span>
                <svg className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </div>
        </div>
    );
});
