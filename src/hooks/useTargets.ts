import { useCallback } from 'react';

import { Target } from '../store/schema';
import { getTargets, isTargetsInitialized, subscribeToTargets } from '../store/targets';
import { useFirestoreSubscription } from './useFirestoreSubscription';
import { useWorkspace } from './useWorkspace';

export const useTargets = () => {
    const { workspaceId, loading: authLoading } = useWorkspace();

    const subscribeFn = useCallback((onData: (data: Target[]) => void) => {
        if (!workspaceId) return () => { };
        return subscribeToTargets(workspaceId, onData);
    }, [workspaceId]);

    const isCacheReady = workspaceId ? isTargetsInitialized(workspaceId) : false;

    const { data: targets, isPending } = useFirestoreSubscription<Target[]>(
        ['targets', workspaceId],
        subscribeFn,
        (workspaceId && isCacheReady) ? getTargets(workspaceId) : undefined
    );

    const loading = authLoading || (!!workspaceId && isPending);

    return { targets: targets || [], loading };
};
