import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { IconChevronRight } from '../common/Icons';

interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    children: React.ReactNode;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, children }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        // スクロール時に閉じる
        const handleScroll = () => onClose();

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll, true);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [onClose]);

    // 画面外にはみ出さないように調整ロジックを入れるのが理想だが、簡易版として実装

    return createPortal(
        <div
            ref={menuRef}
            className="fixed z-50 min-w-[160px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 py-1 animate-in fade-in zoom-in-95 duration-100"
            style={{ top: y, left: x }}
            onContextMenu={(e) => e.preventDefault()}
        >
            {children}
        </div>,
        document.body
    );
};

export const ContextMenuSub: React.FC<{ label: React.ReactNode; icon?: React.ReactNode; children: React.ReactNode }> = ({ label, icon, children }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div
            className="relative w-full"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button className="w-full text-left px-3 py-2 text-sm flex items-center justify-between gap-2 transition-colors text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                <div className="flex items-center gap-2">
                    {icon && <span className="w-4 h-4 text-gray-400">{icon}</span>}
                    {label}
                </div>
                <IconChevronRight className="w-3 h-3 text-gray-400" />
            </button>
            {isOpen && (
                <div className="absolute left-full top-0 ml-1 min-w-[140px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 py-1 animate-in fade-in zoom-in-95 duration-100 z-50">
                    {children}
                </div>
            )}
        </div>
    );
};

interface ContextMenuItemProps {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
    variant?: 'default' | 'danger';
}

export const ContextMenuItem: React.FC<ContextMenuItemProps> = ({ onClick, children, className, icon, variant = 'default' }) => (
    <button
        onClick={(e) => {
            e.stopPropagation();
            onClick();
        }}
        className={cn(
            "w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors",
            variant === 'danger'
                ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",
            className
        )}
    >
        {icon && <span className={cn("w-4 h-4", variant === 'danger' ? "text-red-500" : "text-gray-400")}>{icon}</span>}
        {children}
    </button>
);
