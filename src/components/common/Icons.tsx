import React, { SVGProps } from 'react';
import { cn } from '../../utils/cn';

// Base Icon Props
export interface IconProps extends SVGProps<SVGSVGElement> {
    className?: string; // Tailwind classes
    size?: number; // Size in px (optional override)
    strokeWidth?: number;
}

// Helper to wrap SVGs
const createIcon = (path: React.ReactNode, viewBox: string = "0 0 24 24") => {
    return ({ className, size, strokeWidth = 2, ...props }: IconProps) => (
        <svg
            className={cn("w-4 h-4", className)}
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            viewBox={viewBox}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            {path}
        </svg>
    );
};

// --- General ---

export const IconMenu = createIcon(<path d="M4 6h16M4 12h16M4 18h16" />);
export const IconX = createIcon(<path d="M18 6L6 18M6 6l12 12" />);
export const IconPlus = createIcon(<path d="M12 5v14M5 12h14" />);
export const IconTrash = createIcon(<><path d="M3 6h18" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" /></>);
export const IconEdit = createIcon(<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />, "0 0 24 24"); // Composite path for edit often includes pencil
export const IconPencil = createIcon(<path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />);
export const IconSettings = createIcon(<><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" /></>);
export const IconCheck = createIcon(<path d="M20 6L9 17l-5-5" />);
export const IconSearch = createIcon(<><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></>);
export const IconInfo = createIcon(<><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>);
export const IconAlertTriangle = createIcon(<><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><path d="M12 9v4M12 17h.01" /></>);
export const IconAlertCircle = createIcon(<><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></>); // Standard alert circle
export const IconStar = createIcon(<path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />);
export const IconFileText = createIcon(<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></>);

// --- Navigation ---
export const IconChevronLeft = createIcon(<path d="M15 18l-6-6 6-6" />);
export const IconChevronRight = createIcon(<path d="M9 18l6-6-6-6" />);
export const IconChevronDown = createIcon(<path d="M6 9l6 6 6-6" />);
export const IconChevronUp = createIcon(<path d="M18 15l-6-6-6 6" />);
export const IconDoubleChevronLeft = createIcon(<path d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />);
export const IconDoubleChevronRight = createIcon(<path d="M13 5l7 7-7 7M5 5l7 7-7 7" />);

// --- Domain Specific ---
export const IconDashboard = createIcon(<path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />);
export const IconWizard = createIcon(<path d="M13 10V3L4 14h7v7l9-11h-7z" />);
export const IconWiki = createIcon(<path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />);

export const IconCalendar = createIcon(<><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>);
export const IconClock = createIcon(<><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>);
export const IconRepeat = createIcon(<><path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 014-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 01-4 4H3" /></>);

// --- Spinner ---
export const IconSpinner = ({ className, size, ...props }: IconProps) => (
    <svg className={cn("animate-spin", className)} width={size || 16} height={size || 16} fill="none" viewBox="0 0 24 24" {...props}>
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);
