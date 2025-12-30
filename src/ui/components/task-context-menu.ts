/**
 * タスクコンテキストメニュー
 */
import { Task } from '../../store/schema';

/**
 * タスクのコンテキストメニューを表示
 */
export function showTaskContextMenu(task: Task | null, x: number, y: number): void {
    // TODO: 実装が必要な場合は機能を追加
    console.debug('[TaskContextMenu] Context menu requested for task:', task?.id, 'at', x, y);
}
