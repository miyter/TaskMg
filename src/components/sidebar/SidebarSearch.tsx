import React, { useEffect, useRef, useState } from 'react';
import { useFilterStore } from '../../store/ui/filter-store';

export const SidebarSearch: React.FC = () => {
    const { query, setSearchQuery, setFilter } = useFilterStore();
    const [localQuery, setLocalQuery] = useState(query);
    const inputRef = useRef<HTMLInputElement>(null);

    // 同期: ストアのqueryが変わったときは追従
    useEffect(() => {
        setLocalQuery(query);
    }, [query]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchQuery(localQuery);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocalQuery(val);
    };

    return (
        <form onSubmit={handleSubmit} className="px-3 mb-2">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    ref={inputRef}
                    id="page-search-input"
                    type="text"
                    placeholder="検索 (/)"
                    value={localQuery}
                    onChange={handleChange}
                    onBlur={() => setSearchQuery(localQuery)}
                    className="w-full bg-gray-100 dark:bg-gray-700/50 border border-transparent focus:border-blue-500/50 focus:bg-white dark:focus:bg-gray-700 rounded-lg py-1.5 pl-9 pr-3 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 outline-none transition-all"
                />
            </div>
        </form>
    );
};
