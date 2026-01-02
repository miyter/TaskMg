import { forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { IconChevronDown } from '../common/Icons';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    containerClassName?: string;
    options?: { value: string | number; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, containerClassName, options, children, id, ...props }, ref) => {
        return (
            <div className={cn("flex flex-col gap-1.5", containerClassName)}>
                {label && (
                    <label
                        htmlFor={id}
                        className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                        {label}
                    </label>
                )}
                <div className="relative group">
                    <select
                        ref={ref}
                        id={id}
                        className={cn(
                            "w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border rounded-xl pl-4 pr-10 py-2.5 outline-none transition-all appearance-none cursor-pointer placeholder:text-gray-300 dark:placeholder:text-gray-600",
                            "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                            error
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600",
                            // If value is selected(not placeholder), darken the text. But select element is tricky.
                            // Usually simply handled by the component using it.
                            className
                        )}
                        aria-invalid={!!error}
                        aria-describedby={error && id ? `${id}-error` : undefined}
                        {...props}
                    >
                        {children ? children : options?.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    {/* Chevron Icon */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                        <IconChevronDown size={16} />
                    </div>
                </div>
                {error && (
                    <p id={id ? `${id}-error` : undefined} className="text-xs text-red-500 font-medium animate-fade-in-down">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Select.displayName = "Select";
