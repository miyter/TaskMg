import { useCallback } from 'react';
import { getFilters, isFiltersInitialized, subscribeToFilters } from '../store/filters';
import { Filter } from '../store/schema';
import { useFirestoreSubscription } from './useFirestoreSubscription';
import { useWorkspace } from './useWorkspace';

/**
 * カスタムフィルターを購読するカスタムフック
 */
export const useFilters = () => {
    const { workspaceId, userId, loading: authLoading } = useWorkspace();

    const subscribeFn = useCallback((onData: (data: Filter[]) => void) => {
        // 認証が完了するまでサブスクリプションを開始しない
        if (!workspaceId || !userId) return () => { };
        return subscribeToFilters(workspaceId, onData);
    }, [workspaceId, userId]);

    const isCacheReady = workspaceId ? isFiltersInitialized(workspaceId) : false;

    const { data: filters, isPending } = useFirestoreSubscription<Filter[]>(
        ['filters', userId || undefined, workspaceId || undefined],
        subscribeFn,
        (workspaceId && isCacheReady) ? getFilters(workspaceId) : undefined
    );

    const loading = authLoading || (!!workspaceId && isPending);

    return { filters: filters!, loading };
};
