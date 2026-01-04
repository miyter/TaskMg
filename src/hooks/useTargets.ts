import { Target } from '../store/schema';
import { getTargets, isTargetsInitialized, subscribeToTargets } from '../store/targets';
import { useFirestoreEntity } from './useFirestoreEntity';

export const useTargets = () => {
    const { entities: targets, loading } = useFirestoreEntity<Target>({
        entityName: 'targets',
        subscribeFn: (wid, onData) => subscribeToTargets(wid, onData),
        getCacheFn: getTargets,
        isInitializedFn: isTargetsInitialized
    });

    return { targets, loading };
};
