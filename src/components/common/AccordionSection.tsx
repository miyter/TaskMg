import React, { useState } from 'react';
import { cn } from '../../utils/cn';

interface AccordionSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    icon?: React.ReactNode;
    className?: string;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({
    title,
    children,
    defaultOpen = false,
    icon,
    className
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <section className={cn("border border-gray-200 dark:border-gray-700/50 rounded-xl overflow-hidden", className)}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
                type="button"
                aria-expanded={isOpen}
                aria-controls={`accordion-panel-${title.replace(/\s+/g, '-').toLowerCase()}`}
            >
                <div className="flex items-center gap-3">
                    {icon && <span className="text-lg">{icon}</span>}
                    <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">{title}</h4>
                </div>
                <svg
                    className={cn("w-4 h-4 text-gray-400 transition-transform duration-200", isOpen && "rotate-180")}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div
                id={`accordion-panel-${title.replace(/\s+/g, '-').toLowerCase()}`}
                className={cn(
                    "transition-all duration-100 ease-in-out overflow-hidden bg-white dark:bg-transparent",
                    isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <div className="p-4 border-t border-gray-100 dark:border-gray-700/30">
                    {children}
                </div>
            </div>
        </section>
    );
};
