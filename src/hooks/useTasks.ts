import { useEffect, useState } from 'react';
import { subscribeToTasks } from '../store';
import { Task } from '../store/schema';
import { useWorkspace } from './useWorkspace';

export const useTasks = () => {
    const { workspaceId, loading: authLoading } = useWorkspace();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        if (!workspaceId) {
            setTasks([]);
            // workspaceIdがない場合、認証ロード中でなければロード完了扱い
            if (!authLoading) setLoading(false);
            return;
        }

        // ワークスペース変更時は即座にロード中＆空にする
        setLoading(true);
        setTasks([]);

        const unsubscribe = subscribeToTasks(workspaceId, (newTasks) => {
            if (isMounted) {
                setTasks(newTasks);
                setLoading(false);
            }
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, [workspaceId, authLoading]);

    return { tasks, loading: loading || authLoading };
};
