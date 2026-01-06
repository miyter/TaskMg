import { useCallback } from 'react';
import { getLabels, isLabelsInitialized, subscribeToLabels } from '../store/labels';
import { Label } from '../store/schema';
import { useFirestoreEntity } from './useFirestoreEntity';

export const useLabels = () => {
    const subscribeFn = useCallback((wid: string, onData: (data: Label[]) => void) => {
        return subscribeToLabels(wid, onData);
    }, []);

    const { entities: labels, loading } = useFirestoreEntity<Label>({
        entityName: 'labels',
        subscribeFn,
        getCacheFn: getLabels,
        isInitializedFn: isLabelsInitialized
    });

    return { labels, loading };
};
