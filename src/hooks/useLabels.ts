import { useCallback } from 'react';
import { getLabels, subscribeToLabels } from '../store/labels';
import { Label } from '../store/schema';
import { useFirestoreSubscription } from './useFirestoreSubscription';
import { useWorkspace } from './useWorkspace';

export const useLabels = () => {
    const { workspaceId, loading: authLoading } = useWorkspace();

    const subscribeFn = useCallback((onData: (data: Label[]) => void) => {
        if (!workspaceId) return () => { };
        return subscribeToLabels(workspaceId, onData);
    }, [workspaceId]);

    const { data: labels, isPending } = useFirestoreSubscription<Label[]>(
        ['labels', workspaceId],
        subscribeFn,
        getLabels()
    );

    const loading = authLoading || (!!workspaceId && isPending && ((labels ?? []).length === 0));

    return { labels: labels || [], loading };
};
