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
    activeModal: ModalType; // Compat
    modalData: ModalData;   // Compat
    openModal: (type: ModalType, data?: ModalData) => void;
    closeModal: () => void;
    closeAllModals: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
    stack: [],
    activeModal: null, // @deprecated: Use stack for new components
    modalData: null,   // @deprecated: Use stack for new components
    openModal: (type, data = null) => {
        if (!type) return;
        const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7);
        set((state) => ({
            stack: [...state.stack, { id, type, data }],
            activeModal: type,
            modalData: data
        }));
    },
    closeModal: () => set((state) => {
        if (state.stack.length === 0) return state;
        const newStack = state.stack.slice(0, -1);
        const top = newStack[newStack.length - 1];
        return {
            stack: newStack,
            activeModal: top ? top.type : null,
            modalData: top ? top.data : null
        };
    }),
    closeAllModals: () => set({ stack: [], activeModal: null, modalData: null }),
}));

// --- Helper functions for non-React code are removed to ensure React-lifecycle safety ---
// If access from outside React is needed, use `useModalStore.getState().openModal` explicitly.
