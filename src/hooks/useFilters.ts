import { useEffect, useRef, useState } from 'react';
import { subscribeToFilters } from '../store/filters';
import { Filter } from '../store/schema';
import { getCurrentWorkspaceId } from '../store/workspace';

/**
 * カスタムフィルターを購読するカスタムフック
 */
export const useFilters = () => {
    const [filters, setFilters] = useState<Filter[]>([]);
    const [loading, setLoading] = useState(true);
    const workspaceId = getCurrentWorkspaceId();
    const isInitialized = useRef(false);

    useEffect(() => {
        if (!workspaceId) {
            setFilters([]);
            setLoading(false);
            return;
        }

        let mounted = true;

        const unsubscribe = subscribeToFilters(workspaceId, (newFilters) => {
            if (mounted) {
                setFilters(newFilters);
                setLoading(false);
            }
        });

        // Error handling is managed inside subscribeToFilters (logs to console)
        // Future improvement: expose onError in subscribeToFilters

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, [workspaceId]);

    return { filters, loading };
};
