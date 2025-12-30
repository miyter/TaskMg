import { useEffect, useState } from 'react';
import { APP_EVENTS } from '../core/event-constants';
import { getCurrentWorkspaceId } from '../store/workspace';

export const useWorkspace = () => {
    const [workspaceId, setWorkspaceId] = useState<string | null>(getCurrentWorkspaceId());

    useEffect(() => {
        // Update state if localStorage changed externally (though unlikely in SPA flow without event)
        const current = getCurrentWorkspaceId();
        if (current !== workspaceId) setWorkspaceId(current);

        const handleWorkspaceChange = (e: any) => {
            const newId = e.detail?.workspaceId;
            setWorkspaceId(newId);
        };

        document.addEventListener(APP_EVENTS.WORKSPACE_CHANGED, handleWorkspaceChange);
        return () => {
            document.removeEventListener(APP_EVENTS.WORKSPACE_CHANGED, handleWorkspaceChange);
        };
    }, []);

    return { workspaceId };
};
