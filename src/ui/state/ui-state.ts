
// UI State Management

export interface SelectionState {
    isSelectionMode: boolean;
    selectedIds: Set<string>;
}

// Selection Mode State
export const selectionState: SelectionState = {
    isSelectionMode: false,
    selectedIds: new Set<string>(),
};

type SelectionChangeCallback = (state: SelectionState) => void;

// Listeners
const listeners = new Set<SelectionChangeCallback>();

export function subscribeToSelectionChange(callback: SelectionChangeCallback): () => void {
    listeners.add(callback);
    return () => listeners.delete(callback);
}

function notifyListeners() {
    listeners.forEach(cb => cb({
        isSelectionMode: selectionState.isSelectionMode,
        selectedIds: selectionState.selectedIds
    }));
}

export function toggleSelectionMode(enabled: boolean) {
    selectionState.isSelectionMode = enabled;
    if (!enabled) {
        selectionState.selectedIds.clear();
    }
    notifyListeners();
}

export function toggleTaskSelection(taskId: string) {
    if (selectionState.selectedIds.has(taskId)) {
        selectionState.selectedIds.delete(taskId);
    } else {
        selectionState.selectedIds.add(taskId);
    }
    notifyListeners();
}

export function selectAllTasks(taskIds: string[]) {
    taskIds.forEach(id => selectionState.selectedIds.add(id));
    notifyListeners();
}

export function deselectAllTasks() {
    selectionState.selectedIds.clear();
    notifyListeners();
}
