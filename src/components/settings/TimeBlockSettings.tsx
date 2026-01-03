
import React, { useState } from 'react';
import { useTranslation } from '../../core/translations';
import { UI_CONFIG } from '../../core/ui-constants';
import { useTimeBlocks } from '../../hooks/useTimeBlocks';
import { useWorkspace } from '../../hooks/useWorkspace';
import { TimeBlock } from '../../store/schema';
import { deleteTimeBlock, saveTimeBlock } from '../../store/timeblocks';
import { useModalStore } from '../../store/ui/modal-store';
import { IconCheck, IconEdit, IconPlus, IconTrash, IconX } from '../common/Icons';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const TimeBlockSettings: React.FC = () => {
    const { t } = useTranslation();
    const { timeBlocks } = useTimeBlocks();
    const { workspaceId } = useWorkspace();
    const { openModal } = useModalStore();

    // Edit state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<TimeBlock>>({});

    const handleEditStart = (block: TimeBlock) => {
        setEditingId(block.id || null);
        setEditForm({ ...block });
    };

    const handleAddStart = () => {
        setEditingId('new');
        setEditForm({
            name: '',
            start: '09:00',
            end: '10:00',
            color: UI_CONFIG.DEFAULT_COLORS.TIME_BLOCK
        });
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleSave = async () => {
        if (!workspaceId || !editForm.start || !editForm.end) return;

        await saveTimeBlock(workspaceId, editForm);
        setEditingId(null);
        setEditForm({});
    };

    const handleDelete = (id: string, name: string) => {
        if (!workspaceId) return;

        openModal('confirmation', {
            title: t('delete'),
            message: `${t('timeblocks')}: ${name || 'Time Block'} \n${t('msg.confirm_delete')} `,
            confirmLabel: t('delete'),
            variant: 'danger',
            onConfirm: async () => {
                await deleteTimeBlock(workspaceId, id);
            }
        });
    };

    return (
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <span>📅</span> {t('timeblocks')}
                </h4>
                {editingId !== 'new' && (
                    <Button onClick={handleAddStart} size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 h-8 px-2">
                        <IconPlus className="w-4 h-4 mr-1" />
                        {t('add')}
                    </Button>
                )}
            </div>

            <div className="space-y-2">
                {/* List Mode */}
                {timeBlocks.length === 0 && editingId !== 'new' && (
                    <div className="text-sm text-gray-500 italic py-2">{t('no_items') || "No time blocks defined."}</div>
                )}

                {timeBlocks.map(block => (
                    <div key={block.id} className="group flex items-center gap-3 p-3 bg-white dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm transition-all">
                        {editingId === block.id ? (
                            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 items-center">
                                <Input
                                    value={editForm.name || ''}
                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                    placeholder="Name (Optional)"
                                    className="h-8 text-sm col-span-2 sm:col-span-1"
                                />
                                <Input
                                    type="time"
                                    value={editForm.start || ''}
                                    onChange={e => setEditForm({ ...editForm, start: e.target.value })}
                                    className="h-8 text-sm"
                                />
                                <Input
                                    type="time"
                                    value={editForm.end || ''}
                                    onChange={e => setEditForm({ ...editForm, end: e.target.value })}
                                    className="h-8 text-sm"
                                />
                                <div className="flex items-center gap-1 justify-end col-span-2 sm:col-span-1">
                                    <Button onClick={handleSave} size="sm" variant="primary" className="h-8 w-8 p-0 rounded-full">
                                        <IconCheck className="w-4 h-4" />
                                    </Button>
                                    <Button onClick={handleCancel} size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full text-gray-500">
                                        <IconX className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: block.color || UI_CONFIG.DEFAULT_COLORS.TIME_BLOCK_INACTIVE }} />
                                <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                                    <span className="font-bold text-gray-800 dark:text-gray-200 truncate">{block.name || '(No Name)'}</span>
                                    <span className="font-mono text-gray-500 text-xs sm:text-sm">{block.start} - {block.end}</span>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEditStart(block)}
                                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                                    >
                                        <IconEdit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(block.id!, block.name || '')}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                    >
                                        <IconTrash className="w-4 h-4" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}

                {/* Add New Item Form */}
                {editingId === 'new' && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800 animate-in fade-in slide-in-from-top-2">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-center">
                            <Input
                                value={editForm.name || ''}
                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                placeholder="Name"
                                className="h-9 text-sm col-span-2 sm:col-span-1 bg-white dark:bg-gray-800"
                                autoFocus
                            />
                            <Input
                                type="time"
                                value={editForm.start || ''}
                                onChange={e => setEditForm({ ...editForm, start: e.target.value })}
                                className="h-9 text-sm bg-white dark:bg-gray-800"
                            />
                            <Input
                                type="time"
                                value={editForm.end || ''}
                                onChange={e => setEditForm({ ...editForm, end: e.target.value })}
                                className="h-9 text-sm bg-white dark:bg-gray-800"
                            />
                            <div className="flex items-center gap-2 justify-end col-span-2 sm:col-span-1">
                                <Button onClick={handleSave} size="sm" variant="primary" className="h-9 w-9 p-0 rounded-full">
                                    <IconCheck className="w-4 h-4" />
                                </Button>
                                <Button onClick={handleCancel} size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-full text-gray-500 hover:bg-white dark:hover:bg-gray-800">
                                    <IconX className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {t('settings_modal.timeblocks.description') || "Time blocks help you organize your day."}
            </p>
        </div>
    );
};
