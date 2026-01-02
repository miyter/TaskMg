import React, { useState } from 'react';
import { useTranslation } from '../../core/translations';
import { InlineTaskInput } from './InlineTaskInput';

interface AddTaskButtonProps {
    initialValue?: string;
}

export const AddTaskButton: React.FC<AddTaskButtonProps> = ({ initialValue = '' }) => {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);

    React.useEffect(() => {
        if (!isEditing) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsEditing(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isEditing]);

    if (isEditing) {
        return (
            <div className="mb-2">
                <InlineTaskInput
                    onCancel={() => setIsEditing(false)}
                    onSuccess={() => setIsEditing(false)}
                    initialValue={initialValue}
                />
            </div>
        );
    }

    const buttonText = initialValue
        ? t('add_task_button.add_with_title', { title: initialValue })
        : t('add_task_button.add_task');

    return (
        <button
            onClick={() => setIsEditing(true)}
            aria-label={t('add_task_button.aria_label')}
            className="group flex items-center gap-2 w-full text-left py-2 px-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-2"
        >
            <div className="w-5 h-5 rounded-full flex items-center justify-center bg-transparent group-hover:bg-blue-100/50 dark:group-hover:bg-blue-900/30 transition-colors">
                <svg className="w-4 h-4 text-inherit" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            </div>
            <span className="text-sm font-medium">{buttonText}</span>
        </button>
    );
};




