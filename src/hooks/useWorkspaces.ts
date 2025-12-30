import { useEffect, useState } from 'react';
import { auth } from '../core/firebase';
import { onAuthStateChanged } from '../core/firebase-sdk';
import { Workspace } from '../store/schema';
import { getWorkspaces, subscribeToWorkspaces } from '../store/workspace';

/**
 * ワークスペース一覧を購読するカスタムフック
 */
export const useWorkspaces = () => {
    const [workspaces, setWorkspaces] = useState<Workspace[]>(() => getWorkspaces());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                const unsubscribe = subscribeToWorkspaces(user.uid, (newWorkspaces) => {
                    setWorkspaces(newWorkspaces);
                    setLoading(false);
                });
                return () => unsubscribe();
            } else {
                setWorkspaces([]);
                setLoading(false);
            }
        });

        return () => unsubAuth();
    }, []);

    return { workspaces, loading };
};
