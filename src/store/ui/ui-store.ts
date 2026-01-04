import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { SidebarDensity, UI_CONFIG } from '../../core/ui-constants';

// export type SidebarDensity = 'compact' | 'normal' | 'comfortable' | 'spacious';

interface UIState {
    // Sidebar State
    sidebarWidth: number;
    isSidebarOpen: boolean;
    sidebarDensity: SidebarDensity;
    sidebarSections: string[];

    // Actions
    setSidebarWidth: (width: number) => void;
    toggleSidebar: () => void;
    setSidebarOpen: (isOpen: boolean) => void;
    setSidebarDensity: (density: SidebarDensity) => void;
    setSidebarSections: (sections: string[]) => void;
}

/** Mobile breakpoint for sidebar auto-close */
const MOBILE_BREAKPOINT = 1024; // lg breakpoint

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            sidebarWidth: UI_CONFIG.SIDEBAR.DEFAULT_WIDTH,
            isSidebarOpen: true,
            sidebarDensity: 'normal',
            sidebarSections: ['general', 'projects', 'targets', 'timeblocks', 'durations', 'filters'],

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
            setSidebarSections: (sections) => set({ sidebarSections: sections }),
        }),
        {
            name: 'ui-storage', // localStorage key
            partialize: (state) => ({
                sidebarWidth: state.sidebarWidth,
                sidebarDensity: state.sidebarDensity,
                isSidebarOpen: state.isSidebarOpen,
                sidebarSections: state.sidebarSections
            }),
            onRehydrateStorage: () => (state) => {
                // On mobile, always close sidebar after rehydration to prevent layout issues
                if (typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT) {
                    state?.setSidebarOpen(false);
                }

                // Ensure sidebarSections integrity
                const DEFAULT_SECTIONS = ['general', 'projects', 'targets', 'timeblocks', 'durations', 'filters'];
                if (state && (!state.sidebarSections || !Array.isArray(state.sidebarSections) || state.sidebarSections.length === 0)) {
                    state.sidebarSections = DEFAULT_SECTIONS;
                } else if (state) {
                    // Merge missing sections
                    const current = new Set(state.sidebarSections);
                    const missing = DEFAULT_SECTIONS.filter(s => !current.has(s));
                    if (missing.length > 0) {
                        // Insert missing at logic places? Or just append.
                        if (missing.includes('general')) state.sidebarSections = ['general', ...state.sidebarSections];
                        else state.sidebarSections = [...state.sidebarSections, ...missing];
                    }
                }
            },
        }
    )
);
