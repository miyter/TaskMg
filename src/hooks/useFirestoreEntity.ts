import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useFirestoreSubscription } from './useFirestoreSubscription';
import { useWorkspace } from './useWorkspace';

interface UseFirestoreEntityOptions<T> {
    entityName: string;
    subscribeFn: (workspaceId: string, onData: (data: T[]) => void) => (() => void);
    getCacheFn: (workspaceId: string) => T[];
    isInitializedFn: (workspaceId: string) => boolean;
}

/**
 * Generic hook for subscribing to Firestore collections (Tasks, Labels, Projects, etc.)
 * Centralizes the logic for subscription management, cache readiness checks, and loading states.
 */
export const useFirestoreEntity = <T>({
    entityName,
    subscribeFn: storeSubscribeFn,
    getCacheFn,
    isInitializedFn
}: UseFirestoreEntityOptions<T>) => {
    const { workspaceId, userId, loading: authLoading } = useWorkspace();
    const queryClient = useQueryClient();

    const subscribeFn = useCallback((onData: (data: T[]) => void) => {
        // Do not start subscription until authentication and workspace are ready
        if (!workspaceId || !userId) return () => { };
        return storeSubscribeFn(workspaceId, onData);
    }, [workspaceId, userId, storeSubscribeFn]);

    const isCacheReady = workspaceId ? isInitializedFn(workspaceId) : false;

    // Standardized Query Key: [entityName, userId, workspaceId]
    const queryKey = [entityName, userId || undefined, workspaceId || undefined];

    const { data: entities, isPending } = useFirestoreSubscription<T[]>(
        queryKey,
        subscribeFn,
        (workspaceId && isCacheReady) ? getCacheFn(workspaceId) : undefined
    );

    const loading = authLoading || (!!workspaceId && !isCacheReady && isPending);

    const setEntitiesOverride = useCallback((updatedEntities: T[]) => {
        if (workspaceId && userId) {
            queryClient.setQueryData(queryKey, updatedEntities);
        }
    }, [queryClient, queryKey, workspaceId, userId]);

    return { entities: entities || [], loading, setEntitiesOverride };
};
