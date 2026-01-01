import { useEffect, useState } from 'react';
import { useWorkspaceStore } from '../store/ui/workspace-store';
import { subscribeToWorkspaces } from '../store/workspace';
import { useAuth } from './useAuth';

/**
 * ワークスペース一覧を購読するカスタムフック
 */
export const useWorkspaces = () => {
    const workspaces = useWorkspaceStore((state) => state.workspaces);
    const setWorkspaces = useWorkspaceStore((state) => state.setWorkspaces);
    const { userId, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;

        if (!userId) {
            setWorkspaces([]); // Clear data on logout
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToWorkspaces(userId, () => {
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId, authLoading, setWorkspaces]);

    return { workspaces, loading: loading || authLoading };
};
