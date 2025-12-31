import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ViewType = 'tasks' | 'wizard' | 'target-dashboard' | 'wiki' | 'search';

interface ViewState {
    currentView: ViewType;
    viewData: any; // Optional data passed to the view (e.g., wizard mode)
    setView: (view: ViewType, data?: any) => void;
}

export const useViewStore = create<ViewState>()(
    persist(
        (set) => ({
            currentView: 'tasks',
            viewData: null,
            setView: (view, data = null) => set({ currentView: view, viewData: data }),
        }),
        {
            name: 'view-storage',
            partialize: (state) => ({
                currentView: state.currentView,
                viewData: state.viewData
            }),
        }
    )
);
