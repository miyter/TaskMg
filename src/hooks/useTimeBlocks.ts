import { useCallback } from 'react';
import { TimeBlock } from '../store/schema';
import { getTimeBlocks, isTimeBlocksInitialized, subscribeToTimeBlocks } from '../store/timeblocks';
import { useFirestoreSubscription } from './useFirestoreSubscription';
import { useWorkspace } from './useWorkspace';

/**
 * TimeBlocks を購読するカスタムフック
 */
export const useTimeBlocks = () => {
    const { workspaceId, userId, loading: authLoading } = useWorkspace();

    const subscribeFn = useCallback((onData: (data: TimeBlock[]) => void) => {
        // 認証が完了するまでサブスクリプションを開始しない
        if (!workspaceId || !userId) return () => { };
        return subscribeToTimeBlocks(workspaceId, onData);
    }, [workspaceId, userId]);

    const isCacheReady = workspaceId ? isTimeBlocksInitialized(workspaceId) : false;

    const { data: timeBlocks, isPending } = useFirestoreSubscription<TimeBlock[]>(
        ['timeblocks', userId || undefined, workspaceId || undefined],
        subscribeFn,
        (workspaceId && isCacheReady) ? getTimeBlocks(workspaceId) : undefined
    );

    const loading = authLoading || (!!workspaceId && isPending);

    return { timeBlocks: timeBlocks || [], loading };
};
