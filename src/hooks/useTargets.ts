import { useEffect, useState } from 'react';
import { Target } from '../store/schema';
import { subscribeToTargets } from '../store/targets';
import { useWorkspace } from './useWorkspace';

export const useTargets = () => {
    const { workspaceId, loading: authLoading } = useWorkspace();
    const [targets, setTargets] = useState<Target[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!workspaceId) {
            setTargets([]);
            if (!authLoading) setLoading(false);
            return;
        }

        setLoading(true);
        let mounted = true;

        const unsubscribe = subscribeToTargets(workspaceId, (newTargets) => {
            if (mounted) {
                setTargets(newTargets);
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, [workspaceId, authLoading]);

    return { targets, loading: loading || authLoading };
};
