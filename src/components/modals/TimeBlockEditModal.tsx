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
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React, { useEffect, useState } from 'react';
import { SYSTEM_CONSTANTS } from '../../core/constants';
import { useTranslation } from '../../core/translations';
import { COLOR_PALETTE } from '../../core/ui-constants';
import { useTimeBlocks } from '../../hooks/useTimeBlocks';
import { useWorkspace } from '../../hooks/useWorkspace';
import { TimeBlock } from '../../store/schema';
import { deleteTimeBlock, saveTimeBlock } from '../../store/timeblocks';
import { useModalStore } from '../../store/ui/modal-store';
import { cn } from '../../utils/cn';
import { ErrorMessage, Modal, Portal, SortableItem } from '../common';
import { Button } from '../ui/Button';

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTE_OPTIONS = ['00', '15', '30', '45'];

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
        if (blocks.length >= SYSTEM_CONSTANTS.TIME_BLOCK.MAX_COUNT) return;

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
            className="max-w-2xl h-[600px]"
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
                                    {/* 
                                        Note: We pass a simple static version during drag for the original item? 
                                        Actually SortableItem handles opacity. 
                                        But we can style the row to look "dragged" if we used useSortable.isDragging.
                                        SortableItem implementation is: <div ref={setNodeRef} style={style} {...attrs} {...listeners}>{children}</div>
                                      */}
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

                    {blocks.length < SYSTEM_CONSTANTS.TIME_BLOCK.MAX_COUNT ? (
                        <Button
                            onClick={handleAdd}
                            disabled={blocks.length >= SYSTEM_CONSTANTS.TIME_BLOCK.MAX_COUNT}
                            variant="ghost"
                            className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium text-sm flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed shadow-none"
                            leftIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>}
                        >
                            {t('time_block.add_button')}
                        </Button>
                    ) : (
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-sm rounded-lg flex items-center justify-center gap-2 border border-yellow-100 dark:border-yellow-900/30">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            {t('time_block.max_limit')}
                        </div>
                    )}

                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span className="w-2.5 h-2.5 rounded-full bg-gray-400 mr-3 shadow-sm"></span>
                        <span className="font-bold mr-2 text-gray-700 dark:text-gray-300">{t('time_block.unspecified')}</span>
                        <span className="text-xs opacity-80">{t('time_block.default_zone_desc')}</span>
                    </div>
                </div>

                <ErrorMessage message={error} className="mb-4" />

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        isLoading={loading}
                        variant="primary"
                        className="px-8 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                        {loading ? t('saving') : t('done')}
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

const TimeBlockRow: React.FC<TimeBlockRowProps> = ({ block, onDelete, onUpdate, isOverlay }) => {
    const { t } = useTranslation();
    const [showColorPicker, setShowColorPicker] = useState(false);

    const startTime = block.start || '09:00';
    const endTime = block.end || '10:00';
    const [sh, sm] = startTime.split(':');
    const [eh, em] = endTime.split(':');

    return (
        <div className={`flex items-center gap-4 p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm group ${isOverlay ? 'shadow ring-2 ring-blue-500 opacity-90 cursor-grabbing' : ''}`}>
            <div className="relative">
                <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-6 h-6 rounded-full shadow-sm ring-2 ring-transparent focus:ring-blue-400 ring-offset-2 dark:ring-offset-gray-900"
                    style={{ backgroundColor: block.color || '#3B82F6' }}
                    title={t('time_block.change_color')}
                />
                {showColorPicker && (
                    <Portal>
                        <div
                            className="fixed inset-0 z-[9999] bg-transparent"
                            onClick={() => setShowColorPicker(false)}
                        />
                        <div
                            className="fixed z-[10000] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow p-4 w-[280px]"
                            style={{
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
                                            "w-8 h-8 rounded-full ring-2 ring-transparent hover:ring-blue-400 focus:outline-none",
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
                <div className="flex items-center gap-1.5">
                    <TimeSelect
                        options={HOUR_OPTIONS}
                        value={sh}
                        onChange={(v) => onUpdate({ start: `${v}:${sm}` })}
                    />
                    <span className="text-gray-300 dark:text-gray-600">:</span>
                    <TimeSelect
                        options={MINUTE_OPTIONS}
                        value={sm}
                        onChange={(v) => onUpdate({ start: `${sh}:${v}` })}
                    />
                </div>
                <div className="w-4 h-0.5 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex items-center gap-1.5">
                    <TimeSelect
                        options={HOUR_OPTIONS}
                        value={eh}
                        onChange={(v) => onUpdate({ end: `${v}:${em}` })}
                    />
                    <span className="text-gray-300 dark:text-gray-600">:</span>
                    <TimeSelect
                        options={MINUTE_OPTIONS}
                        value={em}
                        onChange={(v) => onUpdate({ end: `${eh}:${v}` })}
                    />
                </div>
            </div>

            <Button
                onClick={onDelete}
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                title={t('modal.delete')}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </Button>
        </div>
    );
};

const TimeSelect: React.FC<{ options: string[]; value: string; onChange: (val: string) => void; label?: string }> = ({ options, value, onChange, label }) => {
    const { t } = useTranslation();
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="appearance-none px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-sm font-mono font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none cursor-pointer"
            aria-label={label || t('time_block.time_select')}
        >
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    );
};
