import { useEffect, useState } from 'react';
// import { subscribeToLabels } from '../store/labels'; // Replaced with direct import to fix circular/missing updates if needed? No, store is fine.
// using getLabels directly on init
import { getLabels, subscribeToLabels } from '../store/labels';
import { Label } from '../store/schema';

export const useLabels = () => {
    // Initial state from sync getter if possible (though getLabels might return empty if not init)
    // For labels, we don't have isInitialized exposed yet, but we can assume empty start or cache
    const [labels, setLabels] = useState<Label[]>(() => getLabels());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        // Subscribe to labels (User-global, not workspace-specific)
        // workspaceId is not used for labels but required by unified signature
        const unsubscribe = subscribeToLabels('', (newLabels) => {
            if (mounted) {
                setLabels(newLabels);
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);

    return { labels, loading };
};
