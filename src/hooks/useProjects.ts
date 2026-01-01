import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getProjects, isProjectsInitialized, subscribeToProjects, updateProjectsCache } from '../store/projects';
import { Project } from '../store/schema';
import { useFirestoreSubscription } from './useFirestoreSubscription';
import { useWorkspace } from './useWorkspace';

export const useProjects = () => {
    const { workspaceId, loading: authLoading } = useWorkspace();
    const queryClient = useQueryClient();

    const subscribeFn = useCallback((onData: (data: Project[]) => void) => {
        if (!workspaceId) return () => { };
        return subscribeToProjects(workspaceId, onData);
    }, [workspaceId]);

    const { data: projects, isPending } = useFirestoreSubscription<Project[]>(
        ['projects', workspaceId],
        subscribeFn,
        workspaceId ? getProjects(workspaceId) : []
    );

    const isCacheReady = workspaceId ? isProjectsInitialized(workspaceId) : false;
    const loading = authLoading || (!!workspaceId && !isCacheReady && isPending);

    const setProjectsOverride = (updatedProjects: Project[]) => {
        if (workspaceId) {
            // Update React Query cache
            queryClient.setQueryData(['projects', workspaceId], updatedProjects);
            // Update store cache (for non-hook consumers)
            updateProjectsCache(updatedProjects, workspaceId);
        }
    };

    return { projects: projects || [], loading, setProjectsOverride };
};
