import { useCallback } from 'react';
import { getTasks, isTasksInitialized, subscribeToTasks } from '../store';
import { Task } from '../store/schema';
import { useFirestoreSubscription } from './useFirestoreSubscription';
import { useWorkspace } from './useWorkspace';

export const useTasks = () => {
    const { workspaceId, loading: authLoading } = useWorkspace();

    // Define subscription function wrapper
    const subscribeFn = useCallback((onData: (data: Task[]) => void) => {
        if (!workspaceId) return () => { };

        return subscribeToTasks(
            workspaceId,
            (tasks) => onData(tasks),
            (error) => console.error("Task subscription error:", error)
        );
    }, [workspaceId]);

    // Use React Query via generic subscription hook
    const { data: tasks, isPending } = useFirestoreSubscription<Task[]>(
        ['tasks', workspaceId],
        subscribeFn,
        workspaceId ? getTasks(workspaceId) : []
    );

    // Initial loading logic:
    // If we have workspaceId but tasks are not initialized in cache, we are loading.
    // Also respect authLoading.
    const isCacheReady = workspaceId ? isTasksInitialized(workspaceId) : false;
    const loading = authLoading || (!!workspaceId && !isCacheReady && isPending);

    return {
        tasks: tasks || [],
        loading
    };
};
