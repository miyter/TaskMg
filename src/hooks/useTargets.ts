import { useCallback } from 'react';
import { Target } from '../store/schema';
import { getTargets, isTargetsInitialized, subscribeToTargets } from '../store/targets';
import { useFirestoreEntity } from './useFirestoreEntity';

export const useTargets = () => {
    const subscribeFn = useCallback((wid: string, onData: (data: Target[]) => void) => {
        return subscribeToTargets(wid, onData);
    }, []);

    const { entities: targets, loading } = useFirestoreEntity<Target>({
        entityName: 'targets',
        subscribeFn,
        getCacheFn: getTargets,
        isInitializedFn: isTargetsInitialized
    });

    return { targets, loading };
};
