import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getProjects, isProjectsInitialized, subscribeToProjects, updateProjectsCache } from '../store/projects';
import { Project } from '../store/schema';
import { useFirestoreSubscription } from './useFirestoreSubscription';
import { useWorkspace } from './useWorkspace';

export const useProjects = () => {
    const { workspaceId, userId, loading: authLoading } = useWorkspace();
    const queryClient = useQueryClient();

    const subscribeFn = useCallback((onData: (data: Project[]) => void) => {
        // 認証が完了するまでサブスクリプションを開始しない
        if (!workspaceId || !userId) return () => { };
        return subscribeToProjects(workspaceId, onData);
    }, [workspaceId, userId]);

    const isCacheReady = workspaceId ? isProjectsInitialized(workspaceId) : false;
    const initialData = (isCacheReady && workspaceId) ? getProjects(workspaceId) : undefined;

    const { data: projects, isPending } = useFirestoreSubscription<Project[]>(
        ['projects', userId || undefined, workspaceId || undefined],
        subscribeFn,
        initialData
    );

    const loading = authLoading || (!!workspaceId && isPending);

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
