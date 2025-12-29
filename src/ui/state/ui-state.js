
// UI State Management

// Selection Mode State
export const selectionState = {
    isSelectionMode: false,
    selectedIds: new Set(),
};

// Listeners
const listeners = new Set();

export function subscribeToSelectionChange(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
}

function notifyListeners() {
    listeners.forEach(cb => cb({
        isSelectionMode: selectionState.isSelectionMode,
        selectedIds: selectionState.selectedIds
    }));
}

export function toggleSelectionMode(enabled) {
    selectionState.isSelectionMode = enabled;
    if (!enabled) {
        selectionState.selectedIds.clear();
    }
    notifyListeners();
}

export function toggleTaskSelection(taskId) {
    if (selectionState.selectedIds.has(taskId)) {
        selectionState.selectedIds.delete(taskId);
    } else {
        selectionState.selectedIds.add(taskId);
    }
    notifyListeners();
}

export function selectAllTasks(taskIds) {
    taskIds.forEach(id => selectionState.selectedIds.add(id));
    notifyListeners();
}

export function deselectAllTasks() {
    selectionState.selectedIds.clear();
    notifyListeners();
}
