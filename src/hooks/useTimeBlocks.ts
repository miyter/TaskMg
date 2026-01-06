import { useCallback } from 'react';
import { TimeBlock } from '../store/schema';
import { getTimeBlocks, isTimeBlocksInitialized, subscribeToTimeBlocks } from '../store/timeblocks';
import { useFirestoreEntity } from './useFirestoreEntity';

/**
 * TimeBlocks を購読するカスタムフック
 */
export const useTimeBlocks = () => {
    const subscribeFn = useCallback((wid: string, onData: (data: TimeBlock[]) => void) => {
        return subscribeToTimeBlocks(wid, onData);
    }, []);

    const { entities: timeBlocks, loading } = useFirestoreEntity<TimeBlock>({
        entityName: 'timeblocks',
        subscribeFn,
        getCacheFn: getTimeBlocks,
        isInitializedFn: isTimeBlocksInitialized
    });

    return { timeBlocks, loading };
};
