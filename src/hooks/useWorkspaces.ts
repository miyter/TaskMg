import { useCallback, useSyncExternalStore } from 'react';
import { Workspace } from '../store/schema';
import { getWorkspaces, isWorkspacesInitialized, subscribeToWorkspaces } from '../store/workspace';
import { useAuth } from './useAuth';

const EMPTY_ARRAY: any[] = [];

/**
 * ワークスペース一覧を購読するカスタムフック
 */
export const useWorkspaces = () => {
    const { userId, loading: authLoading } = useAuth();

    const subscribe = useCallback((onStoreChange: () => void) => {
        if (!userId) return () => { };
        return subscribeToWorkspaces(userId, () => onStoreChange());
    }, [userId]);

    const getSnapshot = useCallback(() => {
        if (userId && isWorkspacesInitialized(userId)) {
            return getWorkspaces(userId);
        }
        return EMPTY_ARRAY as Workspace[];
    }, [userId]);

    const workspaces = useSyncExternalStore(subscribe, getSnapshot);

    const isCacheReady = userId ? isWorkspacesInitialized(userId) : false;
    const loading = authLoading || (!!userId && !isCacheReady);

    return { workspaces, loading };
};
