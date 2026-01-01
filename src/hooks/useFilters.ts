import { useLayoutEffect, useRef, useState } from 'react';

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
    const isCancelledRef = useRef(false);

    useLayoutEffect(() => {
        isCancelledRef.current = false;

        if (!workspaceId) {
            setFilters([]);
            setLoading(false);
            return;
        }

        // Prevent stale data flicker
        setFilters([]);
        setLoading(true);

        const unsubscribe = subscribeToFilters(workspaceId, (newFilters) => {
            if (!isCancelledRef.current) {
                setFilters(newFilters);
                setLoading(false);
            }
        });

        return () => {
            isCancelledRef.current = true;
            unsubscribe();
        };
    }, [workspaceId]);

    return { filters, loading };
};
