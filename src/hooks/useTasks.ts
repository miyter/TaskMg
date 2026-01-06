import { useCallback } from 'react';
import { getTasks, isTasksInitialized, subscribeToTasks } from '../store';
import { Task } from '../store/schema';
import { useFirestoreEntity } from './useFirestoreEntity';

export const useTasks = () => {
    const subscribeFn = useCallback((wid: string, onData: (data: Task[]) => void) => {
        return subscribeToTasks(wid, onData, (error) => console.error("Task subscription error:", error));
    }, []);

    const { entities: tasks, loading } = useFirestoreEntity<Task>({
        entityName: 'tasks',
        subscribeFn,
        getCacheFn: getTasks,
        isInitializedFn: isTasksInitialized
    });

    return {
        tasks,
        loading
    };
};
