import React, { useState } from 'react';
import { cn } from '../../utils/cn';

interface SidebarSectionProps {
    title: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children, defaultExpanded = true }) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <div className="mb-2">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center w-full px-2 py-1 text-xs font-semibold text-gray-500 uppercase hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
                <svg
                    className={cn("w-3 h-3 mr-1 transition-transform", isExpanded ? "rotate-90" : "")}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
                {title}
            </button>
            {isExpanded && (
                <div className="mt-1">
                    {children}
                </div>
            )}
        </div>
    );
};
