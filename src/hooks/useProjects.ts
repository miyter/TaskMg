import { useEffect, useRef, useState } from 'react';
import { getProjects, isProjectsInitialized, subscribeToProjects, updateProjectsCache } from '../store/projects';
import { Project } from '../store/schema';
import { useWorkspace } from './useWorkspace';

export const useProjects = () => {
    const { workspaceId, loading: authLoading } = useWorkspace();
    const isCancelledRef = useRef(false);

    const [projects, setProjects] = useState<Project[]>(() => {
        if (workspaceId) return getProjects(workspaceId);
        return [];
    });

    const [loading, setLoading] = useState(() => {
        if (!workspaceId) return true;
        return !isProjectsInitialized(workspaceId);
    });

    useEffect(() => {
        isCancelledRef.current = false;

        if (!workspaceId) {
            setProjects([]);
            if (!authLoading) setLoading(false);
            return;
        }

        // Initialize from cache if available to avoid loading state
        if (isProjectsInitialized(workspaceId)) {
            setProjects(getProjects(workspaceId));
            setLoading(false);
        } else {
            setLoading(true);
        }

        const unsubscribe = subscribeToProjects(workspaceId, (newProjects) => {
            if (!isCancelledRef.current) {
                setProjects(newProjects);
                setLoading(false);
            }
        });

        return () => {
            isCancelledRef.current = true;
            unsubscribe();
        };
    }, [workspaceId, authLoading]);

    /**
     * Optimistic Update用: ローカル状態を一時的に上書きする
     * Firestoreの購読が次のデータを受け取ると自動的に上書きされる
     */
    const setProjectsOverride = (updatedProjects: Project[]) => {
        if (workspaceId) {
            // Update local state immediately
            setProjects(updatedProjects);
            // Update store cache
            updateProjectsCache(updatedProjects, workspaceId);
        }
    };

    return { projects, loading: loading || authLoading, setProjectsOverride };
};
