import React, { useCallback, useEffect, useState } from 'react';
import { useWorkspace } from '../../hooks/useWorkspace';
import { addLabel, deleteLabel, updateLabel } from '../../store/labels';
import { Label } from '../../store/schema';
import { useModalStore } from '../../store/ui/modal-store';
import { cn } from '../../utils/cn';
import { ErrorMessage } from '../common/ErrorMessage';
import { Modal } from '../common/Modal';

const MATERIAL_COLORS = [
    '#EF5350', '#EC407A', '#AB47BC', '#7E57C2', '#5C6BC0',
    '#42A5F5', '#29B6F6', '#26C6DA', '#26A69A', '#66BB6A',
    '#9CCC65', '#D4E157', '#FFEE58', '#FFCA28', '#FFA726',
    '#FF7043', '#8D6E63', '#BDBDBD', '#78909C'
];

/**
 * ラベル編集/作成モーダル (React版)
 */
interface LabelEditModalProps {
    isOpen?: boolean;
    data?: any;
    zIndex?: number;
    overlayClassName?: string;
}

export const LabelEditModal: React.FC<LabelEditModalProps> = ({ isOpen: propIsOpen, data: propData, zIndex, overlayClassName }) => {
    const { closeModal } = useModalStore();
    const isOpen = !!propIsOpen;
    const label = propData as Label | null;
    const isEdit = !!label?.id;
    const { workspaceId } = useWorkspace();

    const [name, setName] = useState('');
    const [color, setColor] = useState('#42A5F5');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 初期化
    useEffect(() => {
        if (isOpen) {
            setName(label?.name || '');
            setColor(label?.color || MATERIAL_COLORS[Math.floor(Math.random() * MATERIAL_COLORS.length)]);
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
            if (!workspaceId) {
                setError('ワークスペースが見つかりません');
                setLoading(false);
                return;
            }

            if (isEdit && label?.id) {
                await updateLabel(workspaceId, label.id, { name: trimmedName, color });
            } else {
                await addLabel(workspaceId, trimmedName, color);
            }
            closeModal();
        } catch (err: any) {
            setError('保存に失敗しました: ' + (err.message || '不明なエラー'));
            setLoading(false);
        }
    }, [name, color, isEdit, label, closeModal]);

    const handleDelete = useCallback(async () => {
        if (!label?.id) return;
        if (!confirm(`ラベル「${label.name}」を削除しますか？`)) return;

        setLoading(true);
        try {
            if (workspaceId && label?.id) {
                await deleteLabel(workspaceId, label.id);
            }
            closeModal();
        } catch (err: any) {
            setError('削除に失敗しました');
            setLoading(false);
        }
    }, [label, closeModal]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
            if (!loading && name.trim()) {
                handleSave();
            }
            e.preventDefault();
        }
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            className="max-w-sm"
            zIndex={zIndex}
            overlayClassName={overlayClassName}
        >
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div
                        className="w-8 h-8 rounded-full flex-shrink-0 border-2 border-gray-100 dark:border-gray-700 shadow-sm"
                        style={{ backgroundColor: color }}
                    />
                    <input
                        id="label-name-input"
                        name="labelName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isEdit ? 'ラベル名' : '新しいラベル名'}
                        className="flex-1 text-xl font-bold bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400"
                        autoFocus
                        aria-label="ラベル名"
                        aria-invalid={!!error}
                        aria-describedby={error ? "label-error-msg" : undefined}
                    />
                </div>

                {/* Color Picker */}
                <div>
                    <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                        カラー
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {MATERIAL_COLORS.map(c => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setColor(c)}
                                className={cn(
                                    "w-6 h-6 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800",
                                    color === c ? "ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800 scale-110" : ""
                                )}
                                style={{ backgroundColor: c }}
                                aria-label={`色を選択: ${c}`}
                                aria-pressed={color === c}
                            />
                        ))}
                    </div>
                </div>

                {/* Error */}
                <ErrorMessage message={error} />

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        {isEdit && (
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
                                aria-label="ラベルを削除"
                                title="ラベルを削除"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={closeModal}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition disabled:opacity-50"
                        >
                            キャンセル
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading || !name.trim()}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? '保存中...' : isEdit ? '保存' : '作成'}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
