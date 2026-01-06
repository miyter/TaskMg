import { useCallback } from 'react';
import { useTranslation } from '../core/translations';
import { getProjects, isProjectsInitialized, subscribeToProjects, updateProjectsCache } from '../store/projects';
import { Project } from '../store/schema';
import { toast } from '../store/ui/toast-store';
import { useFirestoreEntity } from './useFirestoreEntity';
import { useWorkspace } from './useWorkspace';

export const useProjects = () => {
    // Explicitly depend on workspace
    useWorkspace();
    const { t } = useTranslation();

    const subscribeFn = useCallback((wid: string, onData: (data: Project[]) => void) => {
        return subscribeToProjects(wid, onData, (error: any) => {
            console.error("Project subscription error:", error);
            toast.error(t('msg.error.subscription_failed') || 'Failed to sync projects');
        });
    }, [t]);

    const { entities: projects, loading } = useFirestoreEntity<Project>({
        entityName: 'projects',
        subscribeFn,
        getCacheFn: getProjects,
        isInitializedFn: isProjectsInitialized
    });

    const { workspaceId } = useWorkspace();

    /**
     * @deprecated Dangerous method: Overwrites cache and desyncs from server.
     * Risk of data loss or infinite loops. Use with caution during DnD operations only.
     */
    const setProjectsOverride = (updatedProjects: Project[]) => {
        if (workspaceId) {
            updateProjectsCache(updatedProjects, workspaceId);
        }
    };

    return { projects, loading, setProjectsOverride };
};
