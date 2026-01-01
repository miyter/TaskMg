import React, { useState } from 'react';
import { cn } from '../../utils/cn';

interface SidebarSectionProps {
    title: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
    action?: React.ReactNode;
    dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
    title,
    children,
    defaultExpanded = true,
    action,
    dragHandleProps
}) => {
    // Mobile: Default collapsed if not explicitly set (Issue #32)
    const [isExpanded, setIsExpanded] = useState(() => {
        if (typeof window !== 'undefined') {
            const isMobile = window.innerWidth < 768;
            if (isMobile) return false;
        }
        return defaultExpanded;
    });


    // 安全なID生成 (Issue #30)
    const safeTitle = encodeURIComponent(title.replace(/\s+/g, '-').toLowerCase());
    const sectionId = `section-${safeTitle}`;


    return (
        <div className="mb-2 group/section">
            <div className="flex items-center justify-between px-2 py-1">
                {/* Drag Handle */}
                {dragHandleProps && (
                    <div
                        {...dragHandleProps}
                        className="p-1 mr-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover/section:opacity-100 transition-opacity touch-none"
                        aria-label="ドラッグして並び替え"
                    >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                        </svg>
                    </div>
                )}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-expanded={isExpanded}
                    aria-controls={sectionId}
                    className="flex items-center flex-1 text-xs font-semibold text-gray-500 uppercase hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-left"
                >
                    <svg
                        className={cn("w-3 h-3 mr-1 transition-transform", isExpanded ? "rotate-90" : "")}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    {title}
                </button>
                {action && (
                    // Mobile: Always visible (opacity-100). Desktop: Hover only (md:opacity-0 ...) (Issue #27)
                    <div className="opacity-100 md:opacity-0 md:group-hover/section:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
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
