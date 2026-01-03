import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from '../../core/translations';
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
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';



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


interface FilterEditModalProps {
    isOpen?: boolean;
    data?: any;
    zIndex?: number;
    overlayClassName?: string;
}

export const FilterEditModal: React.FC<FilterEditModalProps> = ({ isOpen: propIsOpen, data: propData, zIndex, overlayClassName }) => {
    const { t } = useTranslation();
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

    const inputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setName(filterToEdit?.name || '');
            setState(mapQueryToState(filterToEdit?.query || ''));
            setError(null);
            setLoading(false);
        }
    }, [isOpen, filterToEdit]);

    // Error auto-focus
    useEffect(() => {
        if (error) {
            inputRef.current?.focus();
        }
    }, [error]);

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
            setError(t('validation.filter_name_required'));
            return;
        }

        const queryStr = stringifyFilterConditions({
            projects: state.project,
            timeBlocks: state.timeblock.map(v => v === UNASSIGNED_ID ? 'null' : v),
            durations: state.duration.map(Number),
            dates: state.date
        });

        if (!queryStr) {
            setError(t('validation.filter_condition_required'));
            return;
        }
        setLoading(true);
        setError(null);

        try {
            if (!workspaceId) {
                setError(t('validation.workspace_required'));
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
            setError(t('validation.save_fail') + ': ' + (err.message || 'Error'));
            setLoading(false);
        }
    }, [name, state, isEditMode, filterToEdit, closeModal, t]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
            if (!loading && name.trim()) {
                handleSave();
            }
            e.preventDefault();
        }
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            title={isEditMode ? t('modal.edit') : t('modal.create')}
            className="max-w-4xl"
            zIndex={zIndex}
            overlayClassName={overlayClassName}
        >
            <div className="space-y-6">
                <div>
                    <Input
                        ref={inputRef}
                        id="filter-name-input"
                        name="filterName"
                        label={t('filter')}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('modal.filter_name_placeholder')}
                        autoFocus
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Project Selection */}
                    <SelectionBox
                        title={t('project')}
                        items={projects}
                        selectedItems={state.project}
                        onToggle={(id) => handleToggle('project', id)}
                    />

                    {/* TimeBlock Selection */}
                    <SelectionBox
                        title={t('timeblock')}
                        items={[...timeBlocks, { id: UNASSIGNED_ID, name: t('sidebar.unassigned') }] as any[]}
                        selectedItems={state.timeblock}
                        onToggle={(id) => handleToggle('timeblock', id)}
                        labelFn={(item: any) => (item.id === UNASSIGNED_ID || !item.start) ? item.name : `${item.start}-${item.end}`}
                    />

                    {/* Duration Selection */}
                    <SelectionBox
                        title={t('modal.duration')}
                        items={durations.map(d => ({ id: d.toString(), name: `${d} min` }))}
                        selectedItems={state.duration}
                        onToggle={(id) => handleToggle('duration', id)}
                    />

                    {/* Date Selection */}
                    <SelectionBox
                        title={t('modal.due_date')}
                        items={[
                            { id: 'today', name: t('date_options.today') },
                            { id: 'tomorrow', name: t('date_options.tomorrow') },
                            { id: 'week', name: t('date_options.week') },
                            { id: 'next-week', name: t('date_options.next_week') }
                        ]}
                        selectedItems={state.date}
                        onToggle={(id) => handleToggle('date', id)}
                    />
                </div>

                {/* Error */}
                <ErrorMessage message={error} />

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <Button
                        onClick={closeModal}
                        disabled={loading}
                        variant="ghost"
                        className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                        {t('modal.cancel')}
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        isLoading={loading}
                        variant="primary"
                    >
                        {loading ? '...' : isEditMode ? t('modal.save') : t('modal.create')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};



