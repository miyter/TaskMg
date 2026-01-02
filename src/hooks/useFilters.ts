import { useCallback } from 'react';
import { getFilters, isFiltersInitialized, subscribeToFilters } from '../store/filters';
import { Filter } from '../store/schema';
import { useFirestoreSubscription } from './useFirestoreSubscription';
import { useWorkspace } from './useWorkspace';

/**
 * カスタムフィルターを購読するカスタムフック
 */
export const useFilters = () => {
    const { workspaceId, loading: authLoading } = useWorkspace();

    const subscribeFn = useCallback((onData: (data: Filter[]) => void) => {
        if (!workspaceId) return () => { };
        return subscribeToFilters(workspaceId, onData);
    }, [workspaceId]);

    const isCacheReady = workspaceId ? isFiltersInitialized(workspaceId) : false;

    const { data: filters, isPending } = useFirestoreSubscription<Filter[]>(
        ['filters', workspaceId || 'pending'],
        subscribeFn,
        (workspaceId && isCacheReady) ? getFilters(workspaceId) : undefined
    );

    const loading = authLoading || (!!workspaceId && isPending);

    return { filters: filters!, loading };
};
