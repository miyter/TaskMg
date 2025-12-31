import { useEffect, useState } from 'react';
import { subscribeToLabels } from '../store/labels';
import { Label } from '../store/schema';

export const useLabels = () => {
    const [labels, setLabels] = useState<Label[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Subscribe to labels (User-global, not workspace-specific)
        const unsubscribe = subscribeToLabels((newLabels) => {
            setLabels(newLabels);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { labels, loading };
};
