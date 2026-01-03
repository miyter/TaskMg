import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from '../../core/translations';
import { Workspace } from '../../store/schema';
import { useModalStore } from '../../store/ui/modal-store';
import { addWorkspace, deleteWorkspace, getWorkspaces, isWorkspaceNameDuplicate, setCurrentWorkspaceId, updateWorkspaceName } from '../../store/workspace';
import { ErrorMessage } from '../common/ErrorMessage';
import { Modal } from '../common/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

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

        setLoading(true);
        setError(null);

        try {
            // クライアントサイドでの簡易チェック (即時フィードバック用)
            const existingWorkspaces = getWorkspaces();
            const isClientDuplicate = existingWorkspaces.some(
                (ws: Workspace) => ws.name === trimmedName && ws.id !== workspace?.id
            );

            if (isClientDuplicate) {
                setError(t('validation.workspace_duplicate'));
                setLoading(false);
                return;
            }

            // サーバーサイドでの厳密なチェック (Firestore)
            // isEditの場合は自身のIDを除外
            const isServerDuplicate = await isWorkspaceNameDuplicate(trimmedName, workspace?.id || null);
            if (isServerDuplicate) {
                setError(t('validation.workspace_duplicate'));
                setLoading(false);
                return;
            }

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

    const handleDelete = useCallback(() => {
        if (!workspace?.id) return;

        const existingWorkspaces = getWorkspaces();
        if (existingWorkspaces.length <= 1) {
            setError(t('validation.workspace_delete_last') || "Cannot delete the last workspace.");
            return;
        }

        closeModal();
        openModal('confirmation', {
            title: t('delete'),
            message: t('msg.confirm_delete_workspace') || `Are you sure you want to delete workspace "${workspace.name}"?`,
            confirmLabel: t('delete'),
            variant: 'danger',
            onConfirm: async () => {
                try {
                    await deleteWorkspace(workspace.id!);
                    // If current workspace was deleted, switch to another one is handled by store subscription ideally,
                    // or we force switch here if needed. But let's assume raw layer handles safety or subscription updates it.
                    // Actually, useWorkspaces hook will update the list and Sidebar will re-render.
                } catch (e) {
                    console.error("Failed to delete workspace:", e);
                }
            }
        });
    }, [workspace, closeModal, openModal, t]);


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
                    <Input
                        ref={inputRef}
                        id="workspace-name-input"
                        name="workspaceName"
                        label={isEdit ? t('modal.workspace_edit_title') : t('modal.workspace_create_title')}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('modal.workspace_name_placeholder')}
                        className="w-full text-lg font-bold bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 px-0 py-0 h-auto focus:ring-0"
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
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                        {isEdit && (
                            <Button
                                onClick={handleDelete}
                                disabled={loading}
                                variant="ghost"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-2"
                            >
                                {t('delete')}
                            </Button>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={closeModal}
                            disabled={loading}
                            variant="ghost"
                            className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                        >
                            {t('modal.cancel')}
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            isLoading={loading}
                            variant="primary"
                        >
                            {isEdit ? t('modal.save') : t('modal.create')}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};



