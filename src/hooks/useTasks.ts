import { useEffect, useState } from 'react';
import { Task } from '../store/schema';
import { subscribeToTasks } from '../store/store';
import { getCurrentWorkspaceId } from '../store/workspace';

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const workspaceId = getCurrentWorkspaceId();

    useEffect(() => {
        if (!workspaceId) {
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToTasks(workspaceId, (newTasks) => {
            setTasks(newTasks);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [workspaceId]);

    return { tasks, loading };
};
