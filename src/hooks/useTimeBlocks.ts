import { useLayoutEffect, useRef, useState } from 'react';


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

    const isCancelledRef = useRef(false);

    useLayoutEffect(() => {
        isCancelledRef.current = false;

        if (!workspaceId) {
            setTimeBlocks([]);
            setLoading(false);
            return;
        }

        // Reset state for new workspace to prevent flicker of old data
        // Ideally we would check cache like isTasksInitialized(workspaceId)
        // But for now, explicit reset ensures correctness
        setTimeBlocks([]);
        setLoading(true);

        const unsubscribe = subscribeToTimeBlocks(workspaceId, (newBlocks) => {
            if (!isCancelledRef.current) {
                setTimeBlocks(newBlocks);
                setLoading(false);
            }
        });

        return () => {
            isCancelledRef.current = true;
            unsubscribe();
        };
    }, [workspaceId]);


    return { timeBlocks, loading };
};
