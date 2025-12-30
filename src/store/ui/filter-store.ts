import { create } from 'zustand';

export type FilterType = 'inbox' | 'today' | 'upcoming' | 'important' | 'project' | 'label' | 'search' | 'all';

interface FilterState {
    filterType: FilterType;
    targetId: string | null;  // projectId or labelId
    query: string;           // Search query

    // Actions
    setFilter: (type: FilterType, id?: string | null) => void;
    setSearchQuery: (query: string) => void;
    clearFilter: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
    filterType: 'inbox', // Default
    targetId: null,
    query: '',

    setFilter: (type, id = null) => set({ filterType: type, targetId: id, query: '' }),
    setSearchQuery: (query) => set({ query, filterType: 'search' }),
    clearFilter: () => set({ filterType: 'all', targetId: null, query: '' }),
}));
