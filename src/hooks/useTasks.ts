import { useLayoutEffect, useRef, useState } from 'react';
import { getTasks, isTasksInitialized, subscribeToTasks } from '../store';
import { Task } from '../store/schema';
import { useWorkspace } from './useWorkspace';

export const useTasks = () => {
    const { workspaceId, loading: authLoading } = useWorkspace();
    const isCancelledRef = useRef(false);

    const [tasks, setTasks] = useState<Task[]>(() => {
        if (workspaceId) return getTasks(workspaceId);
        return [];
    });

    const [loading, setLoading] = useState(() => {
        if (!workspaceId) return true;
        return !isTasksInitialized(workspaceId);
    });

    useLayoutEffect(() => {
        isCancelledRef.current = false;

        if (!workspaceId) {
            setTasks([]);
            if (!authLoading) setLoading(false);
            return;
        }

        // ワークスペース変更検知：キャッシュがあれば即表示、なければローディング
        if (isTasksInitialized(workspaceId)) {
            setTasks(getTasks(workspaceId));
            setLoading(false);
        } else {
            setTasks([]);
            setLoading(true);
        }

        const unsubscribe = subscribeToTasks(
            workspaceId,
            (newTasks) => {
                if (!isCancelledRef.current) {
                    setTasks(newTasks);
                    setLoading(false);
                }
            },
            (error) => {
                if (!isCancelledRef.current) {
                    console.error("Task subscription error:", error);
                    setLoading(false);
                    // Toast is optional here depending on UX policy, but ensuring loading=false is critical
                }
            }
        );

        return () => {
            isCancelledRef.current = true;
            unsubscribe();
        };
    }, [workspaceId, authLoading]);

    return { tasks, loading: loading || authLoading };
};
