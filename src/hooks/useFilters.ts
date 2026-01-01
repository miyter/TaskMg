import { useCallback } from 'react';
import { getFilters, subscribeToFilters } from '../store/filters';
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

    const { data: filters, isPending } = useFirestoreSubscription<Filter[]>(
        ['filters', workspaceId],
        subscribeFn,
        getFilters()
    );

    const loading = authLoading || (!!workspaceId && isPending && ((filters ?? []).length === 0));

    return { filters: filters || [], loading };
};
