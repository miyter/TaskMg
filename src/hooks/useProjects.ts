import { useEffect, useState } from 'react';
import { subscribeToProjects } from '../store/projects';
import { Project } from '../store/schema';
import { useWorkspace } from './useWorkspace';
// Note: TanStack Query is great for async data, but for Realtime listeners (Firebase onSnapshot), 
// standard useEffect + useState (or useSyncExternalStore) is often simpler unless we wrap the listener in a query.
// Given existing 'subscribeToProjects', we can wrap it easily.

export const useProjects = () => {
    const { workspaceId, loading: authLoading } = useWorkspace();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!workspaceId) {
            setProjects([]);
            if (!authLoading) setLoading(false);
            return;
        }

        setLoading(true);
        const unsubscribe = subscribeToProjects(workspaceId, (newProjects) => {
            setProjects(newProjects);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [workspaceId, authLoading]);

    return { projects, loading: loading || authLoading };
};
