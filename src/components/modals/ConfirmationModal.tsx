import React from 'react';
import { useTranslation } from '../../core/translations';
import { ConfirmationData, useModalStore } from '../../store/ui/modal-store';
import { Modal } from '../common/Modal';
import { Button } from '../ui/Button';

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
                    <Button
                        variant="ghost"
                        onClick={closeModal}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={handleConfirm}
                        className="px-6"
                        autoFocus
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};



