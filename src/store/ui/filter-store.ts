import { create } from 'zustand';

import { persist } from 'zustand/middleware';

export type FilterType = 'inbox' | 'today' | 'upcoming' | 'important' | 'project' | 'label' | 'search' | 'all' | 'timeblock' | 'duration' | 'custom' | 'wizard' | 'target-dashboard' | 'wiki';

interface FilterState {
    filterType: FilterType;
    targetId: string | null;  // projectId, labelId, etc.
    query: string;           // Search query

    // Actions
    setFilter: (type: FilterType, id?: string | null) => void;
    setSearchQuery: (query: string) => void;
    clearFilter: () => void;
}

export const useFilterStore = create<FilterState>()(
    persist(
        (set) => ({
            filterType: 'inbox',
            targetId: null,
            query: '',

            setFilter: (type, id = null) => set({ filterType: type, targetId: id, query: '' }),
            setSearchQuery: (query) => set({ query, filterType: 'search' }),
            clearFilter: () => set({ filterType: 'all', targetId: null, query: '' }),
        }),
        {
            name: 'filter-storage',
            partialize: (state) => ({ filterType: state.filterType, targetId: state.targetId }),
        }
    )
);
