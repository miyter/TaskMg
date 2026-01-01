import React, { useState } from 'react';
import { useTranslation } from '../../core/translations'; // Add
import { cn } from '../../utils/cn';

interface SidebarSectionProps {
    title: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
    action?: React.ReactNode;
    dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
    title,
    children,
    defaultExpanded = true,
    action,
    dragHandleProps
}) => {
    const { t } = useTranslation(); // Add
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
                <button
                    {...(dragHandleProps as any)}
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-expanded={isExpanded}
                    aria-controls={sectionId}
                    className="flex items-center flex-1 text-xs font-semibold text-gray-500 uppercase hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-left cursor-grab active:cursor-grabbing touch-none select-none"
                    title={t('sidebar.reorder_section')}
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
                    // Mobile: Always visible. Desktop: Always visible per user feedback (Issue #27 fix)
                    <div className="opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
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
