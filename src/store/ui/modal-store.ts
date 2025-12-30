import { create } from 'zustand';

export type ModalType = 'settings' | 'task-detail' | 'create-project' | 'label-edit' | 'project-edit' | 'workspace-edit' | 'filter-edit' | 'timeblock-edit' | null;

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
 * 設定モーダルを開く（非React用）
 */
export function openSettingsModal() {
    useModalStore.getState().openModal('settings');
}

/**
 * タスク詳細モーダルを開く（非React用）
 */
export function openTaskDetailModal(task: any) {
    useModalStore.getState().openModal('task-detail', task);
}

/**
 * ラベル編集モーダルを開く（非React用）
 */
export function openLabelEditModal(label: any = null) {
    useModalStore.getState().openModal('label-edit', label);
}

/**
 * プロジェクト編集モーダルを開く（非React用）
 */
export function openProjectEditModal(project: any = null) {
    useModalStore.getState().openModal('project-edit', project);
}

/**
 * ワークスペース編集モーダルを開く（非React用）
 */
export function openWorkspaceEditModal(workspace: any = null) {
    useModalStore.getState().openModal('workspace-edit', workspace);
}

/**
 * フィルター編集モーダルを開く（非React用）
 */
export function openFilterEditModal(filter: any = null) {
    useModalStore.getState().openModal('filter-edit', filter);
}

/**
 * 時間帯設定モーダルを開く（非React用）
 */
export function openTimeBlockModal() {
    useModalStore.getState().openModal('timeblock-edit');
}

/**
 * モーダルを閉じる（非React用）
 */
export function closeModalDirect() {
    useModalStore.getState().closeModal();
}
