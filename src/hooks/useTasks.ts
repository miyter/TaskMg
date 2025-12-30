import { useEffect, useState } from 'react';
import { Task } from '../store/schema';
import { subscribeToTasks } from '../store/store';
import { useWorkspace } from './useWorkspace';

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const { workspaceId } = useWorkspace();

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
