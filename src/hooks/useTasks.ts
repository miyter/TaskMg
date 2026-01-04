import { getTasks, isTasksInitialized, subscribeToTasks } from '../store';
import { Task } from '../store/schema';
import { useFirestoreEntity } from './useFirestoreEntity';

export const useTasks = () => {
    const { entities: tasks, loading } = useFirestoreEntity<Task>({
        entityName: 'tasks',
        subscribeFn: (wid, onData) => subscribeToTasks(wid, onData, (error) => console.error("Task subscription error:", error)),
        getCacheFn: getTasks,
        isInitializedFn: isTasksInitialized
    });

    return {
        tasks,
        loading
    };
};
