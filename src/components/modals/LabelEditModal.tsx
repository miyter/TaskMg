import React, { useCallback, useEffect, useState } from 'react';
import { useWorkspace } from '../../hooks/useWorkspace';
import { addLabel, deleteLabel, updateLabel } from '../../store/labels';
import { Label } from '../../store/schema';
import { useModalStore } from '../../store/ui/modal-store';
import { cn } from '../../utils/cn';
import { ErrorMessage } from '../common/ErrorMessage';
import { IconTrash } from '../common/Icons';
import { Modal } from '../common/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

import { useTranslation } from '../../core/translations';
import { COLOR_PALETTE } from '../../core/ui-constants';

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
    const { t } = useTranslation();
    const { closeModal, openModal } = useModalStore();
    const isOpen = !!propIsOpen;
    const label = propData as Label | null;
    const isEdit = !!label?.id;
    const { workspaceId } = useWorkspace();

    const [name, setName] = useState('');
    const [color, setColor] = useState('#42A5F5');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const inputRef = React.useRef<HTMLInputElement>(null);

    // 初期化
    useEffect(() => {
        if (isOpen) {
            setName(label?.name || '');
            setColor(label?.color || COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)].value);
            setError(null);
            setLoading(false);
        }
    }, [isOpen, label]);

    // Error auto-focus
    useEffect(() => {
        if (error) {
            inputRef.current?.focus();
        }
    }, [error]);

    const handleSave = useCallback(async () => {
        const trimmedName = name.trim();
        if (!trimmedName) {
            setError(t('validation.label_name_required'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (!workspaceId) {
                setError(t('validation.label_workspace_required'));
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
            setError(t('validation.save_fail') + ': ' + (err.message || 'Error'));
            setLoading(false);
        }
    }, [name, color, isEdit, label, closeModal, t]);

    const handleDelete = useCallback(async () => {
        if (!label?.id) return;

        openModal('confirmation', {
            title: t('delete'),
            message: t('modal.label_delete_confirm').replace('{name}', label.name),
            confirmLabel: t('delete'),
            variant: 'danger',
            onConfirm: async () => {
                setLoading(true);
                try {
                    if (workspaceId && label?.id) {
                        await deleteLabel(workspaceId, label.id);
                    }
                    closeModal();
                } catch (err: any) {
                    setError(t('validation.delete_fail'));
                    setLoading(false);
                }
            }
        });
    }, [label, closeModal, openModal, workspaceId, t]);

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
                    <div className="flex-1">
                        <Input
                            ref={inputRef}
                            id="label-name-input"
                            name="labelName"
                            type="text"
                            label={t('modal.label_name')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={isEdit ? t('modal.label_name_placeholder') : t('modal.label_create_placeholder')}
                            className="bg-transparent border-none text-lg font-bold p-0 focus:ring-0 focus:border-transparent px-0 py-0 rounded-none h-auto"
                            containerClassName="gap-0"
                            autoFocus
                            aria-invalid={!!error}
                            aria-describedby={error ? "label-error-msg" : undefined}
                        />
                    </div>
                </div>

                {/* Color Picker */}
                <div>
                    <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                        {t('modal.theme_color')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {COLOR_PALETTE.map(c => (
                            <button
                                key={c.value}
                                type="button"
                                onClick={() => setColor(c.value)}
                                className={cn(
                                    "w-6 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800",
                                    color === c.value ? "ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800" : ""
                                )}
                                style={{ backgroundColor: c.value }}
                                aria-label={t(`colors.${c.key}` as any)}
                                aria-pressed={color === c.value}
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
                            <Button
                                onClick={handleDelete}
                                disabled={loading}
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                aria-label={t('modal.delete_label')}
                                title={t('modal.delete_label')}
                            >

                                <IconTrash size={20} />
                            </Button>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={closeModal}
                            disabled={loading}
                            variant="ghost"
                        >
                            {t('modal.cancel')}
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={loading || !name.trim()}
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
