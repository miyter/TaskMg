import { useCallback } from 'react';
import { getLabels, isLabelsInitialized, subscribeToLabels } from '../store/labels';
import { Label } from '../store/schema';
import { useFirestoreSubscription } from './useFirestoreSubscription';
import { useWorkspace } from './useWorkspace';

export const useLabels = () => {
    const { workspaceId, loading: authLoading } = useWorkspace();

    const subscribeFn = useCallback((onData: (data: Label[]) => void) => {
        if (!workspaceId) return () => { };
        return subscribeToLabels(workspaceId, onData);
    }, [workspaceId]);

    const isCacheReady = workspaceId ? isLabelsInitialized(workspaceId) : false;

    const { data: labels, isPending } = useFirestoreSubscription<Label[]>(
        ['labels', workspaceId],
        subscribeFn,
        (workspaceId && isCacheReady) ? getLabels(workspaceId) : undefined
    );

    const loading = authLoading || (!!workspaceId && isPending);

    return { labels: labels || [], loading };
};
