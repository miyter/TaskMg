import { useEffect, useRef, useState } from 'react';
import { getLabels, subscribeToLabels } from '../store/labels';
import { Label } from '../store/schema';
import { useWorkspace } from './useWorkspace';

export const useLabels = () => {
    // Initial state from sync getter
    const [labels, setLabels] = useState<Label[]>(() => getLabels());
    const [loading, setLoading] = useState(true);
    const isCancelledRef = useRef(false);

    const { workspaceId, loading: authLoading } = useWorkspace();

    useEffect(() => {
        if (authLoading) return;

        isCancelledRef.current = false;

        // Subscribe to labels (User-global, not workspace-specific)
        // workspaceId is used to trigger re-subscription on account switch
        const unsubscribe = subscribeToLabels('', (newLabels) => {
            if (!isCancelledRef.current) {
                setLabels(newLabels);
                setLoading(false);
            }
        });

        return () => {
            isCancelledRef.current = true;
            unsubscribe();
        };
    }, [authLoading, workspaceId]);

    return { labels, loading };
};
