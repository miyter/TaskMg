import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SidebarDensity = 'compact' | 'normal' | 'comfortable' | 'spacious';

interface UIState {
    // Sidebar State
    sidebarWidth: number;
    isSidebarOpen: boolean;
    sidebarDensity: SidebarDensity;

    // Actions
    setSidebarWidth: (width: number) => void;
    toggleSidebar: () => void;
    setSidebarOpen: (isOpen: boolean) => void;
    setSidebarDensity: (density: SidebarDensity) => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            sidebarWidth: 280,
            isSidebarOpen: true,
            sidebarDensity: 'normal',

            setSidebarWidth: (width) => set({ sidebarWidth: width }),
            toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
            setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
            setSidebarDensity: (density) => set({ sidebarDensity: density }),
        }),
        {
            name: 'ui-storage', // localStorage key
            partialize: (state) => ({
                sidebarWidth: state.sidebarWidth,
                sidebarDensity: state.sidebarDensity,
                isSidebarOpen: state.isSidebarOpen // open state is also persisted
            }),
        }
    )
);
