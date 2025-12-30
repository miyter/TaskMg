import { useEffect, useState } from 'react';
import { auth } from '../core/firebase';
import { onAuthStateChanged } from '../core/firebase-sdk';
import { useWorkspaceStore } from '../store/ui/workspace-store';
import { subscribeToWorkspaces } from '../store/workspace';

/**
 * ワークスペース一覧を購読するカスタムフック
 */
export const useWorkspaces = () => {
    const workspaces = useWorkspaceStore((state) => state.workspaces);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                const unsubscribe = subscribeToWorkspaces(user.uid, () => {
                    setLoading(false);
                });
                return () => unsubscribe();
            } else {
                setLoading(false);
            }
        });

        return () => unsubAuth();
    }, []);

    return { workspaces, loading };
};
