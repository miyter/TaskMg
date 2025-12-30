import { useEffect, useState } from 'react';
import { subscribeToLabels } from '../store/labels';
import { Label } from '../store/schema';
import { getCurrentWorkspaceId } from '../store/workspace';

export const useLabels = () => {
    const [labels, setLabels] = useState<Label[]>([]);
    const [loading, setLoading] = useState(true);
    const workspaceId = getCurrentWorkspaceId();

    useEffect(() => {
        // Labels are workspace-agnostic in current logic but subscription signature expects it
        const unsubscribe = subscribeToLabels(workspaceId || '', (newLabels) => {
            setLabels(newLabels);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [workspaceId]);

    return { labels, loading };
};
