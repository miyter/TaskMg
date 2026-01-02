import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from '../../core/translations';
import { Workspace } from '../../store/schema';
import { useModalStore } from '../../store/ui/modal-store';
import { addWorkspace, getWorkspaces, setCurrentWorkspaceId, updateWorkspaceName } from '../../store/workspace';
import { ErrorMessage } from '../common/ErrorMessage';
import { Modal } from '../common/Modal';

/**
 * ワークスペース編集/作成モーダル (React版)
 */
interface WorkspaceEditModalProps {
    isOpen?: boolean;
    data?: any;
    zIndex?: number;
}

export const WorkspaceEditModal: React.FC<WorkspaceEditModalProps> = ({ isOpen: propIsOpen, data: propData, zIndex }) => {
    const { t } = useTranslation();
    const { closeModal, openModal } = useModalStore(); // Add openModal
    const isOpen = !!propIsOpen;
    const workspace = propData as Workspace | null;
    const isEdit = !!workspace?.id;

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const inputRef = React.useRef<HTMLInputElement>(null);

    // 初期化
    useEffect(() => {
        if (isOpen) {
            setName(workspace?.name || '');
            setError(null);
            setLoading(false);
        }
    }, [isOpen, workspace]);

    // Error auto-focus
    useEffect(() => {
        if (error) {
            inputRef.current?.focus();
        }
    }, [error]);

    const handleSave = useCallback(async () => {
        const trimmedName = name.trim();
        if (!trimmedName) {
            setError(t('validation.workspace_name_required'));
            return;
        }

        // 重複チェック
        const existingWorkspaces = getWorkspaces();
        const isDuplicate = existingWorkspaces.some(
            (ws: Workspace) => ws.name === trimmedName && ws.id !== workspace?.id
        );
        if (isDuplicate) {
            setError(t('validation.workspace_duplicate'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (isEdit && workspace?.id) {
                await updateWorkspaceName(workspace.id, trimmedName);
                closeModal();
            } else {
                const newWs = await addWorkspace(trimmedName);
                // Prompt to switch? For premium feel, maybe just switch automatically or toast.
                // But following requirement: replace confirm with modal.
                // Note: closeModal() is called inside or after. 

                if (newWs?.id) {
                    closeModal(); // Close edit/create modal first
                    openModal('confirmation', {
                        title: t('modal.workspace_create_title'),
                        message: t('validation.workspace_confirm_switch'),
                        confirmLabel: t('modal.ok'),
                        onConfirm: () => setCurrentWorkspaceId(newWs.id)
                    });
                } else {
                    closeModal();
                }
            }
        } catch (err: any) {
            setError(t('validation.save_fail') + ': ' + (err.message || 'Error'));
            setLoading(false);
        }
    }, [name, isEdit, workspace, closeModal, openModal, t]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
            handleSave();
        }
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md">
            <div className="flex flex-col gap-6 max-h-[85vh] overflow-y-auto p-1">
                {/* Header */}
                <div>
                    <label htmlFor="workspace-name-input" className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                        {isEdit ? t('modal.workspace_edit_title') : t('modal.workspace_create_title')}
                    </label>
                    <input
                        ref={inputRef}
                        id="workspace-name-input"
                        name="workspaceName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('modal.workspace_name_placeholder')}
                        className="w-full text-lg font-bold bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600"
                        autoFocus
                    />
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {isEdit
                        ? t('modal.workspace_desc_edit')
                        : t('modal.workspace_desc_create')}
                </p>

                {/* Error */}
                <ErrorMessage message={error} />

                {/* Footer */}
                <div className="flex justify-end items-center pt-4 border-t border-gray-200 dark:border-gray-700 gap-3">
                    <button
                        onClick={closeModal}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition disabled:opacity-50"
                    >
                        {t('modal.cancel')}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg shadow-md transition-all transform active:scale-95"
                    >
                        {loading ? t('saving') : isEdit ? t('modal.save') : t('modal.create')}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
