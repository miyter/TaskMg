import { useEffect, useState } from 'react';
import { getTasks, isTasksInitialized, subscribeToTasks } from '../store';
import { Task } from '../store/schema';
import { useWorkspace } from './useWorkspace';

export const useTasks = () => {
    const { workspaceId, loading: authLoading } = useWorkspace();

    const [tasks, setTasks] = useState<Task[]>(() => {
        if (workspaceId) return getTasks(workspaceId);
        return [];
    });

    const [loading, setLoading] = useState(() => {
        if (!workspaceId) return true;
        return !isTasksInitialized(workspaceId);
    });

    useEffect(() => {
        let isMounted = true;

        if (!workspaceId) {
            setTasks([]);
            // workspaceIdがない場合、認証ロード中でなければロード完了扱い
            if (!authLoading) setLoading(false);
            return;
        }

        // ワークスペース変更時
        if (isTasksInitialized(workspaceId)) {
            setTasks(getTasks(workspaceId));
            setLoading(false);
        } else {
            setTasks([]);
            setLoading(true);
        }

        const unsubscribe = subscribeToTasks(workspaceId, (newTasks) => {
            if (isMounted) {
                setTasks(newTasks);
                setLoading(false);
            }
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, [workspaceId, authLoading]);

    return { tasks, loading: loading || authLoading };
};
