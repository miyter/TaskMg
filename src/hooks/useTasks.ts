import { useEffect, useState } from 'react';
import { subscribeToTasks } from '../store';
import { Task } from '../store/schema';
import { useWorkspace } from './useWorkspace';

export const useTasks = () => {
    const { workspaceId, loading: authLoading } = useWorkspace();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!workspaceId) {
            setTasks([]);
            if (!authLoading) setLoading(false);
            return;
        }

        // ワークスペース変更時にローディング状態に戻す
        setLoading(true);
        const unsubscribe = subscribeToTasks(workspaceId, (newTasks) => {
            setTasks(newTasks);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [workspaceId, authLoading]);

    return { tasks, loading: loading || authLoading };
};
