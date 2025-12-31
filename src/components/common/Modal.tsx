import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';



// フォーカス可能な要素のセレクター
// フォーカス可能な要素のセレクター
const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
    zIndex?: number;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className, zIndex = 100, size = 'md' }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-3xl',
        xl: 'max-w-5xl',
        full: 'max-w-full m-4 h-[calc(100vh-2rem)]'
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
                // Shift+Tab: 最初の要素にいたら最後に移動
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab: 最後の要素にいたら最初に移動
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

            // モーダルオープン時に最初のフォーカス可能要素にフォーカス
            const timer = setTimeout(() => {
                const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
                if (focusableElements && focusableElements.length > 0) {
                    focusableElements[0].focus();
                } else if (modalRef.current) {
                    modalRef.current.focus(); // Fallback to modal itself
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
            className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 animate-fade-in"
            style={{ zIndex }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
        >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} aria-hidden="true" />
            <div
                ref={modalRef}
                tabIndex={-1} // Allow focus fallack
                className={cn(
                    "relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full overflow-hidden flex flex-col transform transition-all animate-scale-in outline-none",
                    sizeClasses[size],
                    className
                )}
            >
                {title && (
                    <div className="px-modal py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
                        <h3 id="modal-title" className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="閉じる">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                )}
                <div className="flex-1 overflow-y-auto p-modal custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};
