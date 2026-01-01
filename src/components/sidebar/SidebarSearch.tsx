import React from 'react';
import { useTranslation } from '../../core/translations';
import { useFilterStore } from '../../store/ui/filter-store';
import { useViewStore } from '../../store/ui/view-store';

export const SidebarSearch: React.FC = () => {
    const { t } = useTranslation();
    const { query, setFilter } = useFilterStore();
    const { currentView, setView } = useViewStore();

    const isActive = currentView === 'search';

    const handleClick = () => {
        setFilter('search');
        setView('search');
    };

    return (
        <button
            onClick={handleClick}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 group ${isActive
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400'
                }`}
            aria-label={t('sidebar.search_placeholder')}
        >
            <svg className={`w-4 h-4 transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="flex-1 text-sm font-medium">
                {query ? `"${query}"` : t('sidebar.search_placeholder')}
            </span>
            <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">/</span>
        </button>
    );
};
