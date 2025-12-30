import React from 'react';
import { useToastStore } from '../../store/ui/toast-store';
import { cn } from '../../utils/cn';

export const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToastStore();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    onClick={() => removeToast(toast.id)}
                    className={cn(
                        "pointer-events-auto min-w-[300px] max-w-sm p-4 rounded-xl shadow-lg border text-sm font-medium transition-all transform animate-in slide-in-from-right-10 fade-in duration-300 cursor-pointer hover:opacity-90",
                        toast.type === 'success' && "bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900",
                        toast.type === 'error' && "bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900",
                        toast.type === 'info' && "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700"
                    )}
                >
                    <div className="flex items-start gap-3">
                        {toast.type === 'success' && (
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        )}
                        {toast.type === 'error' && (
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        )}
                        {toast.type === 'info' && (
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        )}
                        <p className="leading-5">{toast.message}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};
