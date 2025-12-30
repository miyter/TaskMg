/**
 * サイドバーへのドラッグ&ドロップ制御 (DEPRECATED)
 * このファイルは React + @dnd-kit への移行により廃止されました。
 */

export function setupDropZone(element: HTMLElement, type: string, value: string | null = null) {
    // No-op: React side handles DND now.
    // console.debug('[Legacy DND] setupDropZone called but ignored.', type);
}

export async function handleTaskDrop(taskId: string, type: string, value: string | null) {
    // No-op
}
