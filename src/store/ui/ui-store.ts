import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { SidebarDensity, UI_CONFIG } from '../../core/ui-constants';

// export type SidebarDensity = 'compact' | 'normal' | 'comfortable' | 'spacious';

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
            sidebarWidth: UI_CONFIG.SIDEBAR.DEFAULT_WIDTH,
            isSidebarOpen: true,
            sidebarDensity: 'normal',

            setSidebarWidth: (width) => {
                const clamped = Math.max(
                    UI_CONFIG.SIDEBAR.MIN_WIDTH,
                    Math.min(width, UI_CONFIG.SIDEBAR.MAX_WIDTH)
                );
                set({ sidebarWidth: clamped });
            },
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
