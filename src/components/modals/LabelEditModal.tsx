import React, { useCallback, useEffect, useState } from 'react';
import { addLabel, deleteLabel, updateLabel } from '../../store/labels';
import { Label } from '../../store/schema';
import { useModalStore } from '../../store/ui/modal-store';
import { Modal } from '../common/Modal';

/**
 * ラベル編集/作成モーダル (React版)
 */
interface LabelEditModalProps {
    isOpen?: boolean;
    data?: any;
    zIndex?: number;
}

export const LabelEditModal: React.FC<LabelEditModalProps> = ({ isOpen: propIsOpen, data: propData, zIndex }) => {
    const { activeModal, modalData, closeModal } = useModalStore();
    const isOpen = propIsOpen ?? (activeModal === 'label-edit');
    const label = (propData ?? modalData) as Label | null;
    const isEdit = !!label?.id;

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 初期化
    useEffect(() => {
        if (isOpen) {
            setName(label?.name || '');
            setError(null);
            setLoading(false);
        }
    }, [isOpen, label]);

    const handleSave = useCallback(async () => {
        const trimmedName = name.trim();
        if (!trimmedName) {
            setError('名前を入力してください');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (isEdit && label?.id) {
                await updateLabel(label.id, { name: trimmedName });
            } else {
                const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
                await addLabel(trimmedName, randomColor);
            }
            closeModal();
        } catch (err: any) {
            setError('保存に失敗しました: ' + (err.message || '不明なエラー'));
            setLoading(false);
        }
    }, [name, isEdit, label, closeModal]);

    const handleDelete = useCallback(async () => {
        if (!label?.id) return;
        if (!confirm(`ラベル「${label.name}」を削除しますか？`)) return;

        setLoading(true);
        try {
            await deleteLabel(label.id);
            closeModal();
        } catch (err: any) {
            setError('削除に失敗しました');
            setLoading(false);
        }
    }, [label, closeModal]);

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
                <div className="flex items-center gap-3">
                    <div
                        className="w-6 h-6 rounded-full flex-shrink-0"
                        style={{ backgroundColor: label?.color || '#3B82F6' }}
                    />
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isEdit ? 'ラベル名' : '新しいラベル名'}
                        className="flex-1 text-lg font-bold bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400"
                        autoFocus
                    />
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    {isEdit ? 'ラベルの名前を変更します。' : '新しいラベルを作成します。'}
                </p>

                {/* Error */}
                {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    {isEdit ? (
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="text-gray-400 hover:text-red-500 text-sm font-medium flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            削除
                        </button>
                    ) : (
                        <span />
                    )}
                    <div className="flex gap-3">
                        <button
                            onClick={closeModal}
                            disabled={loading}
                            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 transition disabled:opacity-50"
                        >
                            キャンセル
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? '処理中...' : isEdit ? '保存' : '作成'}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
