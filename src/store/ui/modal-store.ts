import { create } from 'zustand';
import { Filter, Label, Project, Task, TimeBlock, Workspace } from '../schema';

export type ModalType = 'settings' | 'task-detail' | 'create-project' | 'label-edit' | 'project-edit' | 'workspace-edit' | 'filter-edit' | 'timeblock-edit' | 'wiki-framework' | null;

export type ModalData = Partial<Task> | Partial<Project> | Partial<Label> | Partial<Workspace> | Partial<Filter> | Partial<TimeBlock> | null;

export interface ModalInstance {
    id: string;
    type: ModalType;
    data: ModalData;
}

interface ModalState {
    stack: ModalInstance[];
    openModal: (type: ModalType, data?: ModalData) => void;
    closeModal: () => void;
    closeAllModals: () => void;
}

import { generateId } from '../../utils/uuid';

export const useModalStore = create<ModalState>((set) => ({
    stack: [],
    openModal: (type, data = null) => {
        if (!type) return;
        const id = generateId();
        set((state) => ({
            stack: [...state.stack, { id, type, data }]
        }));
    },
    closeModal: () => set((state) => {
        if (state.stack.length === 0) return state;
        const newStack = state.stack.slice(0, -1);
        return {
            stack: newStack
        };
    }),
    closeAllModals: () => set({ stack: [] }),
}));

// --- Helper functions for non-React code are removed to ensure React-lifecycle safety ---
// If access from outside React is needed, use `useModalStore.getState().openModal` explicitly.
