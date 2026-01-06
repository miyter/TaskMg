import { useCallback } from 'react';
import { useTranslation } from '../core/translations';
import { getFilters, isFiltersInitialized, subscribeToFilters } from '../store/filters';
import { Filter } from '../store/schema';
import { toast } from '../store/ui/toast-store';
import { useFirestoreEntity } from './useFirestoreEntity';
import { useWorkspace } from './useWorkspace';

/**
 * カスタムフィルターを購読するカスタムフック
 */
export const useFilters = () => {
    useWorkspace();
    const { t } = useTranslation();

    const subscribeFn = useCallback((wid: string, onData: (data: Filter[]) => void) => {
        return subscribeToFilters(wid, onData, (error: any) => {
            console.error("Filter subscription error:", error);
            toast.error(t('msg.error.subscription_failed') || 'Failed to sync filters');
        });
    }, [t]);

    const { entities: filters, loading } = useFirestoreEntity<Filter>({
        entityName: 'filters',
        subscribeFn,
        getCacheFn: getFilters,
        isInitializedFn: isFiltersInitialized
    });

    return { filters: filters!, loading };
};
