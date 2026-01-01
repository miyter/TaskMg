import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../core/translations';
import { useFilterStore } from '../../store/ui/filter-store';


export const SidebarSearch: React.FC = () => {
    const INPUT_CLASSES = "w-full bg-gray-100 dark:bg-gray-700/50 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-gray-700 rounded-lg py-1.5 pl-9 pr-8 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 outline-none transition-all";

    const { t } = useTranslation();

    const { query, setSearchQuery } = useFilterStore();
    const [localQuery, setLocalQuery] = useState(query);
    const inputRef = useRef<HTMLInputElement>(null);

    // 同期: ストアのqueryが変わったときは追従 (外部からの変更に対応)
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
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [localQuery, query, setSearchQuery]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchQuery(localQuery);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocalQuery(val);
    };

    const handleClear = () => {
        setLocalQuery('');
        setSearchQuery('');
        inputRef.current?.focus();
    };

    return (
        <form onSubmit={handleSubmit} className="px-3 mb-2">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <label htmlFor="page-search-input" className="sr-only">サイドバー検索</label>
                <input
                    ref={inputRef}
                    id="page-search-input"
                    type="text"
                    placeholder={t('sidebar.search_placeholder')}

                    value={localQuery}
                    onChange={handleChange}

                    className={INPUT_CLASSES}
                />

                {localQuery && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </form>
    );
};
