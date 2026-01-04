import { TimeBlock } from '../store/schema';
import { getTimeBlocks, isTimeBlocksInitialized, subscribeToTimeBlocks } from '../store/timeblocks';
import { useFirestoreEntity } from './useFirestoreEntity';

/**
 * TimeBlocks を購読するカスタムフック
 */
export const useTimeBlocks = () => {
    const { entities: timeBlocks, loading } = useFirestoreEntity<TimeBlock>({
        entityName: 'timeblocks',
        subscribeFn: (wid, onData) => subscribeToTimeBlocks(wid, onData),
        getCacheFn: getTimeBlocks,
        isInitializedFn: isTimeBlocksInitialized
    });

    return { timeBlocks, loading };
};
