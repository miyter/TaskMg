import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../core/translations';
import { useFilterStore } from '../../store/ui/filter-store';
import { useViewStore } from '../../store/ui/view-store';
import { TaskList } from '../tasks/TaskList';

export const SearchView: React.FC = () => {
    const { t } = useTranslation();
    const { query, setSearchQuery, setFilter } = useFilterStore();
    const { setView } = useViewStore();
    const [localQuery, setLocalQuery] = useState(query);
    const inputRef = useRef<HTMLInputElement>(null);

    // 初回マウント時にフォーカス
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // ストアのqueryが変わったときは追従
    useEffect(() => {
        if (query !== localQuery) {
            setLocalQuery(query);
        }
    }, [query]);

    // Debounce処理
    useEffect(() => {
        const handler = setTimeout(() => {
            if (localQuery !== query) {
                setSearchQuery(localQuery);
            }
        }, 150); // 150ms for faster response

        return () => {
            clearTimeout(handler);
        };
    }, [localQuery, query, setSearchQuery]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalQuery(e.target.value);
    };

    const handleClear = () => {
        setLocalQuery('');
        setSearchQuery('');
        inputRef.current?.focus();
    };

    const handleClose = () => {
        setSearchQuery('');
        setFilter('inbox');
        setView('tasks');
    };

    return (
        <div className="flex flex-col h-full">
            {/* Search Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-white/50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        aria-label={t('close')}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            value={localQuery}
                            onChange={handleChange}
                            placeholder={t('sidebar.search_placeholder')}
                            className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl py-3 pl-10 pr-10 text-base text-gray-800 dark:text-gray-100 placeholder-gray-500 outline-none transition-all shadow-sm"
                        />
                        {localQuery && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                aria-label={t('clear')}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
                {localQuery && (
                    <p className="mt-2 ml-12 text-sm text-gray-600 dark:text-gray-400">
                        「{localQuery}」の検索結果
                    </p>
                )}
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-hidden">
                {localQuery ? (
                    <TaskList />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="text-lg">{t('sidebar.search_placeholder')}</p>
                        <p className="text-sm mt-1 opacity-75">タスク名、説明、プロジェクト名等で検索できます</p>
                    </div>
                )}
            </div>
        </div>
    );
};
