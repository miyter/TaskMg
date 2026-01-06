import { useCallback } from 'react';
import { useTranslation } from '../core/translations';
import { TimeBlock } from '../store/schema';
import { getTimeBlocks, isTimeBlocksInitialized, subscribeToTimeBlocks } from '../store/timeblocks';
import { toast } from '../store/ui/toast-store';
import { useFirestoreEntity } from './useFirestoreEntity';
import { useWorkspace } from './useWorkspace';

/**
 * TimeBlocks を購読するカスタムフック
 */
export const useTimeBlocks = () => {
    // Explicitly depend on workspace to ensure re-renders on ID change
    useWorkspace();
    const { t } = useTranslation();

    const subscribeFn = useCallback((wid: string, onData: (data: TimeBlock[]) => void) => {
        return subscribeToTimeBlocks(wid, onData, (error: any) => {
            console.error("TimeBlock subscription error:", error);
            toast.error(t('msg.error.subscription_failed') || 'Failed to sync time blocks');
        });
    }, [t]);

    const { entities: timeBlocks, loading } = useFirestoreEntity<TimeBlock>({
        entityName: 'timeblocks',
        subscribeFn,
        getCacheFn: getTimeBlocks,
        isInitializedFn: isTimeBlocksInitialized
    });

    return { timeBlocks, loading };
};
