import { useEffect, useState } from 'react';
import { getFilters, subscribeToFilters } from '../store/filters';
import { Filter } from '../store/schema';
import { getCurrentWorkspaceId } from '../store/workspace';

/**
 * カスタムフィルターを購読するカスタムフック
 */
export const useFilters = () => {
    const [filters, setFilters] = useState<Filter[]>(() => getFilters());
    const [loading, setLoading] = useState(true);
    const workspaceId = getCurrentWorkspaceId();

    useEffect(() => {
        if (!workspaceId) {
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToFilters(workspaceId, (newFilters) => {
            setFilters(newFilters);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [workspaceId]);

    return { filters, loading };
};
