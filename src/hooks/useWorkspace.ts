import { useEffect, useState } from 'react';
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
        // 認証状態の監視
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            setUserId(user ? user.uid : null);
            setLoading(false);
        });

        return () => {
            unsubscribeAuth();
        };
    }, []);

    return { workspaceId, userId, loading };
};
