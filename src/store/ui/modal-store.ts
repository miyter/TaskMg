import { create } from 'zustand';
import { Filter, Label, Project, Task, TimeBlock, Workspace } from '../schema';

export type ModalType = 'settings' | 'task-detail' | 'create-project' | 'label-edit' | 'project-edit' | 'workspace-edit' | 'filter-edit' | 'timeblock-edit' | 'wiki-framework' | null;

export type ModalData = Task | Project | Label | Workspace | Filter | TimeBlock | any;

interface ModalState {
    activeModal: ModalType;
    modalData: ModalData;
    openModal: (type: ModalType, data?: ModalData) => void;
    closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
    activeModal: null,
    modalData: null,
    openModal: (type, data = null) => set({ activeModal: type, modalData: data }),
    closeModal: () => set({ activeModal: null, modalData: null }),
}));

// --- Helper functions for non-React code ---

/**
 * モーダルを開く
 */
export const openModal = (type: ModalType, data: ModalData = null) => {
    useModalStore.getState().openModal(type, data);
};

/**
 * モーダルを閉じる
 */
export const closeModal = () => {
    useModalStore.getState().closeModal();
};

// Compatibility alias
export const openModalDirect = openModal;
export const closeModalDirect = closeModal;
