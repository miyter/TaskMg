import { Timestamp } from 'firebase/firestore';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useTimeBlocks } from '../../hooks/useTimeBlocks';
import { addTask, deleteTask, updateTask } from '../../store';
import { Recurrence, Task } from '../../store/schema';
import { useModalStore } from '../../store/ui/modal-store';
import { useSettingsStore } from '../../store/ui/settings-store';
import { cn } from '../../utils/cn';
import { ensureDate, formatForDateInput, getInitialDueDateFromRecurrence, parseDateInput } from '../../utils/date-tz';
import { ErrorMessage } from '../common/ErrorMessage';
import { IconChevronDown, IconStar, IconTrash, IconX } from '../common/Icons';
import { Modal } from '../common/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { RichTextEditor } from '../ui/RichTextEditor';
import { Select } from '../ui/Select';

import { useTranslation } from '../../core/translations';

const TASK_STATUS = {
    TODO: 'todo',
    COMPLETED: 'completed',
} as const;

// --- メインコンポーネント ---
interface TaskDetailModalProps {
    isOpen?: boolean;
    data?: Task;
    zIndex?: number;
    overlayClassName?: string;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ isOpen: propIsOpen, data: propData, zIndex, overlayClassName }) => {
    const { t } = useTranslation();
    const { closeModal, openModal } = useModalStore(); // Destructure openModal
    const isOpen = !!propIsOpen;
    const task = propData || null;
    // 新規タスク判定: IDがない、または'temp-'で始まる一時IDの場合
    const isNewTask = !task?.id || task.id.startsWith('temp-');

    // --- Hooks ---
    const { projects } = useProjects();
    const { timeBlocks } = useTimeBlocks();
    const { customDurations } = useSettingsStore();

    // --- State ---
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [projectId, setProjectId] = useState<string | null>(null);
    const [status, setStatus] = useState<string>(TASK_STATUS.TODO);
    const [isImportant, setIsImportant] = useState(false);
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [recurrence, setRecurrence] = useState<Recurrence>({ type: 'none', days: [] });
    const [timeBlockId, setTimeBlockId] = useState<string | null>(null);
    const [duration, setDuration] = useState<number | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [scheduleOpen, setScheduleOpen] = useState(false);

    // --- i18n Data ---
    const definitionRecurrenceOptions = useMemo(() => [
        { value: 'none', label: t('recurrence.none') },
        { value: 'daily', label: t('recurrence.daily') },
        { value: 'weekdays', label: t('recurrence.weekdays') },
        { value: 'weekly', label: t('recurrence.weekly') },
        { value: 'monthly', label: t('recurrence.monthly') },
    ], [t]);

    const dayLabels = useMemo(() => [
        t('days.sun'), t('days.mon'), t('days.tue'), t('days.wed'), t('days.thu'), t('days.fri'), t('days.sat')
    ], [t]);







    const [error, setError] = useState<string | null>(null);

    // --- 初期化 ---
    useEffect(() => {
        if (task) {
            setTitle(task.title || '');
            setDescription(task.description || '');
            setProjectId(task.projectId || null);
            setStatus(task.status || TASK_STATUS.TODO);
            setIsImportant(!!task.isImportant);
            setTimeBlockId(task.timeBlockId || null);
            setDuration(task.duration || null);

            // 期限日のパース
            const parsedDueDate = ensureDate(task.dueDate);
            setDueDate(parsedDueDate);

            // 繰り返し設定
            const rec = task.recurrence || { type: 'none', days: [] };
            setRecurrence(rec);

            // 繰り返し設定時で期限日がない場合、自動補完
            if (rec?.type && rec.type !== 'none' && !parsedDueDate) {
                setDueDate(getInitialDueDateFromRecurrence(rec));
            }

            // スケジュールセクションの開閉判定
            // 新規タスク時またはデータがある場合は開く
            const hasScheduleData = !!(parsedDueDate || rec?.type !== 'none' || task.timeBlockId || task.duration);
            setScheduleOpen(hasScheduleData || isNewTask);

            // プレビュー: 内容があればプレビュー、なければ編集モード
            setShowPreview(!!(task.description?.trim()));
        }
    }, [task, isOpen]); // isNewTask is derived from task

    // --- Handlers ---
    const handleSave = useCallback(async () => {
        setError(null);
        if (!title.trim()) {
            setError(t('validation.required'));
            return;
        }

        // 繰り返しがweeklyなのに曜日未選択の場合
        if (recurrence?.type === 'weekly' && (!recurrence.days || recurrence.days.length === 0)) {
            setError(t('validation.select_days'));
            return;
        }

        const updates: Partial<Task> = {
            title: title.trim(),
            description: description.trim() ?? null,
            projectId: projectId === 'none' ? null : projectId,
            status: status as Task['status'],
            isImportant: isImportant,
            dueDate: dueDate ? Timestamp.fromDate(dueDate) : null,
            recurrence: recurrence?.type === 'none' ? null : recurrence,
            timeBlockId: timeBlockId ?? null,
            duration: duration ?? undefined,
        };

        try {
            if (isNewTask) {
                await addTask(updates);
            } else {
                await updateTask(task!.id!, updates);
            }
            closeModal();
        } catch (e) {
            console.error('Failed to save task', e);
            setError(t('validation.save_fail'));
        }
    }, [title, description, projectId, status, isImportant, dueDate, recurrence, timeBlockId, duration, isNewTask, task, closeModal, t]);

    const handleDelete = useCallback(async (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        setError(null);

        if (!task?.id || isNewTask) return;

        openModal('confirmation', {
            title: t('delete'),
            message: t('modal.delete_confirm'),
            confirmLabel: t('delete'),
            variant: 'danger',
            onConfirm: async () => {
                try {
                    await deleteTask(task.id!);
                    closeModal(); // Close TaskDetailModal
                } catch (e) {
                    console.error('Failed to delete task', e);
                    setError(t('validation.delete_fail'));
                }
            }
        });
    }, [task?.id, isNewTask, closeModal, openModal, t]);

    const handleRecurrenceTypeChange = useCallback((type: string) => {
        let newDays: number[] = [];
        if (type === 'weekly') {
            newDays = recurrence?.days || [];
        } else if (type === 'weekdays') {
            newDays = [1, 2, 3, 4, 5]; // Mon-Fri
        }

        setRecurrence({
            type: type as NonNullable<Recurrence>['type'],
            days: newDays
        });
    }, [recurrence?.days]);

    const handleDayToggle = useCallback((dayIndex: number) => {
        const currentDays = recurrence?.days || [];
        const newDays = currentDays.includes(dayIndex)
            ? currentDays.filter(d => d !== dayIndex)
            : [...currentDays, dayIndex].sort((a, b) => a - b);

        // 曜日を手動操作したら、typeがweekdaysでもweekly扱いに変更して柔軟性を持たせる
        setRecurrence({
            type: 'weekly',
            days: newDays
        });
    }, [recurrence?.days]);

    // --- Memoized ---

    // Title Input: Enter to save
    const handleTitleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
            e.preventDefault();
            handleSave();
        }
    };

    // Container: Cmd/Ctrl + Enter to save
    const handleContainerKeyDown = (e: React.KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        }
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            zIndex={zIndex}
            size="xl"
            className="h-[95vh] sm:h-[85vh] w-full mx-2 sm:mx-auto mt-4 sm:mt-0 pb-safe"
            overlayClassName={overlayClassName}
        >
            <div className="flex flex-col h-full" onKeyDown={handleContainerKeyDown}>
                {/* Header - Minimal height (40-50px) */}
                <div className="px-3 sm:px-4 py-2 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2 shrink-0">
                    <div className="flex-1 min-w-0">
                        <Input
                            id="task-title"
                            name="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={handleTitleKeyDown}
                            placeholder={t('task_detail.title_placeholder')}
                            className="text-base sm:text-lg font-semibold bg-transparent border-none focus:ring-0 px-0 py-0 shadow-none h-auto rounded-none"
                            containerClassName="gap-0"
                            autoFocus
                            aria-label={t('task_detail.title_placeholder')}
                            maxLength={15}
                        />
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsImportant(!isImportant)}
                            className={cn(
                                "p-1.5 rounded-md transition-colors",
                                isImportant ? "text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/30" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            )}
                            title={isImportant ? t('task_detail.unmark_important') : t('task_detail.mark_important')}
                            aria-label={isImportant ? t('task_detail.unmark_important') : t('task_detail.mark_important')}
                        >
                            <IconStar size={16} fill={isImportant ? "currentColor" : "none"} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={closeModal}
                            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label={t('modal.close')}
                        >
                            <IconX size={16} />
                        </Button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
                    <ErrorMessage message={error} className="mb-3" />
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
                        {/* Left Column: Memo (Main Content) - Rich Text Editor */}
                        <div className="md:col-span-8 flex flex-col h-full min-h-[400px]">
                            <RichTextEditor
                                value={description}
                                onChange={setDescription}
                                placeholder={t('task_detail.description_placeholder') || "詳細を追加..."}
                                className="flex-1 flex flex-col"
                            />
                        </div>

                        {/* Divider - Vertical */}
                        <div className="hidden md:block col-span-1 w-px bg-gray-100 dark:bg-gray-800 h-full mx-auto" />

                        {/* Right Column: Settings (Sidebar style) */}
                        <div className="md:col-span-3 space-y-5 pt-1 overflow-y-auto no-scrollbar">
                            {/* Schedule Section - Flat & Collapsible */}
                            <div className="space-y-4">
                                <button
                                    type="button"
                                    onClick={() => setScheduleOpen(!scheduleOpen)}
                                    aria-expanded={scheduleOpen}
                                    className="w-full flex items-center justify-between group text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-1 border-b border-gray-100 dark:border-gray-800 hover:text-blue-500 transition-colors focus:outline-none focus:border-blue-500"
                                >
                                    <span className="flex items-center gap-2">
                                        {t('task_detail.schedule_label')}
                                    </span>
                                    <IconChevronDown className={cn("w-3 h-3 transition-transform duration-200", scheduleOpen ? "rotate-180" : "")} />
                                </button>

                                {scheduleOpen && (
                                    <div className="space-y-3 px-1 animate-in slide-in-from-top-1 fade-in duration-200">
                                        {/* Due Date */}
                                        <div className="relative group">
                                            <label htmlFor="task-due-date" className="text-xs text-gray-500 mb-1 block">{t('task_detail.due_date_label')}</label>
                                            <div
                                                className="relative cursor-pointer"
                                                onClick={() => {
                                                    const input = document.getElementById('task-due-date') as HTMLInputElement;
                                                    input?.showPicker?.();
                                                }}
                                            >
                                                <Input
                                                    type="date"
                                                    id="task-due-date"
                                                    value={dueDate ? formatForDateInput(dueDate) : ''}
                                                    onChange={(e) => setDueDate(parseDateInput(e.target.value))}
                                                    className="cursor-pointer bg-transparent border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors text-sm rounded px-2 py-1.5 h-auto w-full"
                                                />
                                            </div>
                                        </div>

                                        {/* Recurrence */}
                                        <div>
                                            <label htmlFor="task-recurrence" className="text-xs text-gray-500 mb-1 block">{t('task_detail.recurrence_label')}</label>
                                            <Select
                                                id="task-recurrence"
                                                value={recurrence?.type || 'none'}
                                                onChange={(e) => handleRecurrenceTypeChange(e.target.value)}
                                                className="bg-transparent border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors text-sm rounded px-2 py-1.5 h-auto"
                                                options={definitionRecurrenceOptions}
                                            />
                                        </div>

                                        {/* Weekly Days */}
                                        {(recurrence?.type === 'weekly' || recurrence?.type === 'weekdays') && (
                                            <div className="pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {dayLabels.map((day, idx) => {
                                                        const isSelected = recurrence.days?.includes(idx);
                                                        return (
                                                            <Button
                                                                type="button"
                                                                key={idx}
                                                                variant={isSelected ? "primary" : "outline"}
                                                                size="icon"
                                                                onClick={() => handleDayToggle(idx)}
                                                                className={cn(
                                                                    "w-7 h-7 text-xs rounded-full p-0 border",
                                                                    !isSelected && "bg-transparent text-gray-500 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                                                )}
                                                            >
                                                                {day}
                                                            </Button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* TimeBlock */}
                                        <div>
                                            <label htmlFor="task-timeblock" className="text-xs text-gray-500 mb-1 block">{t('task_detail.time_block_label')}</label>
                                            <Select
                                                id="task-timeblock"
                                                value={timeBlockId || ''}
                                                onChange={(e) => setTimeBlockId(e.target.value || null)}
                                                className="bg-transparent border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors text-sm rounded px-2 py-1.5 h-auto"
                                            >
                                                <option value="">{t('task_detail.time_block_unspecified')}</option>
                                                {timeBlocks.map(tb => (
                                                    <option key={tb.id} value={tb.id}>{tb.start} - {tb.end}</option>
                                                ))}
                                            </Select>
                                        </div>

                                        {/* Duration */}
                                        <div>
                                            <label htmlFor="task-duration" className="text-xs text-gray-500 mb-1 block">{t('task_detail.duration_label')}</label>
                                            <Select
                                                id="task-duration"
                                                value={duration || ''}
                                                onChange={(e) => setDuration(e.target.value ? parseInt(e.target.value, 10) : null)}
                                                className="bg-transparent border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors text-sm rounded px-2 py-1.5 h-auto"
                                            >
                                                <option value="">{t('task_detail.duration_none')}</option>
                                                {customDurations.map(d => (
                                                    <option key={d} value={d}>{d} {t('task_detail.duration_unit')}</option>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Project Section */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-1 border-b border-gray-100 dark:border-gray-800">
                                    {t('task_detail.project_label')}
                                </div>
                                <div className="px-1">
                                    <Select
                                        id="task-project"
                                        value={projectId || 'none'}
                                        onChange={(e) => setProjectId(e.target.value === 'none' ? null : e.target.value)}
                                        className="bg-transparent border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors text-sm rounded px-2 py-1.5 h-auto"
                                        containerClassName="gap-2"
                                    >
                                        <option value="none">{t('task_detail.project_none')}</option>
                                        {projects.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer - Compact with minimal padding */}
                <div className="px-3 sm:px-4 py-2 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
                    {!isNewTask ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDelete}
                            className="text-gray-400 hover:text-red-500 font-medium px-2"
                            leftIcon={<IconTrash size={14} />}
                        >
                            {t('task_detail.delete_button')}
                        </Button>
                    ) : (
                        <div />
                    )}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={closeModal}
                            className="font-medium"
                        >
                            {t('modal.cancel')}
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleSave}
                        >
                            {isNewTask ? t('modal.create') : t('modal.save')}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};



