import { useCallback } from 'react';
import { useTranslation } from '../core/translations';
import { getLabels, isLabelsInitialized, subscribeToLabels } from '../store/labels';
import { Label } from '../store/schema';
import { toast } from '../store/ui/toast-store';
import { useFirestoreEntity } from './useFirestoreEntity';
import { useWorkspace } from './useWorkspace';

export const useLabels = () => {
    // Explicitly depend on workspace to ensure re-renders on ID change
    useWorkspace();
    const { t } = useTranslation();

    const subscribeFn = useCallback((wid: string, onData: (data: Label[]) => void) => {
        return subscribeToLabels(wid, onData, (error: any) => {
            console.error("Label subscription error:", error);
            // Lazy load toast to verify safety, but useTranslation is already here
            toast.error(t('msg.error.subscription_failed') || 'Failed to sync labels');
        });
    }, [t]);

    const { entities: labels, loading } = useFirestoreEntity<Label>({
        entityName: 'labels',
        subscribeFn,
        getCacheFn: getLabels,
        isInitializedFn: isLabelsInitialized
    });

    return { labels, loading };
};
