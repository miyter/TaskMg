import { useCallback } from 'react';
import { getLabels, isLabelsInitialized, subscribeToLabels } from '../store/labels';
import { Label } from '../store/schema';
import { useFirestoreSubscription } from './useFirestoreSubscription';
import { useWorkspace } from './useWorkspace';

export const useLabels = () => {
    const { workspaceId, userId, loading: authLoading } = useWorkspace();

    const subscribeFn = useCallback((onData: (data: Label[]) => void) => {
        // 認証が完了するまでサブスクリプションを開始しない
        if (!workspaceId || !userId) return () => { };
        return subscribeToLabels(workspaceId, onData);
    }, [workspaceId, userId]);

    const isCacheReady = workspaceId ? isLabelsInitialized(workspaceId) : false;

    const { data: labels, isPending } = useFirestoreSubscription<Label[]>(
        ['labels', userId || undefined, workspaceId || undefined],
        subscribeFn,
        (workspaceId && isCacheReady) ? getLabels(workspaceId) : undefined
    );

    const loading = authLoading || (!!workspaceId && isPending);

    return { labels: labels || [], loading };
};
