import { useEffect, useRef, useState } from 'react';

import { Target } from '../store/schema';
import { subscribeToTargets } from '../store/targets';
import { useWorkspace } from './useWorkspace';

export const useTargets = () => {
    const { workspaceId, loading: authLoading } = useWorkspace();
    const [targets, setTargets] = useState<Target[]>([]);
    const [loading, setLoading] = useState(true);

    const isCancelledRef = useRef(false);

    useEffect(() => {
        isCancelledRef.current = false;

        if (!workspaceId) {
            setTargets([]);
            if (!authLoading) setLoading(false);
            return;
        }

        setLoading(true);

        const unsubscribe = subscribeToTargets(
            workspaceId,
            (newTargets) => {
                if (!isCancelledRef.current) {
                    setTargets(newTargets);
                    setLoading(false);
                }
            },
            (error) => {
                if (!isCancelledRef.current) {
                    console.error("Target subscription error:", error);
                    setLoading(false);
                }
            }
        );

        return () => {
            isCancelledRef.current = true;
            unsubscribe();
        };
    }, [workspaceId, authLoading]);

    return { targets, loading: loading || authLoading };
};
