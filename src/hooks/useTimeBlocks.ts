import { useEffect, useState } from 'react';
import { TimeBlock } from '../store/schema';
import { subscribeToTimeBlocks } from '../store/timeblocks';
import { getCurrentWorkspaceId } from '../store/workspace';

/**
 * TimeBlocks を購読するカスタムフック
 */
export const useTimeBlocks = () => {
    const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
    const [loading, setLoading] = useState(true);
    const workspaceId = getCurrentWorkspaceId();

    useEffect(() => {
        if (!workspaceId) {
            setTimeBlocks([]);
            setLoading(false);
            return;
        }

        let mounted = true;
        const unsubscribe = subscribeToTimeBlocks(workspaceId, (newBlocks) => {
            if (mounted) {
                setTimeBlocks(newBlocks);
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, [workspaceId]);

    return { timeBlocks, loading };
};
