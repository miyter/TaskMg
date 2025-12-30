import React, { useState } from 'react';
import { InlineTaskInput } from './InlineTaskInput';

export const AddTaskButton: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        return (
            <div className="mb-4">
                <InlineTaskInput
                    onCancel={() => setIsEditing(false)}
                    onSuccess={() => setIsEditing(false)}
                />
            </div>
        );
    }

    return (
        <button
            onClick={() => setIsEditing(true)}
            aria-label="新しいタスクを追加"
            className="group flex items-center gap-2 w-full text-left py-2 px-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-2"
        >
            <div className="w-5 h-5 rounded-full flex items-center justify-center bg-transparent group-hover:bg-blue-100/50 dark:group-hover:bg-blue-900/30 transition-colors">
                <svg className="w-4 h-4 text-inherit" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            </div>
            <span className="text-sm font-medium">タスクを追加</span>
        </button>
    );
};
