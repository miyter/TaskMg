import { useEffect, useState } from 'react';
import { initAuthListener } from '../core/auth';
import { auth } from '../core/firebase';
import { useWorkspaceStore } from '../store/ui/workspace-store';

/**
 * 現在のワークスペースID、ログインユーザーID、およびロード状態を提供するフック
 */
export const useWorkspace = () => {
    const workspaceId = useWorkspaceStore((state) => state.currentWorkspaceId);
    const [userId, setUserId] = useState<string | null>(auth.currentUser?.uid || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 認証状態の監視 (Centralized)
        const unsubscribe = initAuthListener(
            (user) => {
                setUserId(user.uid);
                setLoading(false);
            },
            () => {
                setUserId(null);
                setLoading(false);
            }
        );

        return () => {
            unsubscribe();
        };
    }, []);

    return { workspaceId, userId, loading };
};
