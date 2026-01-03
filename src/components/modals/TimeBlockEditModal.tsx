import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import React, { useEffect, useState } from 'react';
import { useTranslation } from '../../core/translations';
import { COLOR_PALETTE, UI_CONFIG } from '../../core/ui-constants';
import { useTimeBlocks } from '../../hooks/useTimeBlocks';
import { useWorkspace } from '../../hooks/useWorkspace';
import { TimeBlock } from '../../store/schema';
import { deleteTimeBlock, saveTimeBlock } from '../../store/timeblocks';
import { useModalStore } from '../../store/ui/modal-store';
import { cn } from '../../utils/cn';
import { ErrorMessage, Modal, Portal, SortableItem } from '../common';
import { IconAlertTriangle, IconChevronDown, IconPlus, IconTrash } from '../common/Icons';
import { Button } from '../ui/Button';

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')).map(h => ({ value: h, label: h }));
const MINUTE_OPTIONS = ['00', '15', '30', '45'].map(m => ({ value: m, label: m }));

interface TimeBlockEditModalProps {
    isOpen?: boolean;
    data?: any;
    zIndex?: number;
    overlayClassName?: string;
}

export const TimeBlockEditModal: React.FC<TimeBlockEditModalProps> = ({ isOpen: propIsOpen, zIndex, overlayClassName }) => {
    const { t } = useTranslation();
    const { closeModal, openModal } = useModalStore();
    const isOpen = !!propIsOpen;
    const { timeBlocks: storeBlocks } = useTimeBlocks();
    const { workspaceId } = useWorkspace();

    const [blocks, setBlocks] = useState<Partial<TimeBlock>[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null); // For DragOverlay

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        if (isOpen) {
            setBlocks(storeBlocks.sort((a, b) => (a.order || 0) - (b.order || 0)));
            setError(null);
            setLoading(false);
        }
    }, [isOpen, storeBlocks]);

    const handleAdd = () => {
        if (blocks.length >= UI_CONFIG.TIME_BLOCK.MAX_COUNT) return;

        let nextStart = '09:00';
        let nextEnd = '10:00';

        if (blocks.length > 0) {
            const lastBlock = blocks[blocks.length - 1];
            if (lastBlock.end) {
                const [h, m] = lastBlock.end.split(':').map(Number);
                nextStart = lastBlock.end;
                // Add 1 hour
                const nextH = (h + 1) % 24;
                nextEnd = `${String(nextH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
            }
        }

        const newBlock: Partial<TimeBlock> = {
            id: `new-${Date.now()}`,
            start: nextStart,
            end: nextEnd,
            color: COLOR_PALETTE[blocks.length % COLOR_PALETTE.length].value,
            order: blocks.length
        };
        setBlocks([...blocks, newBlock]);
    };

    const handleDelete = async (id: string) => {
        if (!id.startsWith('new-')) {
            openModal('confirmation', {
                title: t('delete'),
                message: t('time_block.delete_confirm'),
                confirmLabel: t('delete'),
                variant: 'danger',
                onConfirm: async () => {
                    try {
                        if (workspaceId) {
                            await deleteTimeBlock(workspaceId, id);
                            setBlocks(prev => prev.filter(b => b.id !== id));
                        }
                    } catch (err) {
                        setError(t('validation.delete_fail'));
                    }
                }
            });
            return;
        }
        setBlocks(blocks.filter(b => b.id !== id));
    };

    const handleUpdate = (id: string, updates: Partial<TimeBlock>) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (over && active.id !== over.id) {
            setBlocks((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);

        try {
            for (const b of blocks) {
                if (!b.start || !b.end) continue;
                const [sh, sm] = b.start.split(':').map(Number);
                const [eh, em] = b.end.split(':').map(Number);
                if (sh * 60 + sm >= eh * 60 + em) {
                    throw new Error(t('time_block.error_invalid_time', { start: b.start, end: b.end }));
                }
            }

            // Overlap check
            const sortedBlocks = [...blocks].sort((a, b) => {
                return (a.start || '').localeCompare(b.start || '');
            });

            for (let i = 0; i < sortedBlocks.length - 1; i++) {
                const current = sortedBlocks[i];
                const next = sortedBlocks[i + 1];
                if (!current.end || !next.start) continue;

                const [ch, cm] = current.end.split(':').map(Number);
                const [nh, nm] = next.start.split(':').map(Number);

                if (nh * 60 + nm < ch * 60 + cm) {
                    throw new Error(t('time_block.error_overlap', { range1: `${current.start}-${current.end}`, range2: `${next.start}-${next.end}` }));
                }
            }

            const promises = blocks.map((b, index) => {
                const data = {
                    ...b,
                    id: b.id?.startsWith('new-') ? null : b.id,
                    order: index,
                    name: `${b.start}-${b.end}`
                } as any;
                if (!workspaceId) throw new Error("No workspace");
                return saveTimeBlock(workspaceId, data);
            });

            await Promise.all(promises);
            await Promise.all(promises);
            closeModal();
        } catch (err: any) {
            setError(err.message || t('validation.save_fail'));
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const activeBlock = activeId ? blocks.find(b => b.id === activeId) : null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            title={t('time_block.settings_title')}
            size="lg"
            className="h-[600px]"
            zIndex={zIndex}
            overlayClassName={overlayClassName}
        >
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-2 space-y-3 custom-scrollbar">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={blocks.map(b => b.id!)}
                            strategy={verticalListSortingStrategy}
                        >
                            {blocks.map((block) => (
                                <SortableItem key={block.id} id={block.id!}>
                                    <TimeBlockRow
                                        block={block}
                                        onDelete={() => handleDelete(block.id!)}
                                        onUpdate={(upd) => handleUpdate(block.id!, upd)}
                                        isOverlay={false}
                                    />
                                </SortableItem>
                            ))}
                        </SortableContext>

                        <DragOverlay dropAnimation={null} modifiers={[]}>
                            {activeBlock ? (
                                <div style={{ opacity: 0.9 }}>
                                    <TimeBlockRow
                                        block={activeBlock}
                                        onDelete={() => { }}
                                        onUpdate={() => { }}
                                        isOverlay
                                    />
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>

                    {/* Add Button - FAB style circular button */}
                    {blocks.length < UI_CONFIG.TIME_BLOCK.MAX_COUNT ? (
                        <div className="flex justify-center py-2">
                            <Button
                                onClick={handleAdd}
                                size="icon"
                                className="w-10 h-10 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-105 active:scale-95"
                                title={t('time_block.add_button')}
                            >
                                <IconPlus className="w-5 h-5" />
                            </Button>
                        </div>
                    ) : (
                        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-xs rounded-lg flex items-center justify-center gap-2">
                            <IconAlertTriangle className="w-4 h-4" />
                            {t('time_block.max_limit')}
                        </div>
                    )}
                </div>

                <ErrorMessage message={error} className="mb-4" />

                {/* Footer - Minimal with only done button */}
                <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                    <Button
                        type="button"
                        onClick={handleSave}
                        isLoading={loading}
                        className="px-6"
                    >
                        {t('done')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

interface TimeBlockRowProps {
    block: Partial<TimeBlock>;
    onDelete: () => void;
    onUpdate: (upd: Partial<TimeBlock>) => void;
    isOverlay?: boolean;
}

const CustomMiniSelect: React.FC<{
    value: string;
    options: { value: string; label: string }[];
    onChange: (val: string) => void;
    className?: string;
    ariaLabel?: string;
}> = ({ value, options, onChange, className, ariaLabel }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const listRef = React.useRef<HTMLDivElement>(null);

    const handleOpen = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({ top: rect.bottom + window.scrollY + 4, left: rect.left + window.scrollX, width: rect.width });
            setIsOpen(!isOpen);
        }
    };

    React.useEffect(() => {
        if (isOpen && listRef.current) {
            const selectedEl = listRef.current.querySelector('[data-selected="true"]');
            if (selectedEl) selectedEl.scrollIntoView({ block: 'center' });
        }
    }, [isOpen]);

    return (
        <>
            <button
                ref={buttonRef}
                onClick={handleOpen}
                className={cn(
                    "flex items-center justify-between bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md px-2 text-left transition-colors text-sm font-medium",
                    className
                )}
                aria-label={ariaLabel}
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
            >
                <span className="truncate">{options.find(o => o.value === value)?.label || value}</span>
                <IconChevronDown className="w-3 h-3 text-gray-400 shrink-0 ml-1 opacity-50" />
            </button>
            {isOpen && (
                <Portal>
                    <div
                        className="fixed inset-0 bg-transparent"
                        style={{ zIndex: UI_CONFIG.Z_INDEX.POPOVER_BACKDROP }}
                        onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                    />
                    <div
                        ref={listRef}
                        className="fixed bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-xl overflow-y-auto custom-scrollbar flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100"
                        style={{
                            zIndex: UI_CONFIG.Z_INDEX.POPOVER,
                            top: position.top,
                            left: position.left,
                            width: Math.max(position.width, 60),
                            maxHeight: '180px'
                        }}
                    >
                        {options.map(opt => (
                            <button
                                key={opt.value}
                                data-selected={opt.value === value}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "px-3 py-1.5 text-left text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors w-full font-mono",
                                    opt.value === value ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-700 dark:text-gray-200"
                                )}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </Portal>
            )}
        </>
    );
};

const TimeBlockRow: React.FC<TimeBlockRowProps> = ({ block, onDelete, onUpdate, isOverlay }) => {
    const { t } = useTranslation();
    const [showColorPicker, setShowColorPicker] = useState(false);

    const startTime = block.start || '09:00';
    const endTime = block.end || '10:00';
    const [sh, sm] = startTime.split(':');
    const [eh, em] = endTime.split(':');

    // Mini select style - tweaked for CustomSelect
    const miniSelectStyle = "w-[56px] h-8 text-sm font-mono font-medium bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700";

    return (
        <div className={`flex items-center gap-4 p-3 rounded-lg group transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${isOverlay ? 'bg-white dark:bg-gray-800 shadow-xl ring-1 ring-black/5' : ''}`}>
            <div className="relative">
                <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-5 h-5 rounded-full shadow-sm ring-2 ring-transparent focus:ring-blue-400 ring-offset-2 dark:ring-offset-gray-900 block transition-transform hover:scale-110"
                    style={{ backgroundColor: block.color || UI_CONFIG.DEFAULT_COLORS.TIME_BLOCK }}
                    title={t('time_block.change_color')}
                    onPointerDown={(e) => e.stopPropagation()}
                />
                {showColorPicker && (
                    <Portal>
                        <div
                            className="fixed inset-0 bg-transparent"
                            style={{ zIndex: UI_CONFIG.Z_INDEX.POPOVER_BACKDROP }}
                            onClick={() => setShowColorPicker(false)}
                        />
                        <div
                            className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 w-[280px]"
                            style={{
                                zIndex: UI_CONFIG.Z_INDEX.POPOVER,
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-3 tracking-wider">{t('modal.theme_color')}</h4>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {COLOR_PALETTE.map(c => (
                                    <button
                                        key={c.value}
                                        onClick={() => {
                                            onUpdate({ color: c.value });
                                            setShowColorPicker(false);
                                        }}
                                        className={cn(
                                            "w-8 h-8 rounded-full ring-2 ring-transparent hover:ring-blue-400 focus:outline-none transition-transform hover:scale-110",
                                            block.color === c.value && "ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800"
                                        )}
                                        style={{ backgroundColor: c.value }}
                                        aria-label={t(`colors.${c.key}` as any)}
                                        aria-pressed={block.color === c.value}
                                    />
                                ))}
                            </div>
                        </div>
                    </Portal>
                )}
            </div>

            <div className="flex-1 flex items-center gap-3">
                <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-1">
                    <CustomMiniSelect
                        options={HOUR_OPTIONS}
                        value={sh}
                        onChange={(val) => onUpdate({ start: `${val}:${sm}` })}
                        className="w-[50px] justify-center bg-transparent border-none hover:bg-gray-200 dark:hover:bg-gray-700"
                        ariaLabel={t('time_block.time_select')}
                    />
                    <span className="text-gray-300 dark:text-gray-600 font-mono">:</span>
                    <CustomMiniSelect
                        options={MINUTE_OPTIONS}
                        value={sm}
                        onChange={(val) => onUpdate({ start: `${sh}:${val}` })}
                        className="w-[50px] justify-center bg-transparent border-none hover:bg-gray-200 dark:hover:bg-gray-700"
                        ariaLabel={t('time_block.time_select')}
                    />
                </div>
                <div className="w-6 h-px bg-gray-200 dark:bg-gray-700" />
                <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-1">
                    <CustomMiniSelect
                        options={HOUR_OPTIONS}
                        value={eh}
                        onChange={(val) => onUpdate({ end: `${val}:${em}` })}
                        className="w-[50px] justify-center bg-transparent border-none hover:bg-gray-200 dark:hover:bg-gray-700"
                        ariaLabel={t('time_block.time_select')}
                    />
                    <span className="text-gray-300 dark:text-gray-600 font-mono">:</span>
                    <CustomMiniSelect
                        options={MINUTE_OPTIONS}
                        value={em}
                        onChange={(val) => onUpdate({ end: `${eh}:${val}` })}
                        className="w-[50px] justify-center bg-transparent border-none hover:bg-gray-200 dark:hover:bg-gray-700"
                        ariaLabel={t('time_block.time_select')}
                    />
                </div>
            </div>

            <Button
                onClick={onDelete}
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                title={t('modal.delete')}
                onPointerDown={(e) => e.stopPropagation()}
            >
                <IconTrash className="w-4 h-4" />
            </Button>
        </div>
    );
};



