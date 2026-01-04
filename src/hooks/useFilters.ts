import { getFilters, isFiltersInitialized, subscribeToFilters } from '../store/filters';
import { Filter } from '../store/schema';
import { useFirestoreEntity } from './useFirestoreEntity';

/**
 * カスタムフィルターを購読するカスタムフック
 */
export const useFilters = () => {
    const { entities: filters, loading } = useFirestoreEntity<Filter>({
        entityName: 'filters',
        subscribeFn: (wid, onData) => subscribeToFilters(wid, onData),
        getCacheFn: getFilters,
        isInitializedFn: isFiltersInitialized
    });

    return { filters: filters!, loading };
};
