import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from '../../core/translations';
import { cn } from '../../utils/cn';

// フォーカス可能な要素のセレクター
const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
    overlayClassName?: string;
    zIndex?: number;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className, overlayClassName, zIndex = 100, size = 'md' }) => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLDivElement>(null);

    // Responsive size classes: full width on mobile, constrained on larger screens
    const sizeClasses = {
        sm: 'max-w-full sm:max-w-sm',
        md: 'max-w-full sm:max-w-lg',
        lg: 'max-w-full sm:max-w-3xl',
        xl: 'max-w-full sm:max-w-5xl',
        full: 'max-w-full m-0 sm:m-4 h-[100dvh] sm:h-[calc(100vh-2rem)]'
    };

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        // フォーカストラップ: Tabキーでモーダル内に閉じ込める
        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== 'Tab' || !modalRef.current) return;

            const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
            if (focusableElements.length === 0) {
                e.preventDefault();
                return;
            }

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            window.addEventListener('keydown', handleTab);
            document.body.style.overflow = 'hidden';

            const timer = setTimeout(() => {
                const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
                if (focusableElements && focusableElements.length > 0) {
                    focusableElements[0].focus();
                } else if (modalRef.current) {
                    modalRef.current.focus();
                }
            }, 50);
            return () => clearTimeout(timer);
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
            window.removeEventListener('keydown', handleTab);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 flex items-center justify-center p-0 sm:p-4"
            style={{ zIndex }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
        >
            <div
                className={cn(
                    "fixed inset-0 backdrop-blur-sm transition-opacity",
                    overlayClassName ?? "bg-black/50"
                )}
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                ref={modalRef}
                tabIndex={-1}
                className={cn(
                    "relative bg-white dark:bg-gray-800 rounded-none sm:rounded-xl shadow-md w-full overflow-hidden flex flex-col outline-none max-h-[100dvh] sm:max-h-[90vh]",
                    sizeClasses[size],
                    className
                )}
            >
                {title && (
                    <div className="px-3 py-2 sm:px-modal sm:py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
                        <h3 id="modal-title" className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">{title}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 shrink-0" aria-label={t('close')}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                )}
                <div className="flex-1 overflow-y-auto p-3 sm:p-modal custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};




