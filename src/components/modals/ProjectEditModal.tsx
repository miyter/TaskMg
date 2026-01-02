import React, { useCallback, useEffect, useState } from 'react';
import { addProject, deleteProject, updateProject } from '../../store/projects';
import { Project } from '../../store/schema';
import { useModalStore } from '../../store/ui/modal-store';
import { useWorkspaceStore } from '../../store/ui/workspace-store';
import { cn } from '../../utils/cn';
import { ErrorMessage } from '../common/ErrorMessage';
import { IconFileText, IconTrash } from '../common/Icons';
import { Modal } from '../common/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

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
    const { closeModal, openModal } = useModalStore();
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

        openModal('confirmation', {
            title: t('delete'),
            message: t('modal.project_delete_confirm').replace('{name}', project.name),
            confirmLabel: t('delete'),
            variant: 'danger',
            onConfirm: async () => {
                setLoading(true);
                try {
                    await deleteProject(project.id!);
                    closeModal();
                } catch (err: any) {
                    setError(t('validation.delete_fail'));
                    setLoading(false);
                }
            }
        });
    }, [project, closeModal, openModal, t]);

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
                        <IconFileText size={20} />
                    </div>
                    <div className="flex-1">
                        <Input
                            ref={inputRef}
                            id="project-name-input"
                            name="projectName"
                            type="text"
                            label={t('modal.project_name')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t('modal.project_name_placeholder')}
                            className="bg-transparent border-none text-lg font-bold p-0 focus:ring-0 focus:border-transparent px-0 py-0 rounded-none h-auto"
                            containerClassName="gap-0"
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
                                    "w-6 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800",
                                    color === c.value ? "ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800" : ""
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
                                <IconTrash size={20} />
                            </button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={closeModal}
                            disabled={loading}
                            variant="ghost"
                        >
                            {t('modal.cancel')}
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            isLoading={loading}
                            variant="primary"
                        >
                            {isEdit ? t('modal.save') : t('modal.create')}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
