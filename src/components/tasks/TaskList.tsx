import React from 'react';
import { useTasks } from '../../hooks/useTasks';
import { AddTaskButton } from './AddTaskButton';
import { TaskItem } from './TaskItem';

export const TaskList: React.FC = () => {
    const { tasks, loading } = useTasks();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-gray-400 text-sm">Loading tasks...</div>
            </div>
        );
    }

    // Determine sort order
    const sortedTasks = [...tasks].sort((a, b) => 0); // Placeholder sort

    return (
        <div className="space-y-2 pb-20">
            {/* Input at the top for quick access, or bottom? Todoist styles put it at bottom of list usually, but top is okay too. 
                Let's put a collapsible button at the top for now as "Inbox" style. 
            */}

            <div className="mb-4">
                <AddTaskButton />
            </div>

            {tasks.length === 0 ? (
                <div className="text-center text-gray-400 py-10">
                    <p className="text-sm">No tasks found</p>
                </div>
            ) : (
                <ul className="space-y-2">
                    {sortedTasks.map(task => (
                        <TaskItem key={task.id} task={task} />
                    ))}
                </ul>
            )}
        </div>
    );
};
