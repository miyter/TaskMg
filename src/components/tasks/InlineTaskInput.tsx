import React, { useState } from 'react';
import { addTask } from '../../store';
import { cn } from '../../utils/cn';

interface InlineTaskInputProps {
    className?: string;
    onCancel?: () => void;
    onSuccess?: () => void;
    placeholder?: string;
}

export const InlineTaskInput: React.FC<InlineTaskInputProps> = ({ className, onCancel, onSuccess, placeholder = "タスク名を入力..." }) => {
    const [title, setTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!title.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await addTask({ title });
            setTitle(''); // Reset form
            onSuccess?.();
            // Keep input focused or close depending on UX preference.
            // For now, keep it open for quick entry.
        } catch (error) {
            console.error(error);
            alert('Failed to add task');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            handleSubmit();
        }
        if (e.key === 'Escape') {
            onCancel?.();
        }
    };

    return (
        <div className={cn("glass-effect rounded-xl shadow-xl p-4 border-blue-500/20 dark:border-blue-400/20 animate-in slide-in-from-top-2 duration-300", className)}>
            <input
                type="text"
                autoFocus
                className="w-full bg-transparent text-base font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400 outline-none mb-4"
                placeholder={placeholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSubmitting}
            />
            <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700/50">
                <div className="flex gap-3">
                    {/* Placeholder for Date Picker Trigger */}
                    <button className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </button>
                    <button className="text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                    </button>
                </div>
                <div className="flex gap-3">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
                        >
                            キャンセル
                        </button>
                    )}
                    <button
                        onClick={() => handleSubmit()}
                        disabled={!title.trim() || isSubmitting}
                        className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    >
                        {isSubmitting ? '追加中...' : 'タスクを追加'}
                    </button>
                </div>
            </div>
        </div>
    );
};
