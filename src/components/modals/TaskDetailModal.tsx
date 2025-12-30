import React, { useEffect, useState } from 'react';
import { useLabels } from '../../hooks/useLabels';
import { useProjects } from '../../hooks/useProjects';
import { Task } from '../../store/schema';
import { deleteTask, updateTask } from '../../store/store';
import { useModalStore } from '../../store/ui/modal-store';
import { Modal } from '../common/Modal';

export const TaskDetailModal: React.FC = () => {
    const { activeModal, modalData, closeModal } = useModalStore();
    const isOpen = activeModal === 'task-detail';
    const task = modalData as Task; // Type assertion

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [projectId, setProjectId] = useState<string | null>(null);
    const [status, setStatus] = useState('todo');
    // const [dueDate, setDueDate] = useState<Date|null>(null);

    const { projects } = useProjects();
    const { labels } = useLabels();

    // Reset state when task changes
    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setProjectId(task.projectId || null);
            setStatus(task.status || 'todo');
        }
    }, [task]);

    const handleSave = async () => {
        if (!task || !task.id) return;
        try {
            await updateTask(task.id, {
                title,
                description,
                projectId: projectId === 'none' ? null : projectId,
                status: status as any
            });
            closeModal();
        } catch (e) {
            console.error('Failed to update task', e);
            alert('Failed to update task');
        }
    };

    const handleDelete = async () => {
        if (!task || !task.id) return;
        if (confirm('Are you sure you want to delete this task?')) {
            await deleteTask(task.id);
            closeModal();
        }
    };

    if (!task) return null;

    return (
        <Modal isOpen={isOpen} onClose={closeModal} title="Edit Task" className="max-w-2xl h-[80vh]">
            <div className="flex flex-col h-full space-y-4">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* Description */}
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full h-full min-h-[150px] p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    />
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Project */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project</label>
                        <select
                            value={projectId || 'none'}
                            onChange={(e) => setProjectId(e.target.value === 'none' ? null : e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                            <option value="none">No Project</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                            <option value="todo">To Do</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                    >
                        Delete
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded transition font-medium"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
