import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Workspace, WorkspaceSchema } from '../schema';

interface WorkspaceState {
    currentWorkspaceId: string | null;
    workspaces: Workspace[];

    // Actions
    setCurrentWorkspaceId: (id: string | null) => void;
    setWorkspaces: (workspaces: Workspace[]) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
    persist(
        (set) => ({
            currentWorkspaceId: null,
            workspaces: [],

            setCurrentWorkspaceId: (id) => set({ currentWorkspaceId: id }),
            setWorkspaces: (workspaces) => {
                const validWorkspaces = workspaces.filter(w => {
                    const result = WorkspaceSchema.safeParse(w);
                    if (!result.success) {
                        console.error("Invalid workspace data:", w, result.error);
                        return false;
                    }
                    return true;
                });
                set({ workspaces: validWorkspaces });
            },
        }),
        {
            name: 'workspace-storage',
            // workspacesはFirestoreから取得するため永続化しない（同期ずれ防止）
            partialize: (state) => ({
                currentWorkspaceId: state.currentWorkspaceId,
            }),
        }
    )
);
