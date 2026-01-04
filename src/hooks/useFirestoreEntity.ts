import { useCallback, useSyncExternalStore } from 'react';
import { useWorkspace } from './useWorkspace';

const EMPTY_ARRAY: any[] = [];

interface UseFirestoreEntityOptions<T> {
    entityName: string;
    subscribeFn: (workspaceId: string, onData: (data: T[]) => void) => (() => void);
    getCacheFn: (workspaceId: string) => T[];
    isInitializedFn: (workspaceId: string) => boolean;
}

/**
 * Generic hook for subscribing to Firestore collections (Tasks, Labels, Projects, etc.) using SyncExternalStore.
 * This connects directly to the manual FirestoreCollectionCache, avoiding double caching with React Query.
 */
export const useFirestoreEntity = <T>({
    entityName, // Kept for interface compatibility/debugging
    subscribeFn: storeSubscribeFn,
    getCacheFn,
    isInitializedFn
}: UseFirestoreEntityOptions<T>) => {
    const { workspaceId, userId, loading: authLoading } = useWorkspace();

    const subscribe = useCallback((onStoreChange: () => void) => {
        if (!workspaceId || !userId) return () => { };
        // Adapter: store emits data, we emit event to trigger getSnapshot
        return storeSubscribeFn(workspaceId, () => onStoreChange());
    }, [workspaceId, userId, storeSubscribeFn]);

    const getSnapshot = useCallback(() => {
        if (workspaceId && userId && isInitializedFn(workspaceId)) {
            return getCacheFn(workspaceId);
        }
        return EMPTY_ARRAY as T[];
    }, [workspaceId, userId, isInitializedFn, getCacheFn]);

    const entities = useSyncExternalStore(subscribe, getSnapshot);

    const isCacheReady = workspaceId ? isInitializedFn(workspaceId) : false;
    const loading = authLoading || (!!workspaceId && !isCacheReady);

    return { entities, loading };
};
