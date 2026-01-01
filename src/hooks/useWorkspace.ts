import { useWorkspaceStore } from '../store/ui/workspace-store';
import { useAuth } from './useAuth';

/**
 * 現在のワークスペースID、ログインユーザーID、およびロード状態を提供するフック
 */
export const useWorkspace = () => {
    const workspaceId = useWorkspaceStore((state) => state.currentWorkspaceId);
    const { userId, loading } = useAuth();

    return { workspaceId, userId, loading };
};
