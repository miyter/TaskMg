import {
    DndContext,
    DragEndEvent,
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
import { useTimeBlocks } from '../../hooks/useTimeBlocks';
import { TimeBlock } from '../../store/schema';
import { deleteTimeBlock, saveTimeBlock } from '../../store/timeblocks';
import { useModalStore } from '../../store/ui/modal-store';
import { Modal } from '../common/Modal';
import { SortableItem } from '../common/SortableItem';

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTE_OPTIONS = ['00', '15', '30', '45'];
const PRESET_COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];

export const TimeBlockEditModal: React.FC = () => {
    const { activeModal, closeModal } = useModalStore();
    const isOpen = activeModal === 'timeblock-edit';
    const { timeBlocks: storeBlocks } = useTimeBlocks();

    const [blocks, setBlocks] = useState<Partial<TimeBlock>[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
        if (blocks.length >= 10) return;
        const newBlock: Partial<TimeBlock> = {
            id: `new-${Date.now()}`,
            start: '09:00',
            end: '10:00',
            color: PRESET_COLORS[blocks.length % PRESET_COLORS.length],
            order: blocks.length
        };
        setBlocks([...blocks, newBlock]);
    };

    const handleDelete = async (id: string) => {
        if (!id.startsWith('new-')) {
            if (!confirm('この時間帯を削除しますか？')) return;
            try {
                await deleteTimeBlock(id);
            } catch (err) {
                setError('削除に失敗しました');
                return;
            }
        }
        setBlocks(blocks.filter(b => b.id !== id));
    };

    const handleUpdate = (id: string, updates: Partial<TimeBlock>) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
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
            // Validate
            for (const b of blocks) {
                if (!b.start || !b.end) continue;
                const [sh, sm] = b.start.split(':').map(Number);
                const [eh, em] = b.end.split(':').map(Number);
                if (sh * 60 + sm >= eh * 60 + em) {
                    throw new Error(`不正な時間設定があります: ${b.start}-${b.end}`);
                }
            }

            const promises = blocks.map((b, index) => {
                const data = {
                    ...b,
                    id: b.id?.startsWith('new-') ? null : b.id,
                    order: index,
                    name: `${b.start}-${b.end}`
                } as any;
                return saveTimeBlock(data);
            });

            await Promise.all(promises);
            document.dispatchEvent(new CustomEvent('timeblocks-updated'));
            closeModal();
        } catch (err: any) {
            setError(err.message || '保存に失敗しました');
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={closeModal} title="時間帯設定" className="max-w-2xl h-[600px]">
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-2 space-y-3 custom-scrollbar">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
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
                                    />
                                </SortableItem>
                            ))}
                        </SortableContext>
                    </DndContext>

                    {blocks.length < 10 ? (
                        <button
                            onClick={handleAdd}
                            className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium text-sm flex items-center justify-center gap-2 group"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            時間帯を追加
                        </button>
                    ) : (
                        <div className="text-center py-4 text-xs text-gray-400">最大10個まで登録できます</div>
                    )}

                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span className="w-2.5 h-2.5 rounded-full bg-gray-400 mr-3 shadow-sm"></span>
                        <span className="font-bold mr-2 text-gray-700 dark:text-gray-300">未定</span>
                        <span className="text-xs opacity-80">デフォルトのゾーン</span>
                    </div>
                </div>

                {error && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-8 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition-all active:scale-95 shadow-md disabled:bg-gray-400"
                    >
                        {loading ? '保存中...' : '完了'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

interface TimeBlockRowProps {
    block: Partial<TimeBlock>;
    onDelete: () => void;
    onUpdate: (upd: Partial<TimeBlock>) => void;
}

const TimeBlockRow: React.FC<TimeBlockRowProps> = ({ block, onDelete, onUpdate }) => {
    const [showColorPicker, setShowColorPicker] = useState(false);

    const startTime = block.start || '09:00';
    const endTime = block.end || '10:00';
    const [sh, sm] = startTime.split(':');
    const [eh, em] = endTime.split(':');

    return (
        <div className="flex items-center gap-4 p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm group">
            <div className="relative">
                <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-6 h-6 rounded-full shadow-sm hover:scale-110 active:scale-95 transition-transform ring-2 ring-transparent focus:ring-blue-400 ring-offset-2 dark:ring-offset-gray-900"
                    style={{ backgroundColor: block.color || '#3B82F6' }}
                    title="色を変更"
                />
                {showColorPicker && (
                    <div className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-2xl p-3 flex gap-2 w-max animate-fade-in-down">
                        {PRESET_COLORS.map(c => (
                            <button
                                key={c}
                                onClick={() => {
                                    onUpdate({ color: c });
                                    setShowColorPicker(false);
                                }}
                                className="w-6 h-6 rounded-full hover:scale-110 transition-transform ring-2 ring-transparent hover:ring-blue-400"
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
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

            <button
                onClick={onDelete}
                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="削除"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    );
};

const TimeSelect: React.FC<{ options: string[]; value: string; onChange: (val: string) => void }> = ({ options, value, onChange }) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-sm font-mono font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none cursor-pointer"
    >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
);
