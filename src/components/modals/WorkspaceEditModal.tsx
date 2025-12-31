import React, { useCallback, useEffect, useState } from 'react';
import { Workspace } from '../../store/schema';
import { useModalStore } from '../../store/ui/modal-store';
import { addWorkspace, getWorkspaces, setCurrentWorkspaceId, updateWorkspaceName } from '../../store/workspace';
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
    const { activeModal, modalData, closeModal } = useModalStore();
    const isOpen = propIsOpen ?? (activeModal === 'workspace-edit');
    const workspace = (propData ?? modalData) as Workspace | null;
    const isEdit = !!workspace?.id;

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 初期化
    useEffect(() => {
        if (isOpen) {
            setName(workspace?.name || '');
            setError(null);
            setLoading(false);
        }
    }, [isOpen, workspace]);

    const handleSave = useCallback(async () => {
        const trimmedName = name.trim();
        if (!trimmedName) {
            setError('ワークスペース名を入力してください');
            return;
        }

        // 重複チェック
        const existingWorkspaces = getWorkspaces();
        const isDuplicate = existingWorkspaces.some(
            (ws: Workspace) => ws.name === trimmedName && ws.id !== workspace?.id
        );
        if (isDuplicate) {
            setError('その名前は既に使われています');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (isEdit && workspace?.id) {
                await updateWorkspaceName(workspace.id, trimmedName);
            } else {
                const newWs = await addWorkspace(trimmedName);
                if (newWs?.id) {
                    setCurrentWorkspaceId(newWs.id);
                }
            }
            closeModal();
        } catch (err: any) {
            setError('保存に失敗しました: ' + (err.message || '不明なエラー'));
            setLoading(false);
        }
    }, [name, isEdit, workspace, closeModal]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
            handleSave();
        }
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md">
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div>
                    <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                        {isEdit ? 'ワークスペース名の変更' : '新規ワークスペース'}
                    </h2>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="ワークスペース名を入力..."
                        className="w-full text-xl font-bold bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600"
                        autoFocus
                    />
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {isEdit
                        ? 'ワークスペースの名前を変更します。'
                        : '新しいワークスペースを作成します。プロジェクトやタスクを個別に管理できるようになります。'}
                </p>

                {/* Error */}
                {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                {/* Footer */}
                <div className="flex justify-end items-center pt-4 border-t border-gray-200 dark:border-gray-700 gap-3">
                    <button
                        onClick={closeModal}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition disabled:opacity-50"
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg shadow-md transition-all transform active:scale-95"
                    >
                        {loading ? (isEdit ? '更新中...' : '作成中...') : isEdit ? '保存' : '作成'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
