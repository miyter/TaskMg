import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

interface SortableItemProps {
    id: string;
    children: React.ReactNode;
    /** カスタムクラス名 */
    className?: string;
}

/**
 * ドラッグ可能なソート可能アイテムコンポーネント
 * DnD状態に応じたスタイルをTailwindクラスで統一
 */
export const SortableItem: React.FC<SortableItemProps> = ({ id, children, className = '' }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        isOver
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // DnD状態に応じたTailwindクラス
    const dndStateClasses = [
        isDragging && 'opacity-50 scale-[1.02] shadow-lg z-50',
        isOver && 'ring-2 ring-indigo-500/50',
    ].filter(Boolean).join(' ');

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`${dndStateClasses} ${className}`.trim()}
            {...attributes}
            {...listeners}
        >
            {children}
        </div>
    );
};
