import { useCallback } from 'react';
import { useTranslation } from '../core/translations';
import { getTasks, isTasksInitialized, subscribeToTasks } from '../store';
import { Task } from '../store/schema';
import { toast } from '../store/ui/toast-store';
import { useFirestoreEntity } from './useFirestoreEntity';
import { useWorkspace } from './useWorkspace';

export const useTasks = () => {
    // Explicitly depend on workspace
    useWorkspace();
    const { t } = useTranslation();

    const subscribeFn = useCallback((wid: string, onData: (data: Task[]) => void) => {
        return subscribeToTasks(wid, onData, (error: any) => {
            console.error("Task subscription error:", error);
            toast.error(t('msg.error.subscription_failed') || 'Failed to sync tasks');
        });
    }, [t]);

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
