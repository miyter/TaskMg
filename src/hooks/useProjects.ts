import { getProjects, isProjectsInitialized, subscribeToProjects, updateProjectsCache } from '../store/projects';
import { Project } from '../store/schema';
import { useFirestoreEntity } from './useFirestoreEntity';
import { useWorkspace } from './useWorkspace';

export const useProjects = () => {
    const { entities: projects, loading, setEntitiesOverride } = useFirestoreEntity<Project>({
        entityName: 'projects',
        subscribeFn: (wid, onData) => subscribeToProjects(wid, onData),
        getCacheFn: getProjects,
        isInitializedFn: isProjectsInitialized
    });

    const { workspaceId } = useWorkspace();

    const setProjectsOverride = (updatedProjects: Project[]) => {
        setEntitiesOverride(updatedProjects);
        if (workspaceId) {
            updateProjectsCache(updatedProjects, workspaceId);
        }
    };

    return { projects, loading, setProjectsOverride };
};
