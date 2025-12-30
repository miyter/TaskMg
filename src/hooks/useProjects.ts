import { useEffect, useState } from 'react';
import { subscribeToProjects } from '../store/projects';
import { Project } from '../store/schema';
import { getCurrentWorkspaceId } from '../store/workspace';
// Note: TanStack Query is great for async data, but for Realtime listeners (Firebase onSnapshot), 
// standard useEffect + useState (or useSyncExternalStore) is often simpler unless we wrap the listener in a query.
// Given existing 'subscribeToProjects', we can wrap it easily.

export const useProjects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const workspaceId = getCurrentWorkspaceId(); // This might need to be reactive too later

    useEffect(() => {
        if (!workspaceId) {
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToProjects(workspaceId, (newProjects) => {
            setProjects(newProjects);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [workspaceId]);

    return { projects, loading };
};
