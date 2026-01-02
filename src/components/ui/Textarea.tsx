import { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, containerClassName, id, ...props }, ref) => {
        return (
            <div className={cn("flex flex-col gap-1.5 h-full", containerClassName)}>
                {label && (
                    <label
                        htmlFor={id}
                        className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={id}
                    className={cn(
                        "w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl px-4 py-3 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 resize-none",
                        "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                        error
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
                        className
                    )}
                    aria-invalid={!!error}
                    aria-describedby={error && id ? `${id}-error` : undefined}
                    {...props}
                />
                {error && (
                    <p id={id ? `${id}-error` : undefined} className="text-xs text-red-500 font-medium animate-fade-in-down">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Textarea.displayName = "Textarea";
