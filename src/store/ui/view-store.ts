import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ViewType = 'tasks' | 'wizard' | 'target-dashboard' | 'wiki' | 'search' | 'dashboard';

interface ViewState {
    currentView: ViewType;
    viewData: unknown; // Optional data passed to the view (e.g., wizard mode)
    setView: (view: ViewType, data?: unknown) => void;
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
                // viewData is intentionally NOT persisted to avoid storage quota issues
            }),
        }
    )
);
