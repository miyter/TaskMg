import { create } from 'zustand';
import { Filter, Label, Project, Task, TimeBlock, Workspace } from '../schema';

export type ModalType = 'settings' | 'task-detail' | 'label-edit' | 'project-edit' | 'workspace-edit' | 'filter-edit' | 'timeblock-edit' | 'wiki-framework' | 'confirmation';

export interface ConfirmationData {
    title: string;
    message: string;
    onConfirm: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'primary';
}

// Discriminated Union for internal type safety
export type ModalInstance =
    | { id: string; type: 'settings'; data?: null }
    | { id: string; type: 'task-detail'; data: Partial<Task> }
    | { id: string; type: 'label-edit'; data: Partial<Label> }
    | { id: string; type: 'project-edit'; data: Partial<Project> }
    | { id: string; type: 'workspace-edit'; data: Partial<Workspace> }
    | { id: string; type: 'filter-edit'; data: Partial<Filter> }
    | { id: string; type: 'timeblock-edit'; data: Partial<TimeBlock> }
    | { id: string; type: 'wiki-framework'; data?: any }
    | { id: string; type: 'confirmation'; data: ConfirmationData };

// Union for argument type
export type ModalData = Partial<Task> | Partial<Project> | Partial<Label> | Partial<Workspace> | Partial<Filter> | Partial<TimeBlock> | ConfirmationData | null;

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
        // @ts-ignore: Dynamic construction of discriminated union
        const newModal: ModalInstance = { id, type, data };

        set((state) => ({
            stack: [...state.stack, newModal]
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
