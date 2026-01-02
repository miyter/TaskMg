import { useCallback } from 'react';

import { Target } from '../store/schema';
import { getTargets, isTargetsInitialized, subscribeToTargets } from '../store/targets';
import { useFirestoreSubscription } from './useFirestoreSubscription';
import { useWorkspace } from './useWorkspace';

export const useTargets = () => {
    const { workspaceId, userId, loading: authLoading } = useWorkspace();

    const subscribeFn = useCallback((onData: (data: Target[]) => void) => {
        // 認証が完了するまでサブスクリプションを開始しない
        if (!workspaceId || !userId) return () => { };
        return subscribeToTargets(workspaceId, onData);
    }, [workspaceId, userId]);

    const isCacheReady = workspaceId ? isTargetsInitialized(workspaceId) : false;

    const { data: targets, isPending } = useFirestoreSubscription<Target[]>(
        ['targets', userId || undefined, workspaceId || undefined],
        subscribeFn,
        (workspaceId && isCacheReady) ? getTargets(workspaceId) : undefined
    );

    const loading = authLoading || (!!workspaceId && isPending);

    return { targets: targets || [], loading };
};
