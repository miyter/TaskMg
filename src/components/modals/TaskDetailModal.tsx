import { Timestamp } from 'firebase/firestore';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useTimeBlocks } from '../../hooks/useTimeBlocks';
import { addTask, deleteTask, updateTask } from '../../store';
import { Recurrence, Task } from '../../store/schema';
import { useModalStore } from '../../store/ui/modal-store';
import { useSettingsStore } from '../../store/ui/settings-store';
import { cn } from '../../utils/cn';
import { formatDateForInput, getInitialDueDateFromRecurrence, parseDateInput, toDate } from '../../utils/date';
import { simpleMarkdownToHtml } from '../../utils/markdown';
import { ErrorMessage } from '../common/ErrorMessage';
import { Modal } from '../common/Modal';

import { useTranslation } from '../../core/translations';

const TASK_STATUS = {
    TODO: 'todo',
    COMPLETED: 'completed',
} as const;

// --- メインコンポーネント ---
interface TaskDetailModalProps {
    isOpen?: boolean;
    data?: any;
    zIndex?: number;
    overlayClassName?: string;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ isOpen: propIsOpen, data: propData, zIndex, overlayClassName }) => {
    const { t } = useTranslation();
    const { closeModal } = useModalStore();
    const isOpen = !!propIsOpen;
    const task = propData as Task | null;
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
            const parsedDueDate = toDate(task.dueDate);
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

        if (!confirm(t('modal.delete_confirm'))) return;

        try {
            await deleteTask(task.id);
            closeModal();
        } catch (e) {
            console.error('Failed to delete task', e);
            setError(t('validation.delete_fail'));
        }
    }, [task?.id, isNewTask, closeModal, t]);

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
    const previewHtml = useMemo(() => simpleMarkdownToHtml(description), [description]);

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
            className="max-w-4xl h-[95vh] sm:h-[85vh] w-full mx-2 sm:mx-auto mt-4 sm:mt-0 pb-safe"
            overlayClassName={overlayClassName}
        >
            <div className="flex flex-col h-full" onKeyDown={handleContainerKeyDown}>
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 shrink-0">
                    <input
                        id="task-title"
                        name="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={handleTitleKeyDown}
                        placeholder={t('task_detail.title_placeholder')}
                        className="flex-1 text-xl font-bold bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                        autoFocus
                        aria-label={t('task_detail.title_placeholder')}
                    />
                    <button
                        onClick={() => setIsImportant(!isImportant)}
                        className={cn(
                            "p-2 rounded-full transition-colors",
                            isImportant ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                        title={isImportant ? "重要度を解除" : "重要としてマーク"}
                    >
                        <svg className="w-6 h-6" fill={isImportant ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                    </button>
                    <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="閉じる"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <ErrorMessage message={error} className="mb-3" />
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
                        {/* Left Column: Memo */}
                        <div className="md:col-span-8 flex flex-col h-full min-h-[300px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-semibold text-gray-500 flex items-center gap-2 uppercase">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    メモ (Markdown)
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-3 py-1 rounded transition-colors text-xs font-medium"
                                    aria-label={showPreview ? '編集モードに切り替え' : 'プレビューモードに切り替え'}
                                >
                                    {showPreview ? '編集' : 'プレビュー'}
                                </button>
                            </div>
                            <div className="flex-1 relative">
                                {showPreview ? (
                                    <div
                                        className="w-full h-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm overflow-y-auto prose prose-sm dark:prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: previewHtml || '<span class="text-gray-400">メモがありません</span>' }}
                                    />
                                ) : (
                                    <textarea
                                        id="task-description"
                                        name="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="詳細を入力..."
                                        className="w-full h-full p-3 bg-gray-50 dark:bg-gray-900/50 border-0 rounded-lg outline-none text-sm transition-all resize-none leading-relaxed focus:ring-1 focus:ring-blue-500/50 text-gray-800 dark:text-gray-200 font-mono"
                                        autoFocus={!description}
                                        aria-label="詳細メモ"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Right Column: Settings */}
                        <div className="md:col-span-4 space-y-4">
                            {/* Schedule Section */}
                            <details open={scheduleOpen} onToggle={(e) => setScheduleOpen(e.currentTarget.open)} className="group border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                                <summary
                                    className="flex items-center justify-between px-4 py-3 cursor-pointer list-none outline-none bg-gray-50 dark:bg-gray-700/30 rounded-t-lg group-[:not([open])]:rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50 focus:ring-2 focus:ring-inset focus:ring-blue-500"
                                    role="button"
                                    aria-expanded={scheduleOpen}
                                >
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {t('task_detail.schedule_label')}
                                    </span>
                                    <span className="transform group-open:rotate-180 transition-transform text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </span>
                                </summary>
                                <div className="p-4 flex flex-col gap-4">
                                    {/* Due Date */}
                                    <div>
                                        <label htmlFor="task-due-date" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">{t('task_detail.due_date_label')}</label>
                                        <div
                                            className="relative cursor-pointer"
                                            onClick={() => {
                                                const input = document.getElementById('task-due-date') as HTMLInputElement;
                                                input?.showPicker?.();
                                            }}
                                        >
                                            <input
                                                type="date"
                                                id="task-due-date"
                                                value={formatDateForInput(dueDate)}
                                                onChange={(e) => setDueDate(parseDateInput(e.target.value))}
                                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    {/* Recurrence */}
                                    <div>
                                        <label htmlFor="task-recurrence" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">{t('task_detail.recurrence_label')}</label>
                                        <select
                                            id="task-recurrence"
                                            value={recurrence?.type || 'none'}
                                            onChange={(e) => handleRecurrenceTypeChange(e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm appearance-none cursor-pointer"
                                        >
                                            {definitionRecurrenceOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Weekly Days */}
                                    {(recurrence?.type === 'weekly' || recurrence?.type === 'weekdays') && (
                                        <div className="pt-2 border-t border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <span className="block text-xs font-semibold text-gray-500 mb-2 uppercase">{t('task_detail.recurrence_days')}</span>
                                            <div className="flex flex-wrap gap-2">
                                                {dayLabels.map((day, idx) => (
                                                    <label key={idx} htmlFor={`recurrence-day-${idx}`} className="flex items-center gap-1 cursor-pointer select-none">
                                                        <input
                                                            id={`recurrence-day-${idx}`}
                                                            name={`recurrenceDay${idx}`}
                                                            type="checkbox"
                                                            checked={recurrence.days?.includes(idx) || false}
                                                            onChange={() => handleDayToggle(idx)}
                                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span className="text-xs text-gray-700 dark:text-gray-300">{day}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* TimeBlock */}
                                    <div>
                                        <label htmlFor="task-timeblock" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">{t('task_detail.time_block_label')}</label>
                                        <select
                                            id="task-timeblock"
                                            value={timeBlockId || ''}
                                            onChange={(e) => setTimeBlockId(e.target.value || null)}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm appearance-none cursor-pointer"
                                        >
                                            <option value="">{t('task_detail.time_block_unspecified')}</option>
                                            {timeBlocks.map(tb => (
                                                <option key={tb.id} value={tb.id}>{tb.start} - {tb.end}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Duration */}
                                    <div>
                                        <label htmlFor="task-duration" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">{t('task_detail.duration_label')}</label>
                                        <select
                                            id="task-duration"
                                            value={duration || ''}
                                            onChange={(e) => setDuration(e.target.value ? parseInt(e.target.value, 10) : null)}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm appearance-none cursor-pointer"
                                        >
                                            <option value="">{t('task_detail.duration_none')}</option>
                                            {customDurations.map(d => (
                                                <option key={d} value={d}>{d} min</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </details>

                            {/* Project */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                <label htmlFor="task-project" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">{t('task_detail.project_label')}</label>
                                <select
                                    id="task-project"
                                    value={projectId || 'none'}
                                    onChange={(e) => setProjectId(e.target.value === 'none' ? null : e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm appearance-none cursor-pointer"
                                >
                                    <option value="none">{t('task_detail.project_none')}</option>
                                    {projects.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center shrink-0">
                    {!isNewTask && (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition flex items-center gap-1.5"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                {t('task_detail.delete_button')}
                            </button>
                        </div>
                    )}
                    <div className={`flex gap-2 ${isNewTask ? 'ml-auto' : ''}`}>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                        >
                            {t('modal.cancel')}
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors"
                        >
                            {isNewTask ? t('modal.create') : t('modal.save')}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
