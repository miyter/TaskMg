import { useCallback } from 'react';
import { subscribeToFilters } from '../store/filters';
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
        undefined
    );

    const loading = authLoading || (!!workspaceId && isPending);

    return { filters: filters || [], loading };
};
