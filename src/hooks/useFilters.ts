import { useEffect, useRef, useState } from 'react';
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
    const isInitialized = useRef(false);

    useEffect(() => {
        if (!workspaceId) {
            setFilters([]);
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToFilters(workspaceId, (newFilters) => {
            setFilters(newFilters);
            // 初回のみloadingをfalseに設定（更新ごとの無駄なstate更新を回避）
            if (!isInitialized.current) {
                setLoading(false);
                isInitialized.current = true;
            }
        });

        return () => {
            unsubscribe();
            isInitialized.current = false; // workspace変更時にリセット
        };
    }, [workspaceId]);

    return { filters, loading };
};
