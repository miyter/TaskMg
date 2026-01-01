import { useCallback } from 'react';
import { TimeBlock } from '../store/schema';
import { getTimeBlocks, subscribeToTimeBlocks } from '../store/timeblocks';
import { useFirestoreSubscription } from './useFirestoreSubscription';
import { useWorkspace } from './useWorkspace';

/**
 * TimeBlocks を購読するカスタムフック
 */
export const useTimeBlocks = () => {
    const { workspaceId, loading: authLoading } = useWorkspace();

    const subscribeFn = useCallback((onData: (data: TimeBlock[]) => void) => {
        if (!workspaceId) return () => { };
        return subscribeToTimeBlocks(workspaceId, onData);
    }, [workspaceId]);

    const { data: timeBlocks, isPending } = useFirestoreSubscription<TimeBlock[]>(
        ['timeblocks', workspaceId],
        subscribeFn,
        getTimeBlocks()
    );

    const loading = authLoading || (!!workspaceId && isPending && ((timeBlocks ?? []).length === 0));

    return { timeBlocks: timeBlocks || [], loading };
};
