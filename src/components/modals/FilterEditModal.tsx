import React, { useCallback, useEffect, useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useTimeBlocks } from '../../hooks/useTimeBlocks';
import { useWorkspace } from '../../hooks/useWorkspace';
import { parseFilterQuery as parseLogicQuery, stringifyFilterConditions } from '../../logic/filter-parser';
import { addFilter, updateFilter } from '../../store';
import { Filter } from '../../store/schema';
import { useModalStore } from '../../store/ui/modal-store';
import { ErrorMessage } from '../common/ErrorMessage';
import { Modal } from '../common/Modal';
import { SelectionBox } from '../common/SelectionBox';

const UNASSIGNED_ID = 'none';

interface FilterState {
    project: string[];
    timeblock: string[];
    duration: string[];
    date: string[];
}

const mapQueryToState = (query: string): FilterState => {
    const conditions = parseLogicQuery(query);
    return {
        project: conditions.projects,
        timeblock: conditions.timeBlocks.map(tb => (tb === 'null' || tb === 'none') ? UNASSIGNED_ID : tb),
        duration: conditions.durations.map(d => d.toString()),
        date: conditions.dates
    };
};

const durations = [30, 45, 60, 75, 90];
const dateOptions = [
    { id: 'today', name: '今日' },
    { id: 'tomorrow', name: '明日' },
    { id: 'week', name: '今週' },
    { id: 'next-week', name: '来週' }
];

interface FilterEditModalProps {
    isOpen?: boolean;
    data?: any;
    zIndex?: number;
    overlayClassName?: string;
}

export const FilterEditModal: React.FC<FilterEditModalProps> = ({ isOpen: propIsOpen, data: propData, zIndex, overlayClassName }) => {
    const { closeModal } = useModalStore();
    const isOpen = !!propIsOpen;
    const filterToEdit = propData as Filter | null;
    const isEditMode = !!filterToEdit?.id;

    const { projects } = useProjects();
    const { timeBlocks } = useTimeBlocks();
    const { workspaceId } = useWorkspace();

    const [name, setName] = useState('');
    const [state, setState] = useState<FilterState>({ project: [], timeblock: [], duration: [], date: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setName(filterToEdit?.name || '');
            setState(mapQueryToState(filterToEdit?.query || ''));
            setError(null);
            setLoading(false);
        }
    }, [isOpen, filterToEdit]);

    const handleToggle = (key: keyof FilterState, val: string) => {
        setState(prev => {
            const current = prev[key];
            const next = current.includes(val)
                ? current.filter(v => v !== val)
                : [...current, val];
            return { ...prev, [key]: next };
        });
    };

    const handleSave = useCallback(async () => {
        const trimmedName = name.trim();
        if (!trimmedName) {
            setError('フィルター名を入力してください');
            return;
        }

        const queryStr = stringifyFilterConditions({
            projects: state.project,
            timeBlocks: state.timeblock.map(v => v === UNASSIGNED_ID ? 'null' : v),
            durations: state.duration.map(Number),
            dates: state.date
        });

        if (!queryStr) {
            setError('少なくとも1つの条件を選択してください');
            return;
        }
        setLoading(true);
        setError(null);

        try {
            if (!workspaceId) {
                setError('ワークスペースが見つかりません');
                setLoading(false);
                return;
            }

            const data: any = { name: trimmedName, query: queryStr, type: 'custom' };
            if (isEditMode && filterToEdit?.id) {
                await updateFilter(workspaceId, filterToEdit.id, data);
            } else {
                await addFilter({ ...data, workspaceId });
            }

            closeModal();
        } catch (err: any) {
            setError('保存に失敗しました: ' + (err.message || '不明なエラー'));
            setLoading(false);
        }
    }, [name, state, isEditMode, filterToEdit, closeModal]);

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            title={isEditMode ? 'フィルター編集' : 'フィルター作成'}
            className="max-w-4xl"
            zIndex={zIndex}
            overlayClassName={overlayClassName}
        >
            <div className="space-y-6">
                <div>
                    <label htmlFor="filter-name-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">フィルター名</label>
                    <input
                        id="filter-name-input"
                        name="filterName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="例: 今週の重要タスク"
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
                        autoFocus
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Project Selection */}
                    <SelectionBox
                        title="プロジェクト"
                        items={projects}
                        selectedItems={state.project}
                        onToggle={(id) => handleToggle('project', id)}
                    />

                    {/* TimeBlock Selection */}
                    <SelectionBox
                        title="時間帯"
                        items={[...timeBlocks, { id: UNASSIGNED_ID, name: '未定' }]}
                        selectedItems={state.timeblock}
                        onToggle={(id) => handleToggle('timeblock', id)}
                        labelFn={(item) => (item.id === UNASSIGNED_ID || !item.start) ? item.name : `${item.start}-${item.end}`}
                    />

                    {/* Duration Selection */}
                    <SelectionBox
                        title="所要時間"
                        items={durations.map(d => ({ id: d.toString(), name: `${d} min` }))}
                        selectedItems={state.duration}
                        onToggle={(id) => handleToggle('duration', id)}
                    />

                    {/* Date Selection */}
                    <SelectionBox
                        title="日付"
                        items={dateOptions}
                        selectedItems={state.date}
                        onToggle={(id) => handleToggle('date', id)}
                    />
                </div>

                {/* Error */}
                <ErrorMessage message={error} />

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={closeModal}
                        className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition"
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md transition-all transform active:scale-95 disabled:opacity-50"
                    >
                        {loading ? '処理中...' : isEditMode ? '変更を保存' : '作成'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
