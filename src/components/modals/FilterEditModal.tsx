import React, { useCallback, useEffect, useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useTimeBlocks } from '../../hooks/useTimeBlocks';
import { addFilter, updateFilter } from '../../store';
import { Filter } from '../../store/schema';
import { useModalStore } from '../../store/ui/modal-store';
import { Modal } from '../common/Modal';

const UNASSIGNED_ID = 'none';

interface FilterState {
    project: string[];
    timeblock: string[];
    duration: string[];
    date: string[];
}

const parseFilterQuery = (query: string): FilterState => {
    const result: FilterState = { project: [], timeblock: [], duration: [], date: [] };
    if (!query) return result;

    query.split(/\s+/).forEach(part => {
        if (!part.includes(':')) return;
        const [key, val] = part.split(':');
        if (Object.prototype.hasOwnProperty.call(result, key)) {
            const values = val.split(',').map(v => {
                if (key === 'timeblock' && (v === 'null' || v === 'none')) return UNASSIGNED_ID;
                return v;
            });
            result[key as keyof FilterState] = [...result[key as keyof FilterState], ...values];
        }
    });
    return result;
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
}

export const FilterEditModal: React.FC<FilterEditModalProps> = ({ isOpen: propIsOpen, data: propData, zIndex }) => {
    const { closeModal } = useModalStore();
    const isOpen = !!propIsOpen;
    const filterToEdit = propData as Filter | null;
    const isEditMode = !!filterToEdit?.id;

    const { projects } = useProjects();
    const { timeBlocks } = useTimeBlocks();

    const [name, setName] = useState('');
    const [state, setState] = useState<FilterState>({ project: [], timeblock: [], duration: [], date: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setName(filterToEdit?.name || '');
            setState(parseFilterQuery(filterToEdit?.query || ''));
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

        const queryMap = {
            project: state.project,
            timeblock: state.timeblock.map(v => v === UNASSIGNED_ID ? 'null' : v),
            duration: state.duration,
            date: state.date
        };

        const queryParts = Object.entries(queryMap)
            .filter(([_, v]) => v.length > 0)
            .map(([k, v]) => `${k}:${v.join(',')}`);

        if (queryParts.length === 0) {
            setError('少なくとも1つの条件を選択してください');
            return;
        }

        const queryStr = queryParts.join(' ');
        setLoading(true);
        setError(null);

        try {
            const data: any = { name: trimmedName, query: queryStr, type: 'custom' };
            if (isEditMode && filterToEdit?.id) {
                await updateFilter(filterToEdit.id, data);
            } else {
                await addFilter(data);
            }
            document.dispatchEvent(new CustomEvent('filters-updated'));
            closeModal();
        } catch (err: any) {
            setError('保存に失敗しました: ' + (err.message || '不明なエラー'));
            setLoading(false);
        }
    }, [name, state, isEditMode, filterToEdit, closeModal]);

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={closeModal} title={isEditMode ? 'フィルター編集' : 'フィルター作成'} className="max-w-4xl">
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

                {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                )}

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

interface SelectionBoxProps {
    title: string;
    items: any[];
    selectedItems: string[];
    onToggle: (id: string) => void;
    labelFn?: (item: any) => string;
}

const SelectionBox: React.FC<SelectionBoxProps> = ({ title, items, selectedItems, onToggle, labelFn = (i: any) => i.name }) => {
    return (
        <div className="flex flex-col h-64 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-gray-500 uppercase tracking-wider">
                {title}
            </div>
            <div className="p-2 overflow-y-auto space-y-1 custom-scrollbar">
                {items.map((item) => {
                    const id = item.id || item.toString();
                    const isChecked = selectedItems.includes(id);
                    const inputId = `filter-${title}-${id}`;
                    return (
                        <div
                            key={id}
                            className="flex items-center px-2 py-1.5 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                            onClick={() => onToggle(id)}
                        >
                            <input
                                id={inputId}
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => { }}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                aria-label={`${title}: ${labelFn(item)}`}
                            />
                            <label htmlFor={inputId} className="ml-2 text-sm text-gray-700 dark:text-gray-300 truncate flex-1 cursor-pointer pointer-events-none">
                                {labelFn(item)}
                            </label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
