import { Timestamp } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useTimeBlocks } from '../../hooks/useTimeBlocks';
import { addTask, deleteTask, updateTask } from '../../store';
import { Recurrence, Task } from '../../store/schema';
import { useModalStore } from '../../store/ui/modal-store';
import { cn } from '../../utils/cn';
import { formatDateForInput, getInitialDueDateFromRecurrence, parseDateInput, toDate } from '../../utils/date';
import { simpleMarkdownToHtml } from '../../utils/markdown';
import { Modal } from '../common/Modal';

// --- 定数 ---
const DURATION_OPTIONS = [15, 30, 45, 60, 75, 90, 120];
const RECURRENCE_OPTIONS = [
    { value: 'none', label: 'なし' },
    { value: 'daily', label: '毎日' },
    { value: 'weekdays', label: '平日' },
    { value: 'weekly', label: '毎週' },
    { value: 'monthly', label: '毎月' },
];
const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

// --- メインコンポーネント ---
interface TaskDetailModalProps {
    isOpen?: boolean;
    data?: any;
    zIndex?: number;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ isOpen: propIsOpen, data: propData, zIndex }) => {
    const { activeModal, modalData, closeModal } = useModalStore();
    const isOpen = propIsOpen ?? (activeModal === 'task-detail');
    const task = (propData ?? modalData) as Task | null;
    // 新規タスク判定: IDがない、または'temp-'で始まる一時IDの場合
    const isNewTask = !task?.id || task.id.startsWith('temp-');

    // --- Hooks ---
    const { projects } = useProjects();
    const { timeBlocks } = useTimeBlocks();

    // --- State ---
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [projectId, setProjectId] = useState<string | null>(null);
    const [status, setStatus] = useState('todo');
    const [isImportant, setIsImportant] = useState(false);
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [recurrence, setRecurrence] = useState<Recurrence>({ type: 'none', days: [] });
    const [timeBlockId, setTimeBlockId] = useState<string | null>(null);
    const [duration, setDuration] = useState<number | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [scheduleOpen, setScheduleOpen] = useState(false);

    // --- 初期化 ---
    useEffect(() => {
        if (task) {
            setTitle(task.title || '');
            setDescription(task.description || '');
            setProjectId(task.projectId || null);
            setStatus(task.status || 'todo');
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
            const hasScheduleData = !!(parsedDueDate || rec?.type !== 'none' || task.timeBlockId || task.duration);
            setScheduleOpen(hasScheduleData);

            // プレビュー: 内容があればプレビュー、なければ編集モード
            setShowPreview(!!(task.description?.trim()));
        }
    }, [task]);

    // --- Handlers ---
    // Note: useCallbackを使用しない理由:
    // - モーダルは開閉のたびに再マウントされるため、メモ化の効果が限定的
    // - 多数の依存配列を管理するオーバーヘッドより、シンプルな関数定義が保守性に優れる
    const handleSave = async () => {
        if (!title.trim()) {
            alert('タイトルを入力してください');
            return;
        }

        // 繰り返しがweeklyなのに曜日未選択の場合
        if (recurrence?.type === 'weekly' && (!recurrence.days || recurrence.days.length === 0)) {
            alert('曜日を選択してください');
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
                await addTask({
                    ...updates,
                    title: updates.title!,
                } as any);
            } else {
                await updateTask(task!.id!, updates);
            }
            closeModal();
        } catch (e) {
            console.error('Failed to save task', e);
            alert('保存に失敗しました');
        }
    };

    const handleDelete = async () => {
        if (!task?.id || isNewTask) return;
        if (confirm('本当に削除しますか？')) {
            try {
                await deleteTask(task.id);
                closeModal();
            } catch (e) {
                console.error('Failed to delete task', e);
                alert('削除に失敗しました');
            }
        }
    };

    const handleRecurrenceTypeChange = (type: string) => {
        setRecurrence({
            type: type as 'none' | 'daily' | 'weekly' | 'weekdays' | 'monthly' | null,
            days: type === 'weekly' ? (recurrence?.days || []) : []
        });
    };

    const handleDayToggle = (dayIndex: number) => {
        const currentDays = recurrence?.days || [];
        const newDays = currentDays.includes(dayIndex)
            ? currentDays.filter(d => d !== dayIndex)
            : [...currentDays, dayIndex].sort((a, b) => a - b);
        setRecurrence({
            type: recurrence?.type || 'weekly',
            days: newDays
        });
    };

    // --- Memoized ---
    const previewHtml = useMemo(() => simpleMarkdownToHtml(description), [description]);

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={closeModal} zIndex={zIndex} className="max-w-4xl h-[85vh]">
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4 shrink-0">
                    <input
                        id="task-title"
                        name="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="タスクのタイトル"
                        className="flex-1 text-xl font-bold bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                        autoFocus
                        aria-label="タスクのタイトル"
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
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
                        {/* Left Column: Memo */}
                        <div className="md:col-span-8 flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
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
                                    className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-2 py-0.5 rounded transition-colors text-xs font-medium"
                                >
                                    {showPreview ? '編集' : 'プレビュー'}
                                </button>
                            </div>
                            <div className="flex-1 relative min-h-[200px]">
                                {showPreview ? (
                                    <div
                                        onClick={() => setShowPreview(false)}
                                        className="w-full h-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm overflow-y-auto cursor-text prose prose-sm dark:prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: previewHtml || '<span class="text-gray-400">メモを入力...</span>' }}
                                    />
                                ) : (
                                    <textarea
                                        id="task-description"
                                        name="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        onBlur={() => description.trim() && setShowPreview(true)}
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
                            <details open={scheduleOpen} onToggle={(e) => setScheduleOpen(e.currentTarget.open)} className="group border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none outline-none bg-gray-50 dark:bg-gray-700/30 rounded-t-lg group-[:not([open])]:rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50">
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        スケジュール
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
                                        <label htmlFor="task-due-date" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">期限日</label>
                                        <input
                                            type="date"
                                            id="task-due-date"
                                            value={formatDateForInput(dueDate)}
                                            onChange={(e) => setDueDate(parseDateInput(e.target.value))}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                                        />
                                    </div>

                                    {/* Recurrence */}
                                    <div>
                                        <label htmlFor="task-recurrence" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">繰り返し</label>
                                        <select
                                            id="task-recurrence"
                                            value={recurrence?.type || 'none'}
                                            onChange={(e) => handleRecurrenceTypeChange(e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm appearance-none cursor-pointer"
                                        >
                                            {RECURRENCE_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Weekly Days */}
                                    {recurrence?.type === 'weekly' && (
                                        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                            <span className="block text-xs font-semibold text-gray-500 mb-2 uppercase">繰り返す曜日</span>
                                            <div className="flex flex-wrap gap-2">
                                                {DAY_LABELS.map((day, idx) => (
                                                    <label key={idx} className="flex items-center gap-1 cursor-pointer select-none">
                                                        <input
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
                                        <label htmlFor="task-timeblock" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">時間帯</label>
                                        <select
                                            id="task-timeblock"
                                            value={timeBlockId || ''}
                                            onChange={(e) => setTimeBlockId(e.target.value || null)}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm appearance-none cursor-pointer"
                                        >
                                            <option value="">未定</option>
                                            {timeBlocks.map(tb => (
                                                <option key={tb.id} value={tb.id}>{tb.start} - {tb.end}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Duration */}
                                    <div>
                                        <label htmlFor="task-duration" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">所要時間</label>
                                        <select
                                            id="task-duration"
                                            value={duration || ''}
                                            onChange={(e) => setDuration(e.target.value ? parseInt(e.target.value, 10) : null)}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm appearance-none cursor-pointer"
                                        >
                                            <option value="">指定なし</option>
                                            {DURATION_OPTIONS.map(d => (
                                                <option key={d} value={d}>{d} min</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </details>

                            {/* Project */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
                                <label htmlFor="task-project" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">プロジェクト</label>
                                <select
                                    id="task-project"
                                    value={projectId || 'none'}
                                    onChange={(e) => setProjectId(e.target.value === 'none' ? null : e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm appearance-none cursor-pointer"
                                >
                                    <option value="none">プロジェクトなし</option>
                                    {projects.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Status */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
                                <label htmlFor="task-status" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">ステータス</label>
                                <select
                                    id="task-status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm appearance-none cursor-pointer"
                                >
                                    <option value="todo">To Do</option>
                                    <option value="completed">完了</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center shrink-0">
                    {!isNewTask && (
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition flex items-center gap-1.5"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            削除
                        </button>
                    )}
                    <div className={`flex gap-2 ${isNewTask ? 'ml-auto' : ''}`}>
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                        >
                            キャンセル
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium shadow-md transition transform active:scale-95"
                        >
                            {isNewTask ? '作成' : '保存'}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
