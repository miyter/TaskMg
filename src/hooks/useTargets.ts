import { useCallback } from 'react';
import { useTranslation } from '../core/translations';
import { Target } from '../store/schema';
import { getTargets, isTargetsInitialized, subscribeToTargets } from '../store/targets';
import { toast } from '../store/ui/toast-store';
import { useFirestoreEntity } from './useFirestoreEntity';
import { useWorkspace } from './useWorkspace';

export const useTargets = () => {
    // Explicitly depend on workspace to ensure re-renders on ID change
    useWorkspace();
    const { t } = useTranslation();

    const subscribeFn = useCallback((wid: string, onData: (data: Target[]) => void) => {
        return subscribeToTargets(wid, onData, (error: any) => {
            console.error("Target subscription error:", error);
            toast.error(t('msg.error.subscription_failed') || 'Failed to sync targets');
        });
    }, [t]);

    const { entities: targets, loading } = useFirestoreEntity<Target>({
        entityName: 'targets',
        subscribeFn,
        getCacheFn: getTargets,
        isInitializedFn: isTargetsInitialized
    });

    return { targets, loading };
};
