import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Workspace } from '../schema';

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
            setWorkspaces: (workspaces) => set({ workspaces }),
        }),
        {
            name: 'workspace-storage',
            partialize: (state) => ({
                currentWorkspaceId: state.currentWorkspaceId
            }),
        }
    )
);
