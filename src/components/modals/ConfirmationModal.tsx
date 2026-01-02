import React from 'react';
import { useTranslation } from '../../core/translations';
import { ConfirmationData, useModalStore } from '../../store/ui/modal-store';
import { Modal } from '../common/Modal';

interface ConfirmationModalProps {
    isOpen: boolean;
    data?: ConfirmationData;
    zIndex?: number;
    overlayClassName?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, data, zIndex, overlayClassName }) => {
    const { closeModal } = useModalStore();
    const { t } = useTranslation();

    if (!data) return null;

    const {
        title,
        message,
        onConfirm,
        confirmLabel = t('modal.create'), // Default fallback, but typically customized
        cancelLabel = t('modal.cancel'),
        variant = 'primary'
    } = data;

    const handleConfirm = () => {
        onConfirm();
        closeModal();
    };

    const isDanger = variant === 'danger';

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            title={title}
            size="sm"
            zIndex={zIndex}
            overlayClassName={overlayClassName}
            className="animate-fade-in-up"
        >
            <div className="flex flex-col gap-6">
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {message}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        onClick={closeModal}
                        className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`px-6 py-2 text-sm font-bold text-white rounded-lg shadow-md transition-transform active:scale-95 ${isDanger
                                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
                                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'
                            }`}
                        autoFocus
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
