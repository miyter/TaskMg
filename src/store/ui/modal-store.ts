import { create } from 'zustand';

export type ModalType = 'settings' | 'task-detail' | 'create-project' | null;

interface ModalState {
    activeModal: ModalType;
    modalData: any;
    openModal: (type: ModalType, data?: any) => void;
    closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
    activeModal: null,
    modalData: null,
    openModal: (type, data = null) => set({ activeModal: type, modalData: data }),
    closeModal: () => set({ activeModal: null, modalData: null }),
}));

// --- 非Reactコード用ヘルパー ---
// Vanilla TS (ui/) からモーダルを開くためのユーティリティ

/**
 * タスク詳細モーダルを開く（非React用）
 */
export function openTaskDetailModal(task: any) {
    useModalStore.getState().openModal('task-detail', task);
}

/**
 * モーダルを閉じる（非React用）
 */
export function closeModalDirect() {
    useModalStore.getState().closeModal();
}
