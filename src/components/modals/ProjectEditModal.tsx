import React, { useCallback, useEffect, useState } from 'react';
import { addProject, deleteProject, updateProject } from '../../store/projects';
import { Project } from '../../store/schema';
import { useModalStore } from '../../store/ui/modal-store';
import { useWorkspaceStore } from '../../store/ui/workspace-store';
import { cn } from '../../utils/cn';
import { ErrorMessage } from '../common/ErrorMessage';
import { Modal } from '../common/Modal';

import { useTranslation } from '../../core/translations';
import { COLOR_PALETTE } from '../../core/ui-constants';

/**
 * プロジェクト編集/作成モーダル (React版)
 */
interface ProjectEditModalProps {
    isOpen?: boolean;
    data?: any;
    zIndex?: number;
    overlayClassName?: string;
}

export const ProjectEditModal: React.FC<ProjectEditModalProps> = ({ isOpen: propIsOpen, data: propData, zIndex, overlayClassName }) => {
    const { t } = useTranslation();
    const { closeModal } = useModalStore();
    const { currentWorkspaceId } = useWorkspaceStore();

    const isOpen = !!propIsOpen;
    const project = propData as Project | null;
    const isEdit = !!project?.id;

    const [name, setName] = useState('');
    const [color, setColor] = useState('#7E57C2');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const inputRef = React.useRef<HTMLInputElement>(null);

    // 初期化
    useEffect(() => {
        if (isOpen) {
            setName(project?.name || '');
            setColor(project?.color || COLOR_PALETTE[3].value); // Default to a nice purple
            setError(null);
            setLoading(false);
        }
    }, [isOpen, project]);

    // Error auto-focus
    useEffect(() => {
        if (error) {
            inputRef.current?.focus();
        }
    }, [error]);

    const handleSave = useCallback(async () => {
        const trimmedName = name.trim();
        if (!trimmedName) {
            setError(t('validation.project_name_required'));
            return;
        }

        if (!currentWorkspaceId && !isEdit) {
            setError(t('validation.workspace_required'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (isEdit && project?.id) {
                await updateProject(project.id, { name: trimmedName, color });
            } else if (currentWorkspaceId) {
                await addProject(trimmedName, currentWorkspaceId, color);
            }
            closeModal();
        } catch (err: any) {
            setError(t('validation.save_fail') + ': ' + (err.message || 'Error'));
            setLoading(false);
        }
    }, [name, color, isEdit, project, currentWorkspaceId, closeModal, t]);

    const handleDelete = useCallback(async () => {
        if (!project?.id) return;
        if (!confirm(t('modal.project_delete_confirm').replace('{name}', project.name))) return;

        setLoading(true);
        try {
            await deleteProject(project.id);
            closeModal();
        } catch (err: any) {
            setError(t('validation.delete_fail'));
            setLoading(false);
        }
    }, [project, closeModal, t]);

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
            className="max-w-sm"
            zIndex={zIndex}
            overlayClassName={overlayClassName}
        >
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <label htmlFor="project-name-input" className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                            {t('modal.project_name')}
                        </label>
                        <input
                            ref={inputRef}
                            id="project-name-input"
                            name="projectName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t('modal.project_name_placeholder')}
                            className="w-full text-lg font-bold bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 p-0"
                            autoFocus
                            aria-describedby={error ? "project-error-msg" : undefined}
                        />
                    </div>
                </div>

                {/* Color Selection (Previously missing) */}
                <div>
                    <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                        {t('modal.theme_color')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {COLOR_PALETTE.map(c => (
                            <button
                                key={c.value}
                                type="button"
                                onClick={() => setColor(c.value)}
                                className={cn(
                                    "w-6 h-6 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800",
                                    color === c.value ? "ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800 scale-110" : ""
                                )}
                                style={{ backgroundColor: c.value }}
                                aria-label={t(`colors.${c.key}` as any)}
                                aria-pressed={color === c.value}
                            />
                        ))}
                    </div>
                </div>

                {/* Error */}
                <ErrorMessage message={error} id="project-error-msg" />

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        {isEdit && (
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
                                aria-label={t('modal.delete_project')}
                                title={t('modal.delete_project')}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={closeModal}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition disabled:opacity-50"
                        >
                            {t('modal.cancel')}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? '...' : isEdit ? t('modal.save') : t('modal.create')}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
