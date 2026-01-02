import { useCallback } from 'react';
import { Workspace } from '../store/schema';
import { getWorkspaces, isWorkspacesInitialized, subscribeToWorkspaces } from '../store/workspace';
import { useAuth } from './useAuth';
import { useFirestoreSubscription } from './useFirestoreSubscription';

/**
 * ワークスペース一覧を購読するカスタムフック
 */
export const useWorkspaces = () => {
    const { userId, loading: authLoading } = useAuth();

    const subscribeFn = useCallback((onData: (data: Workspace[]) => void) => {
        // 認証が完了するまでサブスクリプションを開始しない
        if (!userId) return () => { };
        return subscribeToWorkspaces(userId, onData);
    }, [userId]);

    const isCacheReady = userId ? isWorkspacesInitialized(userId) : false;
    const initialData = (isCacheReady && userId) ? getWorkspaces(userId) : undefined;

    const { data: workspaces, isPending } = useFirestoreSubscription<Workspace[]>(
        ['workspaces', userId || undefined],
        subscribeFn,
        initialData
    );

    const loading = authLoading || (!!userId && isPending);

    return { workspaces: workspaces || [], loading };
};
