import { useEffect, useState } from 'react';
import { TimeBlock } from '../store/schema';
import { getTimeBlocks, subscribeToTimeBlocks } from '../store/timeblocks';
import { getCurrentWorkspaceId } from '../store/workspace';

/**
 * TimeBlocks を購読するカスタムフック
 */
export const useTimeBlocks = () => {
    const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(() => getTimeBlocks());
    const [loading, setLoading] = useState(true);
    const workspaceId = getCurrentWorkspaceId();

    useEffect(() => {
        if (!workspaceId) {
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToTimeBlocks(workspaceId, (newBlocks) => {
            setTimeBlocks(newBlocks);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [workspaceId]);

    return { timeBlocks, loading };
};
