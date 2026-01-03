import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../core/translations';
import { useFilterStore } from '../../store/ui/filter-store';
import { useViewStore } from '../../store/ui/view-store';
import { IconChevronLeft, IconSearch, IconX } from '../common/Icons';
import { TaskList } from '../tasks/TaskList';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

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
        }, 150);

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
        <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            {/* Search Header - Premium Glassmorphism Design */}
            <div className="relative p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800">
                {/* Background Gradient Orb */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -z-0" />

                <div className="relative z-10 max-w-3xl mx-auto">
                    {/* Close Button + Title */}
                    <div className="flex items-center gap-3 mb-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleClose}
                            className="rounded-xl transition-all hover:scale-105 active:scale-95"
                            aria-label={t('close')}
                        >
                            <IconChevronLeft className="w-5 h-5 text-gray-500" />
                        </Button>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t('sidebar.search_placeholder')}
                        </h1>
                    </div>

                    {/* Search Input - Glassmorphism Wrapper around our standard Input */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        <Input
                            ref={inputRef}
                            id="search-input"
                            name="search"
                            type="text"
                            value={localQuery}
                            onChange={handleChange}
                            placeholder={t('sidebar.search_placeholder')}
                            className="py-4 text-base bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-black/20"
                            leftIcon={<IconSearch className="w-5 h-5" />}
                            rightIcon={localQuery ? (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors pointer-events-auto"
                                    aria-label={t('clear')}
                                >
                                    <IconX className="w-5 h-5" />
                                </button>
                            ) : undefined}
                        />
                    </div>

                    {/* Search Tips */}
                    {!localQuery && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 font-mono">/</kbd>
                            <span>{t('search_view.tips')}</span>
                        </div>
                    )}

                    {/* Result Count */}
                    {localQuery && (
                        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            {t('search_view.results_for', { query: localQuery })}
                        </p>
                    )}
                </div>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-hidden">
                {localQuery ? (
                    <TaskList />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 p-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-2xl" />
                            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center mb-6">
                                <IconSearch className="w-12 h-12 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
                            </div>
                        </div>
                        <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">{t('search_view.empty_title')}</p>
                        <p className="text-sm text-center max-w-xs opacity-75" dangerouslySetInnerHTML={{ __html: t('search_view.empty_desc') }} />
                    </div>
                )}
            </div>
        </div>
    );
};




