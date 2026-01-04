import { getLabels, isLabelsInitialized, subscribeToLabels } from '../store/labels';
import { Label } from '../store/schema';
import { useFirestoreEntity } from './useFirestoreEntity';

export const useLabels = () => {
    const { entities: labels, loading } = useFirestoreEntity<Label>({
        entityName: 'labels',
        subscribeFn: (wid, onData) => subscribeToLabels(wid, onData),
        getCacheFn: getLabels,
        isInitializedFn: isLabelsInitialized
    });

    return { labels, loading };
};
