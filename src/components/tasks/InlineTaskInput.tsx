import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { addTask } from '../../store';
import { toast } from '../../store/ui/toast-store';
import { cn } from '../../utils/cn';

interface InlineTaskInputProps {
    className?: string;
    onCancel?: () => void;
    onSuccess?: () => void;
    placeholder?: string;
    initialValue?: string;
}

export const InlineTaskInput: React.FC<InlineTaskInputProps> = ({ className, onCancel, onSuccess, placeholder, initialValue = '' }) => {
    const { t } = useTranslation();
    const effectivePlaceholder = placeholder || t('inline_input.placeholder');

    const [title, setTitle] = useState(initialValue);
    const [isImportant, setIsImportant] = useState(false);
    const [isToday, setIsToday] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!title.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await addTask({
                title,
                isImportant,
                dueDate: isToday ? new Date() : undefined
            });
            setTitle(''); // Reset form
            setIsImportant(false);
            setIsToday(false);
            onSuccess?.();
        } catch (error) {
            console.error(error);
            toast.error(t('msg.task.create_fail'));
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

    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                // タイトルが入力されている場合は、誤操作防止のためキャンセルしない
                if (!title.trim()) {
                    onCancel?.();
                }
            }
        };

        // イベントリスナーの登録を少し遅延させて、オープン時のクリックイベントを拾わないようにする
        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 100);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onCancel, title]);

    return (
        <div ref={containerRef} className={cn("glass-effect rounded-xl shadow-xl p-3 sm:p-4 border border-blue-500/30 dark:border-blue-400/30 animate-in slide-in-from-top-2 duration-300 w-full", className)}>
            <label htmlFor="inline-task-input" className="sr-only">{t('inline_input.label')}</label>
            <input
                id="inline-task-input"
                type="text"
                autoFocus
                className="w-full bg-white/50 dark:bg-gray-800/50 text-base sm:text-lg font-medium text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none mb-3 sm:mb-4 focus:bg-white/80 dark:focus:bg-gray-800/80 p-3 rounded-lg transition-all border border-transparent focus:border-blue-500/30 focus:ring-2 focus:ring-blue-500/20"
                placeholder={effectivePlaceholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSubmitting}
            />
            <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700/50">
                <div className="flex gap-2 sm:gap-3">
                    <button
                        type="button"
                        onClick={() => setIsToday(!isToday)}
                        className={cn(
                            "transition-colors p-2 rounded-lg",
                            isToday
                                ? "text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 dark:hover:bg-blue-900/50"
                                : "text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                        aria-label={isToday ? t('inline_input.aria_today_remove') : t('inline_input.aria_today')}
                        title={isToday ? t('inline_input.tooltip_today_remove') : t('inline_input.tooltip_today')}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsImportant(!isImportant)}
                        className={cn(
                            "transition-colors p-2 rounded-lg",
                            isImportant
                                ? "text-amber-500 bg-amber-50 hover:bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30 dark:hover:bg-amber-900/50"
                                : "text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                        aria-label={isImportant ? t('inline_input.aria_important_remove') : t('inline_input.aria_important')}
                        title={isImportant ? t('inline_input.tooltip_important_remove') : t('inline_input.tooltip_important')}
                    >
                        <svg className={cn("w-5 h-5", isImportant && "fill-current")} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                    </button>
                </div>
                <div className="flex gap-2 sm:gap-3">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="px-3 py-2 sm:px-4 sm:py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
                            aria-label={t('modal.cancel')}
                        >
                            {t('modal.cancel')}
                        </button>
                    )}
                    <button
                        onClick={() => handleSubmit()}
                        disabled={!title.trim() || isSubmitting}
                        className="px-4 py-2 sm:px-5 sm:py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-1"
                        aria-label={t('add_task')}
                    >
                        {isSubmitting ? t('inline_input.adding') : t('add')}
                    </button>
                </div>
            </div>
        </div>
    );
};


