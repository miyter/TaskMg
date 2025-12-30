import React, { useState } from 'react';
import { addTask } from '../../store/store';
import { cn } from '../../utils/cn';

interface InlineTaskInputProps {
    className?: string;
    onCancel?: () => void;
    placeholder?: string;
}

export const InlineTaskInput: React.FC<InlineTaskInputProps> = ({ className, onCancel, placeholder = "タスク名を入力..." }) => {
    const [title, setTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!title.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await addTask({ title });
            setTitle(''); // Reset form
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
        <div className={cn("bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-3", className)}>
            <input
                type="text"
                autoFocus
                className="w-full bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 outline-none mb-2"
                placeholder={placeholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSubmitting}
            />
            <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700/50">
                <div className="flex gap-2">
                    {/* Placeholder for Date Picker Trigger */}
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </button>
                </div>
                <div className="flex gap-2">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                        >
                            キャンセル
                        </button>
                    )}
                    <button
                        onClick={() => handleSubmit()}
                        disabled={!title.trim() || isSubmitting}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition"
                    >
                        {isSubmitting ? '追加中...' : 'タスクを追加'}
                    </button>
                </div>
            </div>
        </div>
    );
};
