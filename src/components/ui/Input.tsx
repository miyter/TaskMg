import React, { forwardRef, InputHTMLAttributes, useId } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, leftIcon, rightIcon, containerClassName, id, ...props }, ref) => {
        const generatedId = useId();
        const inputId = id || generatedId;

        return (
            <div className={cn("flex flex-col gap-1.5", containerClassName)}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            "w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl px-4 py-2.5 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600",
                            "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                            error
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                : "border-gray-200 dark:border-gray-700 group-hover:border-gray-300 dark:group-hover:border-gray-600",
                            leftIcon && "pl-10",
                            rightIcon && "pr-10",
                            className
                        )}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${inputId}-error` : undefined}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && (
                    <p id={`${inputId}-error`} className="text-xs text-red-500 font-medium animate-fade-in-down">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
