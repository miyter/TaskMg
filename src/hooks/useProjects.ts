import { useCallback } from 'react';
import { getProjects, isProjectsInitialized, subscribeToProjects, updateProjectsCache } from '../store/projects';
import { Project } from '../store/schema';
import { useFirestoreEntity } from './useFirestoreEntity';
import { useWorkspace } from './useWorkspace';

export const useProjects = () => {
    const subscribeFn = useCallback((wid: string, onData: (data: Project[]) => void) => {
        return subscribeToProjects(wid, onData);
    }, []);

    const { entities: projects, loading } = useFirestoreEntity<Project>({
        entityName: 'projects',
        subscribeFn,
        getCacheFn: getProjects,
        isInitializedFn: isProjectsInitialized
    });

    const { workspaceId } = useWorkspace();

    const setProjectsOverride = (updatedProjects: Project[]) => {
        if (workspaceId) {
            updateProjectsCache(updatedProjects, workspaceId);
        }
    };

    return { projects, loading, setProjectsOverride };
};
