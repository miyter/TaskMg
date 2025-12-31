import React, { useState } from 'react';
import { cn } from '../../utils/cn';

interface SidebarSectionProps {
    title: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
}

export const SidebarSection: React.FC<SidebarSectionProps & { action?: React.ReactNode }> = ({ title, children, defaultExpanded = true, action }) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    const sectionId = `section-${title.toLowerCase().replace(/\s+/g, '-')}`;

    return (
        <div className="mb-2 group/section">
            <div className="flex items-center justify-between px-2 py-1">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-expanded={isExpanded}
                    aria-controls={sectionId}
                    className="flex items-center flex-1 text-xs font-semibold text-gray-500 uppercase hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-left"
                >
                    <svg
                        className={cn("w-3 h-3 mr-1 transition-transform", isExpanded ? "rotate-90" : "")}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    {title}
                </button>
                {action && (
                    <div className="opacity-0 group-hover/section:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        {action}
                    </div>
                )}
            </div>
            {isExpanded && (
                <div className="mt-1" id={sectionId}>
                    {children}
                </div>
            )}
        </div>
    );
};
