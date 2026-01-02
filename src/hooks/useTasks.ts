import { useCallback } from 'react';
import { getTasks, isTasksInitialized, subscribeToTasks } from '../store';
import { Task } from '../store/schema';
import { useFirestoreSubscription } from './useFirestoreSubscription';
import { useWorkspace } from './useWorkspace';

export const useTasks = () => {
    const { workspaceId, userId, loading: authLoading } = useWorkspace();

    // Define subscription function wrapper
    const subscribeFn = useCallback((onData: (data: Task[]) => void) => {
        // 認証が完了するまでサブスクリプションを開始しない
        if (!workspaceId || !userId) return () => { };

        return subscribeToTasks(
            workspaceId,
            (tasks) => onData(tasks),
            (error) => console.error("Task subscription error:", error)
        );
    }, [workspaceId, userId]);

    // Initial loading logic:
    // If we have workspaceId but tasks are not initialized in cache, we are loading.
    const isCacheReady = workspaceId ? isTasksInitialized(workspaceId) : false;

    // Use React Query via generic subscription hook
    const { data: tasks, isPending } = useFirestoreSubscription<Task[]>(
        ['tasks', userId || undefined, workspaceId || undefined],
        subscribeFn,
        (workspaceId && isCacheReady) ? getTasks(workspaceId) : undefined
    );

    // Also respect authLoading.
    const loading = authLoading || (!!workspaceId && !isCacheReady && isPending);

    return {
        tasks: tasks || [],
        loading
    };
};
