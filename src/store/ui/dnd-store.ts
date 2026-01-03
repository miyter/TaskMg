import { create } from 'zustand';

interface DnDState {
    onTasksReorder: ((activeId: string, overId: string) => void) | null;
    setTasksReorderHandler: (handler: ((activeId: string, overId: string) => void) | null) => void;
}

export const useDnDStore = create<DnDState>((set) => ({
    onTasksReorder: null,
    setTasksReorderHandler: (handler) => set({ onTasksReorder: handler }),
}));
