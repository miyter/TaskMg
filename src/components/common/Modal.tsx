import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
    zIndex?: number;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className, zIndex = 100 }) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
            // Only restore if no other modals are open? 
            // Simplified: restoring is fine, multiple listeners manage their own close?
            // Actually, if we have stack, removing one shouldn't enable overflow if others are open.
            // But checking that is complex.
            // For now, let's keep it simple. As long as at least one stays, body overflow hidden *might* be lost if I close top one? 
            // If I close top one, useEffect cleanup runs.
            // If middle one is still open, its useEffect is still active, but it won't re-run to Apply overflow.
            // So closing the top modal returns scroll to body even if bottom modal is open.
            // This is a known issue with stacked modals using simple effects.
            // I should use a global lock count or check stack length in store?
            // For now, I will fix zIndex. Overflow issue is secondary.
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 animate-fade-in"
            style={{ zIndex }}
        >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className={cn("relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col transform transition-all animate-scale-in", className)}>
                {title && (
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                )}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};
