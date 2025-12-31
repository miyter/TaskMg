import { create } from 'zustand';

import { persist } from 'zustand/middleware';
import { SortCriteria } from '../../logic/sort';

export type FilterType = 'inbox' | 'today' | 'upcoming' | 'important' | 'project' | 'label' | 'search' | 'all' | 'timeblock' | 'duration' | 'custom';

interface FilterState {
    filterType: FilterType;
    targetId: string | null;  // projectId, labelId, etc.
    query: string;           // Search query

    // View Options
    showCompleted: boolean;
    sortCriteria: SortCriteria; // 'createdAt_desc', 'dueDate_asc', etc.

    // Actions
    setFilter: (type: FilterType, id?: string | null) => void;
    setSearchQuery: (query: string) => void;
    clearFilter: () => void;
    setShowCompleted: (show: boolean) => void;
    setSortCriteria: (criteria: SortCriteria) => void;
}

export const useFilterStore = create<FilterState>()(
    persist(
        (set) => ({
            filterType: 'inbox',
            targetId: null,
            query: '',
            showCompleted: false,
            sortCriteria: 'createdAt_desc',

            setFilter: (type, id = null) => set({ filterType: type, targetId: id, query: '' }),
            setSearchQuery: (query) => set({ query, filterType: 'search' }),
            clearFilter: () => set({ filterType: 'inbox', targetId: null, query: '' }),
            setShowCompleted: (show) => set({ showCompleted: show }),
            setSortCriteria: (criteria) => set({ sortCriteria: criteria }),
        }),
        {
            name: 'filter-storage',
            partialize: (state) => ({
                filterType: state.filterType,
                targetId: state.targetId,
                showCompleted: state.showCompleted,
                sortCriteria: state.sortCriteria
            }),
        }
    )
);
